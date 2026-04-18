import axios from 'axios'

// ─── Instancia de axios ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Caché en memoria con TTL ─────────────────────────────────────────────────
// Solo se cachean GETs que cambian poco. Esto elimina refetches innecesarios
// al navegar entre páginas o volver de un modal.
const CACHE_TTL_MS = {
  '/admin/dashboard':    60 * 1000,       // 1 min
  '/admin/conductores':  30 * 1000,       // 30s
  '/admin/unidades':     60 * 1000,       // 1 min
  '/admin/tarifario':    5 * 60 * 1000,   // 5 min (raramente cambia)
  '/admin/comunicados':  2 * 60 * 1000,   // 2 min
  '/admin/pasajeros':    20 * 1000,       // 20s
  '/admin/viajes':       15 * 1000,       // 15s
  '/admin/penalidades':  15 * 1000,       // 15s
}

// ─── Mapa de auto-invalidación ────────────────────────────────────────────────
// Cuando se hace una mutación (POST/PUT/DELETE) en una ruta,
// se invalidan automáticamente las cachés de GET relacionadas.
// Las páginas NO necesitan llamar a invalidateCache manualmente.
const INVALIDATION_MAP = {
  '/admin/conductores':    ['/admin/conductores', '/admin/dashboard'],
  '/admin/pagar-sueldo':   ['/admin/conductores', '/admin/dashboard'],
  '/admin/asignar-unidad': ['/admin/conductores', '/admin/unidades'],
  '/admin/unidades':       ['/admin/unidades'],
  '/admin/comunicado':     ['/admin/comunicados'],
  '/admin/tarifario':      ['/admin/tarifario'],
}

const memCache = new Map() // url → { data, expiresAt }

function getCached(url) {
  const entry = memCache.get(url)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { memCache.delete(url); return null }
  return entry.data
}

function setCache(url, data) {
  // Quitar query params para la clave de caché de rutas paginadas
  const baseUrl = url.split('?')[0]
  const ttl = CACHE_TTL_MS[baseUrl]
  if (!ttl) return
  memCache.set(url, { data, expiresAt: Date.now() + ttl })
}

function autoInvalidate(mutationUrl) {
  const baseUrl = mutationUrl.split('?')[0]

  // Busca en el mapa usando prefijo: '/admin/comunicado/abc' matchea '/admin/comunicado'
  const toInvalidate = []
  for (const [mapKey, routes] of Object.entries(INVALIDATION_MAP)) {
    if (baseUrl === mapKey || baseUrl.startsWith(mapKey + '/')) {
      toInvalidate.push(...routes)
    }
  }

  for (const key of memCache.keys()) {
    const keyBase = key.split('?')[0]
    if (toInvalidate.includes(keyBase)) {
      memCache.delete(key)
    }
  }
}

// Exportar por si alguna página necesita invalidar manualmente
export function invalidateCache(url) { memCache.delete(url) }
export function clearAllCache()      { memCache.clear() }

// ─── Interceptor de request — adjunta JWT ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('subepe_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Interceptor de response ──────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase()
    const url    = response.config.url ?? ''

    if (method === 'get') {
      // Cachear GETs exitosos
      setCache(url, response.data)
    } else if (['post', 'put', 'patch', 'delete'].includes(method)) {
      // Auto-invalidar cachés relacionadas tras cualquier mutación
      autoInvalidate(url)
    }

    return response
  },
  (err) => {
    if (err.response?.status === 401) {
      clearAllCache()
      localStorage.removeItem('subepe_token')
      localStorage.removeItem('subepe_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Wrapper de GET con caché ─────────────────────────────────────────────────
const _get = api.get.bind(api)
api.get = (url, config) => {
  const cached = getCached(url)
  if (cached) {
    return Promise.resolve({ data: cached, status: 200, cached: true })
  }
  return _get(url, config)
}

export default api
