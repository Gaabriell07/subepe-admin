import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import api from '@/lib/api'

function fmt(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function PenalidadesPage() {
  const [data,     setData]     = useState({ penalidades: [], total: 0, totalPaginas: 1 })
  const [page,     setPage]     = useState(1)
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const { data: res } = await api.get('/admin/penalidades', { params: { page, limit: 25 } })
      setData(res)
    } catch { /* silencioso */ }
    finally { setCargando(false) }
  }, [page])

  useEffect(() => { cargar() }, [cargar])

  const totalMonto = data.penalidades.reduce((acc, p) => acc + p.monto, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Penalidades</h1>
        <p className="text-muted-foreground text-sm">Registro de penalidades aplicadas a pasajeros</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total penalidades</p>
                <p className="text-2xl font-bold">{data.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Monto en esta página</p>
                <p className="text-2xl font-bold">S/ {totalMonto.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{data.total} penalidades registradas</CardTitle></CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pasajero</TableHead>
                    <TableHead>Origen → Destino</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.penalidades.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{p.pasajero?.usuario?.nombres} {p.pasajero?.usuario?.apellidos}</p>
                          <p className="text-xs text-muted-foreground">{p.pasajero?.usuario?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium">{p.viaje?.paraderoInicio}</p>
                          <p className="text-muted-foreground">→ {p.viaje?.paraderoFin}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        <span className="line-clamp-2">{p.motivo}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">S/ {Number(p.monto).toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmt(p.creadoEn)}</TableCell>
                    </TableRow>
                  ))}
                  {data.penalidades.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">Sin penalidades registradas</TableCell></TableRow>
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
