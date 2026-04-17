import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import api from '@/lib/api'

const CARNET_COLOR = {
  NORMAL:        'secondary',
  UNIVERSITARIO: 'default',
  ESCOLAR:       'default',
  POLICIA:       'outline',
  MILITAR:       'outline',
  ADULTO_MAYOR:  'secondary',
  DISCAPACITADO: 'destructive',
}

function fmt(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PasajerosPage() {
  const [data,     setData]     = useState({ pasajeros: [], total: 0, totalPaginas: 1 })
  const [page,     setPage]     = useState(1)
  const [buscar,   setBuscar]   = useState('')
  const [query,    setQuery]    = useState('')
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const { data: res } = await api.get('/admin/pasajeros', { params: { page, limit: 20, buscar: query } })
      setData(res)
    } catch { /* silencioso */ }
    finally { setCargando(false) }
  }, [page, query])

  useEffect(() => { cargar() }, [cargar])

  const handleBuscar = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(buscar)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pasajeros</h1>
        <p className="text-muted-foreground text-sm">Lista de pasajeros registrados en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">
              {data.total.toLocaleString()} pasajeros en total
            </CardTitle>
            <form onSubmit={handleBuscar} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 w-64"
                  placeholder="Buscar por nombre, DNI o email..."
                  value={buscar}
                  onChange={e => setBuscar(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">Buscar</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Carnet</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Viajes</TableHead>
                    <TableHead>Registrado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pasajeros.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{p.usuario.nombres} {p.usuario.apellidos}</p>
                          <p className="text-xs text-muted-foreground">{p.usuario.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{p.usuario.dni}</TableCell>
                      <TableCell><Badge variant={CARNET_COLOR[p.tipoCarnet] || 'secondary'}>{p.tipoCarnet}</Badge></TableCell>
                      <TableCell className="font-semibold">S/ {Number(p.saldo).toFixed(2)}</TableCell>
                      <TableCell>{p._count?.viajes ?? 0}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{fmt(p.usuario.creadoEn)}</TableCell>
                    </TableRow>
                  ))}
                  {data.pasajeros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                        No se encontraron resultados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {data.totalPaginas}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.totalPaginas, p + 1))} disabled={page === data.totalPaginas}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
