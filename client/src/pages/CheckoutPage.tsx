import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/context/CartContext'
import { api } from '@/lib/api'

type PaymentMethod = 'cod' | 'card' | 'upi' | 'netbanking'

export function CheckoutPage() {
  const { items, remove, refresh } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    refresh().catch(() => {})
  }, [refresh])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = items.reduce((sum, item) => sum + item.discount * item.quantity, 0)
  const deliveryFee = subtotal > 50 ? 0 : items.length ? 5.99 : 0
  const total = Math.max(0, subtotal - discount + deliveryFee)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) return

    setError(null)
    setLoading(true)
    try {
      const fd = new FormData(e.target as HTMLFormElement)
      const payload = {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        mobile: String(fd.get('mobile') || ''),
        address: String(fd.get('address') || ''),
        pincode: String(fd.get('pincode') || ''),
        paymentMethod: String(fd.get('paymentMethod') || 'cod') as PaymentMethod,
        items: items.map((it) => ({
          title: it.title,
          description: it.description,
          mainImg: it.mainImg,
          size: it.size,
          quantity: it.quantity,
          price: it.price,
          discount: it.discount,
        })),
      }

      await api.post('/api/orders/create', payload)

      // Clear cart by deleting items
      await Promise.all(items.map((it) => remove(it.id)))
      navigate('/profile')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="text-slate-600">Complete your order in a few steps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input name="mobile" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input name="pincode" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea name="address" required />
                </div>
                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <select
                    name="paymentMethod"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                    defaultValue="cod"
                  >
                    <option value="cod">Cash on delivery</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="netbanking">Netbanking</option>
                  </select>
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <Button className="w-full md:w-auto" disabled={loading || !items.length}>
                  {loading ? 'Placing order…' : 'Place order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-slate-600">Items: {items.length}</div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery</span>
                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
              </div>
              {!items.length && <div className="text-sm text-slate-500">Your cart is empty.</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

