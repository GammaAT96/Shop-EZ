import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export function AuthPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.target as HTMLFormElement)
    try {
      if (mode === 'login') {
        await login(String(form.get('email') || ''), String(form.get('password') || ''))
      } else {
        await register(String(form.get('username') || ''), String(form.get('email') || ''), String(form.get('password') || ''))
      }
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Login' : 'Create account'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === 'register' && (
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="username" placeholder="Your name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button className="w-full" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
            >
              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

