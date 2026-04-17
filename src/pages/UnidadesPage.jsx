import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Loader2, Bus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [open,     setOpen]     = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({ placa: '', nombre: '' })

  const cargar = async () => {
    setCargando(true)
    try {
      const { data } = await api.get('/admin/unidades')
      setUnidades(data)
    } catch { toast.error('Error al cargar unidades') }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post('/admin/unidades', form)
      toast.success('Unidad creada exitosamente')
      setOpen(false)
      setForm({ placa: '', nombre: '' })
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear unidad')
    } finally { setEnviando(false) }
  }

  const handleEliminar = async (u) => {
    if (!confirm(`¿Eliminar la unidad ${u.placa}?`)) return
    try {
      await api.delete(`/admin/unidades/${u.id}`)
      toast.success('Unidad eliminada')
      cargar()
    } catch { toast.error('No se puede eliminar: tiene viajes asociados') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Unidades</h1>
          <p className="text-muted-foreground text-sm">Gestiona los buses del sistema</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Nueva unidad</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Registrar bus</DialogTitle></DialogHeader>
            <form onSubmit={handleCrear} className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label>Placa</Label>
                <Input placeholder="Ej: ABC-123" value={form.placa} onChange={e => setForm({...form, placa: e.target.value.toUpperCase()})} required />
              </div>
              <div className="space-y-1">
                <Label>Nombre / descripción</Label>
                <Input placeholder="Ej: Bus Norte 01" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear unidad'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargando
          ? Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardContent className="pt-6 h-28 animate-pulse bg-muted rounded-xl" /></Card>)
          : unidades.map((u) => {
              const conductor = u.conductores?.[0]?.conductor
              return (
                <Card key={u.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <Bus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{u.placa}</p>
                          <p className="text-sm text-muted-foreground">{u.nombre}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleEliminar(u)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Conductor asignado</p>
                      {conductor
                        ? <p className="text-sm font-medium">{conductor.usuario?.nombres} {conductor.usuario?.apellidos}</p>
                        : <p className="text-sm text-muted-foreground italic">Sin conductor</p>
                      }
                    </div>
                  </CardContent>
                </Card>
              )
            })
        }
        {!cargando && unidades.length === 0 && (
          <div className="col-span-3 text-center text-muted-foreground py-16">
            <Bus className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay unidades registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
