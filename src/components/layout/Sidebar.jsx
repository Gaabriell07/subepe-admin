import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, UserCheck, Bus, CreditCard,
  FileText, LogOut, Shield, TrendingUp, AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/conductores',  icon: UserCheck,        label: 'Conductores'  },
  { to: '/pasajeros',    icon: Users,            label: 'Pasajeros'    },
  { to: '/viajes',       icon: TrendingUp,       label: 'Viajes'       },
  { to: '/unidades',     icon: Bus,              label: 'Unidades'     },
  { to: '/tarifario',    icon: CreditCard,       label: 'Tarifario'    },
  { to: '/comunicados',  icon: FileText,         label: 'Comunicados'  },
  { to: '/penalidades',  icon: AlertTriangle,    label: 'Penalidades'  },
]

export default function Sidebar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <img src="/subepeicono.png" alt="SubePE Logo" className="w-9 h-9 object-contain" />
        <div>
          <p className="font-bold text-sm leading-tight">SubePE Admin</p>
          <p className="text-xs text-muted-foreground">Panel de gestión</p>
        </div>
      </div>

      <div className="h-px bg-border mx-0" />

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="h-px bg-border mx-0" />

      {/* Usuario + Logout */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {usuario?.nombres?.[0]}{usuario?.apellidos?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{usuario?.nombres} {usuario?.apellidos}</p>
            <p className="text-xs text-muted-foreground truncate">{usuario?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
