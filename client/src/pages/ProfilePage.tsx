import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { ApiOrder } from '@/types'

function statusBadgeClass(status: ApiOrder['orderStatus']) {
  switch (status) {
    case 'order placed':
      return 'bg-blue-100 text-blue-800 border-0'
    case 'in-transit':
      return 'bg-yellow-100 text-yellow-800 border-0'
    case 'delivered':
      return 'bg-green-100 text-green-800 border-0'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-0'
  }
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = React.useState<ApiOrder[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await api.get<ApiOrder[]>('/api/orders/me')
      setOrders(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load().catch(() => {})
  }, [])

  async function cancel(orderId: string) {
    try {
      await api.put(`/api/orders/${orderId}/cancel`)
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Cancel failed')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-slate-600">Loading…</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {!loading && !orders.length && <div className="text-slate-600">No orders yet.</div>}

          {orders.map((o) => (
            <div key={o.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-semibold text-slate-900">Order #{o.id.slice(-6)}</div>
                <Badge className={statusBadgeClass(o.orderStatus)}>{o.orderStatus}</Badge>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {o.title} × {o.quantity} — ${o.price}
              </div>
              <div className="mt-1 text-xs text-slate-500">Placed: {new Date(o.orderDate).toLocaleString()}</div>
              <div className="mt-3 flex gap-2">
                {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
                  <Button variant="outline" className="text-red-600" onClick={() => cancel(o.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

