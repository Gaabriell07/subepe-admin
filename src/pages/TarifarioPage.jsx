import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Loader2, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

const CARNETS = ['NORMAL','UNIVERSITARIO','ESCOLAR','POLICIA','MILITAR','ADULTO_MAYOR','DISCAPACITADO']

export default function TarifarioPage() {
  const [tarifas,  setTarifas]  = useState([])
  const [cargando, setCargando] = useState(true)
  const [open,     setOpen]     = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({ tipoCarnet: 'NORMAL', precio: '', descripcion: '' })

  const cargar = async () => {
    setCargando(true)
    try {
      const { data } = await api.get('/admin/tarifario')
      setTarifas(data)
    } catch { toast.error('Error al cargar tarifario') }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleGuardar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post('/admin/tarifario', { ...form, precio: parseFloat(form.precio) })
      toast.success('Tarifa actualizada')
      setOpen(false)
      setForm({ tipoCarnet: 'NORMAL', precio: '', descripcion: '' })
      cargar()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally { setEnviando(false) }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarifario</h1>
          <p className="text-muted-foreground text-sm">Configura los precios por tipo de carnet</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Nueva tarifa</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Configurar tarifa</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground -mt-1">Si ya existe una tarifa activa para el mismo carnet, será reemplazada.</p>
            <form onSubmit={handleGuardar} className="space-y-3 mt-1">
              <div className="space-y-1">
                <Label>Tipo de carnet</Label>
                <Select value={form.tipoCarnet} onValueChange={v => setForm({...form, tipoCarnet: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CARNETS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Precio (S/)</Label>
                <Input type="number" step="0.10" min="0" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <Label>Descripción (opcional)</Label>
                <Input value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Ej: Tarifa universitaria 2026" />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar tarifa'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargando
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="pt-6 h-24 animate-pulse bg-muted rounded-xl" /></Card>)
          : tarifas.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <Badge variant="outline">{t.tipoCarnet}</Badge>
                </div>
                <p className="text-2xl font-bold">S/ {Number(t.precio).toFixed(2)}</p>
                {t.descripcion && <p className="text-xs text-muted-foreground mt-1">{t.descripcion}</p>}
              </CardContent>
            </Card>
          ))
        }
        {!cargando && tarifas.length === 0 && (
          <div className="col-span-3 text-center text-muted-foreground py-16">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay tarifas configuradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
