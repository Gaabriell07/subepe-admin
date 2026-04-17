import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, TrendingUp, DollarSign, Activity, Bus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import api from '@/lib/api'

function StatCard({ title, value, sub, icon: Icon, color = 'text-primary' }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1">{value ?? '—'}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl bg-muted ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Datos de ejemplo para las gráficas (en producción vendrían del backend)
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const mockSemana = DIAS_SEMANA.map((d) => ({ dia: d, viajes: Math.floor(Math.random() * 80 + 20) }))

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Resumen general del sistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Pasajeros registrados"
          value={cargando ? '...' : stats?.totalPasajeros?.toLocaleString()}
          icon={Users}
          color="text-blue-500"
        />
        <StatCard
          title="Conductores activos"
          value={cargando ? '...' : stats?.totalConductores}
          icon={UserCheck}
          color="text-green-500"
        />
        <StatCard
          title="Viajes este mes"
          value={cargando ? '...' : stats?.viajesMes?.toLocaleString()}
          sub="Mes en curso"
          icon={TrendingUp}
          color="text-orange-500"
        />
        <StatCard
          title="Viajes esta semana"
          value={cargando ? '...' : stats?.viajesSemana?.toLocaleString()}
          sub="Últimos 7 días"
          icon={Activity}
          color="text-purple-500"
        />
        <StatCard
          title="Ingresos del mes"
          value={cargando ? '...' : `S/ ${Number(stats?.ingresosMes || 0).toFixed(2)}`}
          sub="Recargas completadas"
          icon={DollarSign}
          color="text-emerald-500"
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Viajes por día (esta semana)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockSemana} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="dia" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="viajes" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tendencia de viajes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockSemana}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="viajes" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Bus className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sistema</p>
                <p className="font-semibold">SubePE Transit</p>
                <p className="text-xs text-muted-foreground">CPSA · Ruta única</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">Accesos rápidos</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '+ Nuevo conductor', href: '/conductores' },
                { label: '+ Nueva unidad', href: '/unidades' },
                { label: '+ Comunicado', href: '/comunicados' },
                { label: 'Ver viajes hoy', href: '/viajes' },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-muted/70 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
