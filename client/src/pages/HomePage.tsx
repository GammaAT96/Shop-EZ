import React from 'react'
import { ChevronDown, Heart, MapPin, Mail, Phone, ShoppingBag, Star, Truck, Shield, CreditCard, Package, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { api } from '@/lib/api'
import { toUiProduct } from '@/lib/mappers'
import type { ApiProductListResponse, UiProduct } from '@/types'
import { useCart } from '@/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const fallbackProducts: UiProduct[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    rating: 4.5,
    reviews: 128,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-quality cotton t-shirt with premium finish',
    gender: 'Men',
  },
]

const defaultCategories = [
  { name: 'Clothing', icon: '👕', count: 0 },
  { name: 'Electronics', icon: '📱', count: 0 },
  { name: 'Footwear', icon: '👟', count: 0 },
  { name: 'Accessories', icon: '👜', count: 0 },
  { name: 'Home', icon: '🏠', count: 0 },
  { name: 'Sports', icon: '⚽', count: 0 },
]

function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-slate-100 via-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="w-fit">New Collection 2024</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">Discover Your Style</h1>
            <p className="text-lg text-slate-600">
              Shop the latest trends with up to 50% off on selected items. Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl" onClick={() => document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl" onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
                View Collection
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-500">Happy Customers</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-2xl font-bold text-slate-900">5K+</div>
                <div className="text-sm text-slate-500">Products</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-2xl font-bold text-slate-900">4.8★</div>
                <div className="text-sm text-slate-500">Rating</div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoriesSection({ categories }: { categories: Array<{ name: string; icon: string; count: number }> }) {
  return (
    <section id="categories" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Shop by Category</h2>
          <p className="text-slate-600">Explore our wide range of products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.count} items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, onAdd }: { product: UiProduct; onAdd: (p: UiProduct) => void }) {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const images = [product.image, product.image]

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="relative overflow-hidden aspect-square">
        <img src={images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && <Badge className="bg-pink-500 text-white border-0">-{discount}%</Badge>}
        </div>
        <Button size="icon" variant="secondary" className="absolute top-3 right-3 rounded-full bg-white hover:bg-slate-100 shadow-md" onClick={() => alert('Wishlist coming soon')}>
          <Heart className="h-4 w-4 text-slate-700" />
        </Button>
        {images.length > 1 && (
          <>
            <Button size="icon" variant="secondary" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCurrentImageIndex((p) => (p === 0 ? 1 : 0))}>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button size="icon" variant="secondary" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCurrentImageIndex((p) => (p === 0 ? 1 : 0))}>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-900 mb-2 text-lg">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1 text-slate-900">{product.rating}</span>
          </div>
          <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-slate-900">${product.price}</span>
          {product.originalPrice && <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>}
        </div>
        <Button className="w-full rounded-xl" onClick={() => onAdd(product)}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

function ProductGrid({ products, onAdd, title, description }: { products: UiProduct[]; onAdd: (p: UiProduct) => void; title: string; description: string }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-500">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: <Truck className="h-8 w-8" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <Shield className="h-8 w-8" />, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: <CreditCard className="h-8 w-8" />, title: 'Easy Returns', description: '30-day return policy' },
    { icon: <Package className="h-8 w-8" />, title: 'Quality Products', description: 'Verified and authentic' },
  ]
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="bg-slate-100 text-slate-900 p-4 rounded-2xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    { question: 'What is your shipping policy?', answer: 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.' },
    { question: 'What is your return policy?', answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates vary.' },
    { question: 'How can I track my order?', answer: 'Once your order ships, you will receive a tracking number via email and you can also track from your profile.' },
  ]
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Find answers to common questions</p>
        </div>
        <Accordion className="space-y-4" type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-slate-200 rounded-xl px-6">
              <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-slate-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">shopEZ</span>
            </div>
            <p className="text-sm mb-4">Your one-stop shop for quality products at amazing prices.</p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-white" onClick={() => window.open('https://facebook.com', '_blank')}>
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-white" onClick={() => window.open('https://twitter.com', '_blank')}>
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-white" onClick={() => window.open('https://instagram.com', '_blank')}>
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-white" onClick={() => window.open('https://linkedin.com', '_blank')}>
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@shopez.com</span>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="bg-slate-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2024 shopEZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export function HomePage() {
  const { add } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = React.useState<UiProduct[]>([])
  const [categories, setCategories] = React.useState(defaultCategories)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get<ApiProductListResponse>('/api/products', { params: { page: 1, limit: 16 } }),
          api.get<{ categories: string[] }>('/api/categories'),
        ])
        if (cancelled) return
        const items = prodRes.data.items.map(toUiProduct)
        setProducts(items)
        const catNames = catRes.data.categories || []
        if (catNames.length) {
          setCategories(defaultCategories.map((c) => ({ ...c, count: 0 })).map((c) => ({ ...c, name: catNames.includes(c.name) ? c.name : c.name })))
        }
      } catch {
        if (!cancelled) setProducts(fallbackProducts)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function onAdd(p: UiProduct) {
    try {
      await add(p)
    } catch {
      navigate('/auth')
    }
  }

  return (
    <div className="bg-white">
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <section id="deals">
        <ProductGrid products={products.filter((p) => p.originalPrice)} onAdd={onAdd} title="Featured Products" description="Discover our handpicked selection of premium products" />
      </section>
      <FeaturesSection />
      <section id="new-arrivals">
        <ProductGrid products={products.slice(0, 8)} onAdd={onAdd} title="New Arrivals" description="Fresh styles just for you!" />
      </section>
      <FAQSection />
      <Footer />
      {user?.usertype === 'admin' && (
        <Button className="fixed bottom-6 right-6 rounded-full shadow-lg" size="lg" onClick={() => navigate('/admin')}>
          Admin Panel
        </Button>
      )}
    </div>
  )
}

