import React from 'react'
import { api } from '@/lib/api'
import type { ApiAuthResponse, ApiUser } from '@/types'

type AuthState = {
  token: string | null
  user: ApiUser | null
  loading: boolean
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = React.useState<ApiUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  const setSession = React.useCallback((nextToken: string | null, nextUser: ApiUser | null) => {
    setToken(nextToken)
    setUser(nextUser)
    if (nextToken) localStorage.setItem('token', nextToken)
    else localStorage.removeItem('token')
  }, [])

  const refreshMe = React.useCallback(async () => {
    if (!token) {
      setUser(null)
      return
    }
    const res = await api.get<{ user: ApiUser }>('/api/auth/me')
    setUser(res.data.user)
  }, [token])

  React.useEffect(() => {
    let cancelled = false
    async function boot() {
      try {
        if (token) await refreshMe()
      } catch {
        if (!cancelled) setSession(null, null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [token, refreshMe, setSession])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const res = await api.post<ApiAuthResponse>('/api/auth/login', { email, password })
      setSession(res.data.token, res.data.user)
    },
    [setSession]
  )

  const register = React.useCallback(
    async (username: string, email: string, password: string) => {
      const res = await api.post<ApiAuthResponse>('/api/auth/register', { username, email, password })
      setSession(res.data.token, res.data.user)
    },
    [setSession]
  )

  const logout = React.useCallback(() => {
    setSession(null, null)
  }, [setSession])

  const value: AuthContextValue = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    refreshMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

