import React from 'react'
import { BarChart3, Box, Home, LogOut, Settings, ShoppingBag, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { ApiOrder, ApiProduct, ApiProductListResponse, ApiUser } from '@/types'

type TabId = 'dashboard' | 'products' | 'orders' | 'users' | 'settings'

function AdminSidebar({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const menuItems: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { id: 'products', label: 'Products', icon: <Box className="h-5 w-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 p-6">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="h-8 w-8 text-white" />
        <span className="text-2xl font-bold">Admin</span>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-white text-slate-900' : 'hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/api/analytics')
        if (!cancelled) setData(res.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div className="text-slate-600">Loading…</div>
  if (!data) return <div className="text-slate-600">No data.</div>

  const stats = [
    { label: 'Total Users', value: data.usersCount, icon: <Users className="h-6 w-6" /> },
    { label: 'Total Orders', value: data.ordersCount, icon: <ShoppingBag className="h-6 w-6" /> },
    { label: 'Total Products', value: data.productsCount, icon: <Box className="h-6 w-6" /> },
    { label: 'Net Revenue', value: `$${Number(data.revenue?.net ?? 0).toFixed(2)}`, icon: <BarChart3 className="h-6 w-6" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your store.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-slate-100 text-slate-900 p-3 rounded-xl">{s.icon}</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Products() {
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [showAdd, setShowAdd] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get<ApiProductListResponse>('/api/products', { params: { page: 1, limit: 50 } })
      setProducts(res.data.items)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load().catch(() => {})
  }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    const payload = {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      mainImg: String(fd.get('mainImg') || ''),
      carousel: String(fd.get('carousel') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      sizes: String(fd.get('sizes') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      category: String(fd.get('category') || ''),
      gender: String(fd.get('gender') || ''),
      price: Number(fd.get('price') || 0),
      discount: Number(fd.get('discount') || 0),
    }
    await api.post('/api/products', payload)
    setShowAdd(false)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this product?')) return
    await api.delete(`/api/products/${id}`)
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
          <p className="text-slate-600">Manage your product inventory</p>
        </div>
        <Button onClick={() => setShowAdd((s) => !s)} className="rounded-xl">
          Add Product
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Use comma-separated values for sizes/carousel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={create}>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input name="category" required />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input name="gender" required />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input name="price" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input name="discount" type="number" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label>Sizes (comma-separated)</Label>
                <Input name="sizes" placeholder="S,M,L,XL" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea name="description" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Main Image URL</Label>
                <Input name="mainImg" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Carousel URLs (comma-separated)</Label>
                <Input name="carousel" placeholder="https://..., https://..." />
              </div>
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-slate-600">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.mainImg} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium">{p.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>${p.discount}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => del(p.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = React.useState<ApiOrder[]>([])
  const [loading, setLoading] = React.useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get<ApiOrder[]>('/api/orders/all')
      setOrders(res.data)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load().catch(() => {})
  }, [])

  async function updateStatus(id: string, status: ApiOrder['orderStatus']) {
    await api.put(`/api/orders/status/${id}`, { status })
    await load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">Manage customer orders</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-slate-600">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id.slice(-6)}</TableCell>
                    <TableCell>
                      <Badge>{o.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>{o.name}</TableCell>
                    <TableCell>{o.title}</TableCell>
                    <TableCell>
                      <select className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm" value={o.orderStatus} onChange={(e) => updateStatus(o.id, e.target.value as any)}>
                        <option value="order placed">order placed</option>
                        <option value="in-transit">in-transit</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = React.useState<ApiUser[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get<ApiUser[]>('/api/users')
        if (!cancelled) setUsers(res.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Users</h1>
        <p className="text-slate-600">All registered users</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-slate-600">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge>{u.usertype}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsTab() {
  const [banner, setBanner] = React.useState<string>('')
  const [categories, setCategories] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get<{ banner: string | null; categories: string[] }>('/api/banner')
      setBanner(res.data.banner || '')
      setCategories((res.data.categories || []).join(', '))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load().catch(() => {})
  }, [])

  async function save() {
    const payload = {
      banner,
      categories: categories
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    await api.put('/api/banner/update', payload)
    await load()
    alert('Saved')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Banner and categories</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Homepage Banner</CardTitle>
          <CardDescription>Update banner URL shown on homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-slate-600">Loading…</div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Banner URL</Label>
                <Input value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Categories (comma-separated)</Label>
                <Input value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Clothing, Electronics, ..." />
              </div>
              <Button onClick={save}>Save</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminPage() {
  const [tab, setTab] = React.useState<TabId>('dashboard')
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activeTab={tab} onTabChange={setTab} />
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-end mb-6">
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'products' && <Products />}
        {tab === 'orders' && <Orders />}
        {tab === 'users' && <UsersTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

