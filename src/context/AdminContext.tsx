import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { AdminRole } from '../types'

interface AdminCtx {
  token: string | null
  role: AdminRole
  name: string
  isAuthenticated: boolean
  login: (token: string, role: AdminRole, name: string) => void
  logout: () => void
}

const CTX = createContext<AdminCtx | null>(null)

function storedRole(): AdminRole {
  try {
    const meta = JSON.parse(localStorage.getItem('admin_meta') ?? '{}')
    return (meta.role as AdminRole) ?? 'master'
  } catch {
    return 'master'
  }
}

function storedName(): string {
  try {
    const meta = JSON.parse(localStorage.getItem('admin_meta') ?? '{}')
    return meta.name ?? 'Admin'
  } catch {
    return 'Admin'
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'))
  const [role, setRole] = useState<AdminRole>(storedRole)
  const [name, setName] = useState<string>(storedName)

  const login = useCallback((t: string, r: AdminRole, n: string) => {
    localStorage.setItem('admin_token', t)
    localStorage.setItem('admin_meta', JSON.stringify({ role: r, name: n }))
    setToken(t)
    setRole(r)
    setName(n)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_meta')
    setToken(null)
    setRole('master')
    setName('Admin')
  }, [])

  return (
    <CTX.Provider value={{ token, role, name, isAuthenticated: !!token, login, logout }}>
      {children}
    </CTX.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(CTX)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
