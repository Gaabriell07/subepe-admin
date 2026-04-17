import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('subepe_user')) } catch { return null }
  })
  const [cargando, setCargando] = useState(false)

  const login = async (email, password) => {
    setCargando(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.usuario?.rol !== 'ADMINISTRADOR') {
        throw new Error('Acceso solo para administradores')
      }
      localStorage.setItem('subepe_token', data.token)
      localStorage.setItem('subepe_user', JSON.stringify(data.usuario))
      setUsuario(data.usuario)
      return data
    } finally {
      setCargando(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('subepe_token')
    localStorage.removeItem('subepe_user')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
