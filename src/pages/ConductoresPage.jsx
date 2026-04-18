import { useEffect, useState } from 'react'
import { soloLetras, soloDni } from '@/lib/validaciones'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserPlus, Loader2, Bus, DollarSign, UserX } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

const SEXOS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO',  label: 'Femenino'  },
  { value: 'OTRO',      label: 'Otro'       },
]

const ESTADO_COLOR = {
  ACTIVO:     'default',
  INACTIVO:   'secondary',
  SUSPENDIDO: 'destructive',
}

export default function ConductoresPage() {
  const [conductores, setConductores]   = useState([])
  const [unidades,    setUnidades]      = useState([])
  const [cargando,    setCargando]      = useState(true)
  const [openNuevo,   setOpenNuevo]     = useState(false)
  const [openPago,    setOpenPago]      = useState(false)
  const [openUnidad,  setOpenUnidad]    = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)
  const [enviando,    setEnviando]      = useState(false)

  // Form nuevo conductor
  const [form, setForm] = useState({ email: '', password: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '', sexo: 'MASCULINO' })
  const [montoPago, setMontoPago]   = useState('')
  const [unidadId,  setUnidadId]    = useState('')

  const cargar = async () => {
    setCargando(true)
    try {
      const [resConductores, resUnidades] = await Promise.all([
        api.get('/admin/conductores'),
        api.get('/admin/unidades'),
      ])
      setConductores(resConductores.data)
      setUnidades(resUnidades.data)
    } catch { toast.error('Error al cargar datos') }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post('/admin/conductores', form)
      toast.success('Conductor creado exitosamente')
      setOpenNuevo(false)
      setForm({ email: '', password: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '', sexo: 'MASCULINO' })
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear conductor')
    } finally { setEnviando(false) }
  }

  const handlePagar = async (e) => {
    e.preventDefault()
    if (!montoPago || !seleccionado) return
    setEnviando(true)
    try {
      await api.post('/admin/pagar-sueldo', { conductorId: seleccionado.id, monto: parseFloat(montoPago) })
      toast.success('Sueldo pagado exitosamente')
      setOpenPago(false)
      setMontoPago('')
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al pagar sueldo')
    } finally { setEnviando(false) }
  }

  const handleAsignarUnidad = async (e) => {
    e.preventDefault()
    if (!unidadId || !seleccionado) return
    setEnviando(true)
    try {
      await api.post('/admin/asignar-unidad', { conductorId: seleccionado.id, unidadId })
      toast.success('Unidad asignada exitosamente')
      setOpenUnidad(false)
      setUnidadId('')
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al asignar unidad')
    } finally { setEnviando(false) }
  }

  const handleDesactivar = async (conductor) => {
    if (!confirm(`¿Desactivar a ${conductor.usuario.nombres}?`)) return
    try {
      await api.delete(`/admin/conductores/${conductor.id}`)
      toast.success('Conductor desactivado')
      cargar()
    } catch { toast.error('Error al desactivar conductor') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conductores</h1>
          <p className="text-muted-foreground text-sm">Gestiona el personal conductor</p>
        </div>
        <Dialog open={openNuevo} onOpenChange={setOpenNuevo}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" />Nuevo conductor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar nuevo conductor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCrear} className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Nombres</Label>
                  <Input
                    value={form.nombres}
                    onChange={e => setForm({...form, nombres: soloLetras(e.target.value)})}
                    placeholder="Ej: Juan Carlos"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Apellidos</Label>
                  <Input
                    value={form.apellidos}
                    onChange={e => setForm({...form, apellidos: soloLetras(e.target.value)})}
                    placeholder="Ej: García"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>DNI</Label>
                <Input
                  value={form.dni}
                  onChange={e => setForm({...form, dni: soloDni(e.target.value)})}
                  maxLength={8}
                  placeholder="12345678"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="space-y-1"><Label>Fecha de nacimiento</Label><Input type="date" value={form.fechaNacimiento} onChange={e => setForm({...form, fechaNacimiento: e.target.value})} required /></div>
              <div className="space-y-1">
                <Label>Sexo</Label>
                <Select value={form.sexo} onValueChange={v => setForm({...form, sexo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SEXOS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="space-y-1"><Label>Contraseña temporal</Label><Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando...</> : 'Crear conductor'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lista de conductores ({conductores.length})</CardTitle></CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Unidad asignada</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conductores.map((c) => {
                  const ultimaUnidad = c.unidades?.[0]?.unidad
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{c.usuario.nombres} {c.usuario.apellidos}</p>
                          <p className="text-xs text-muted-foreground">{c.usuario.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{c.usuario.dni}</TableCell>
                      <TableCell><Badge variant={ESTADO_COLOR[c.estado] || 'secondary'}>{c.estado}</Badge></TableCell>
                      <TableCell>{ultimaUnidad ? <span className="text-sm">{ultimaUnidad.placa} · {ultimaUnidad.nombre}</span> : <span className="text-muted-foreground text-sm">Sin asignar</span>}</TableCell>
                      <TableCell className="font-semibold">S/ {c.saldo?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => { setSeleccionado(c); setOpenUnidad(true) }}>
                            <Bus className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setSeleccionado(c); setOpenPago(true) }}>
                            <DollarSign className="w-3.5 h-3.5" />
                          </Button>
                          {c.estado === 'ACTIVO' && (
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDesactivar(c)}>
                              <UserX className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal pagar sueldo */}
      <Dialog open={openPago} onOpenChange={setOpenPago}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Pagar sueldo</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{seleccionado?.usuario.nombres} {seleccionado?.usuario.apellidos}</p>
          <form onSubmit={handlePagar} className="space-y-3">
            <div className="space-y-1"><Label>Monto (S/)</Label><Input type="number" step="0.01" min="1" value={montoPago} onChange={e => setMontoPago(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar pago'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal asignar unidad */}
      <Dialog open={openUnidad} onOpenChange={setOpenUnidad}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Asignar unidad</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{seleccionado?.usuario.nombres} {seleccionado?.usuario.apellidos}</p>
          <form onSubmit={handleAsignarUnidad} className="space-y-3">
            <div className="space-y-1">
              <Label>Selecciona la unidad</Label>
              <Select value={unidadId} onValueChange={setUnidadId}>
                <SelectTrigger><SelectValue placeholder="Elige un bus..." /></SelectTrigger>
                <SelectContent>
                  {unidades.map(u => <SelectItem key={u.id} value={u.id}>{u.placa} · {u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={enviando || !unidadId}>
              {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Asignar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
