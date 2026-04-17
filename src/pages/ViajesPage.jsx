import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import api from '@/lib/api'

const ESTADOS = ['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'PENALIZADO']
const ESTADO_COLOR = {
  PENDIENTE:  'secondary',
  EN_CURSO:   'default',
  COMPLETADO: 'outline',
  PENALIZADO: 'destructive',
}

function fmt(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function ViajesPage() {
  const [data,     setData]     = useState({ viajes: [], total: 0, totalPaginas: 1 })
  const [page,     setPage]     = useState(1)
  const [estado,   setEstado]   = useState('todos')
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const params = { page, limit: 25, ...(estado !== 'todos' && { estado }) }
      const { data: res } = await api.get('/admin/viajes', { params })
      setData(res)
    } catch { /* silencioso */ }
    finally { setCargando(false) }
  }, [page, estado])

  useEffect(() => { setPage(1) }, [estado])
  useEffect(() => { cargar() },  [cargar])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Viajes</h1>
        <p className="text-muted-foreground text-sm">Historial global de todos los viajes del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">{data.total.toLocaleString()} viajes registrados</CardTitle>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Filtrar estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
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
                    <TableHead>Pasajero</TableHead>
                    <TableHead>Conductor</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Origen → Destino</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.viajes.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium text-sm">
                        {v.pasajero?.usuario?.nombres} {v.pasajero?.usuario?.apellidos}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {v.conductor ? `${v.conductor.usuario?.nombres} ${v.conductor.usuario?.apellidos}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">{v.ruta?.nombre || '-'}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-0.5">
                          <p className="font-medium">{v.paraderoInicio}</p>
                          <p className="text-muted-foreground">→ {v.paraderoFin}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={ESTADO_COLOR[v.estado] || 'secondary'}>{v.estado}</Badge></TableCell>
                      <TableCell className="font-semibold text-sm">
                        {v.montoDescontado === 0 ? <span className="text-green-600">GRATIS</span> : `S/ ${Number(v.montoDescontado).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmt(v.creadoEn)}</TableCell>
                    </TableRow>
                  ))}
                  {data.viajes.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">Sin viajes registrados</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Página {page} de {data.totalPaginas}</p>
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
