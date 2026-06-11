import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Check, X, Image as ImageIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function SolicitudesCarnetPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [estadoTab, setEstadoTab] = useState('PENDIENTE')
  const [procesandoId, setProcesandoId] = useState(null)

  const [openImg, setOpenImg] = useState(false)
  const [imgUrl, setImgUrl] = useState('')

  const cargar = async () => {
    setCargando(true)
    try {
      const { data } = await api.get(`/admin/solicitudes-carnet?estado=${estadoTab}`)
      setSolicitudes(data)
    } catch {
      toast.error('Error al cargar solicitudes')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [estadoTab])

  const handleAprobar = async (id) => {
    if (!confirm('¿Aprobar esta solicitud y actualizar el carnet del pasajero?')) return
    setProcesandoId(id)
    try {
      await api.put(`/admin/solicitudes-carnet/${id}/aprobar`)
      toast.success('Solicitud aprobada exitosamente')
      cargar()
    } catch {
      toast.error('Error al aprobar')
    } finally {
      setProcesandoId(null)
    }
  }

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo de rechazo (opcional):')
    if (motivo === null) return 
    setProcesandoId(id)
    try {
      await api.put(`/admin/solicitudes-carnet/${id}/rechazar`, { motivo })
      toast.success('Solicitud rechazada')
      cargar()
    } catch {
      toast.error('Error al rechazar')
    } finally {
      setProcesandoId(null)
    }
  }

  const verImagen = (url) => {
    setImgUrl(url)
    setOpenImg(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Solicitudes de Carnet</h1>
        <p className="text-muted-foreground text-sm">Verifica los documentos subidos por los pasajeros</p>
      </div>

      <Tabs value={estadoTab} onValueChange={setEstadoTab} className="w-full">
        <TabsList>
          <TabsTrigger value="PENDIENTE">Pendientes</TabsTrigger>
          <TabsTrigger value="APROBADA">Aprobadas</TabsTrigger>
          <TabsTrigger value="RECHAZADA">Rechazadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Solicitudes ({solicitudes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : solicitudes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay solicitudes en este estado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Pasajero</TableHead>
                  <TableHead>Tipo Solicitado</TableHead>
                  <TableHead>Documento</TableHead>
                  {estadoTab === 'PENDIENTE' && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm">
                      {new Date(s.creadoEn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{s.pasajero?.usuario?.nombres} {s.pasajero?.usuario?.apellidos}</p>
                        <p className="text-xs text-muted-foreground">DNI: {s.pasajero?.usuario?.dni}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.tipoCarnetSolicitado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm" onClick={() => verImagen(s.urlImagenDocumento)}>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Ver Foto
                      </Button>
                    </TableCell>
                    {estadoTab === 'PENDIENTE' && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            disabled={procesandoId === s.id}
                            onClick={() => handleAprobar(s.id)}
                          >
                            {procesandoId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                            Aprobar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={procesandoId === s.id}
                            onClick={() => handleRechazar(s.id)}
                          >
                            {procesandoId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                            Rechazar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={openImg} onOpenChange={setOpenImg}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Evidencia Fotográfica</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center mt-4 bg-muted rounded-md p-2 min-h-[300px]">
            {imgUrl ? (
              <img src={imgUrl} alt="Documento" className="max-w-full max-h-[70vh] object-contain rounded" />
            ) : (
              <p className="text-muted-foreground">No hay imagen disponible</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
