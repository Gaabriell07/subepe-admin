import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import Layout       from '@/components/layout/Layout'
import LoginPage    from '@/pages/LoginPage'
import DashboardPage    from '@/pages/DashboardPage'
import ConductoresPage  from '@/pages/ConductoresPage'
import PasajerosPage    from '@/pages/PasajerosPage'
import ViajesPage       from '@/pages/ViajesPage'
import UnidadesPage     from '@/pages/UnidadesPage'
import TarifarioPage    from '@/pages/TarifarioPage'
import ComunicadosPage  from '@/pages/ComunicadosPage'
import PenalidadesPage  from '@/pages/PenalidadesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="conductores"  element={<ConductoresPage />} />
            <Route path="pasajeros"    element={<PasajerosPage />} />
            <Route path="viajes"       element={<ViajesPage />} />
            <Route path="unidades"     element={<UnidadesPage />} />
            <Route path="tarifario"    element={<TarifarioPage />} />
            <Route path="comunicados"  element={<ComunicadosPage />} />
            <Route path="penalidades"  element={<PenalidadesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </AuthProvider>
  )
}
