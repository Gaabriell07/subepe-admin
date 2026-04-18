import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, FileText, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

function fmt(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState([])
  const [cargando,    setCargando]    = useState(true)
  const [open,        setOpen]        = useState(false)
  const [enviando,    setEnviando]    = useState(false)
  const [form, setForm] = useState({ titulo: '', contenido: '' })

  const cargar = async () => {
    setCargando(true)
    try {
      const { data } = await api.get('/admin/comunicados')
      setComunicados(data)
    } catch { toast.error('Error al cargar comunicados') }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleEliminar = async (c) => {
    if (!confirm(`¿Eliminar el comunicado "${c.titulo}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/admin/comunicado/${c.id}`)
      toast.success('Comunicado eliminado')
      cargar()
    } catch { toast.error('Error al eliminar el comunicado') }
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post('/admin/comunicado', form)
      toast.success('Comunicado publicado')
      setOpen(false)
      setForm({ titulo: '', contenido: '' })
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al publicar')
    } finally { setEnviando(false) }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comunicados</h1>
          <p className="text-muted-foreground text-sm">Avisos visibles para los pasajeros en la app</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Nuevo comunicado</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Publicar comunicado</DialogTitle></DialogHeader>
            <form onSubmit={handleCrear} className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label>Título</Label>
                <Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej: Cambio de horario" required />
              </div>
              <div className="space-y-1">
                <Label>Contenido</Label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px] resize-none"
                  value={form.contenido}
                  onChange={e => setForm({...form, contenido: e.target.value})}
                  placeholder="Escribe el mensaje para los pasajeros..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publicar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {cargando
          ? Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardContent className="pt-4 h-20 animate-pulse bg-muted rounded-xl" /></Card>)
          : comunicados.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{c.titulo}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{fmt(c.creadoEn)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.contenido}</p>
                    {c.administrador?.usuario && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Por: {c.administrador.usuario.nombres} {c.administrador.usuario.apellidos}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive shrink-0 self-start"
                    onClick={() => handleEliminar(c)}
                    title="Eliminar comunicado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        }
        {!cargando && comunicados.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay comunicados publicados</p>
          </div>
        )}
      </div>
    </div>
  )
}
