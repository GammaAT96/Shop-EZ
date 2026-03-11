import type { ApiProduct, UiProduct } from '@/types'

export function toUiProduct(p: ApiProduct): UiProduct {
  const discount = Number(p.discount ?? 0)
  const price = Number(p.price ?? 0)
  return {
    id: p.id,
    name: p.title,
    price,
    originalPrice: discount > 0 ? price + discount : undefined,
    image:
      p.mainImg ||
      p.carousel?.[0] ||
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: p.category || 'General',
    rating: 4.6,
    reviews: 120,
    sizes: Array.isArray(p.sizes) ? p.sizes : undefined,
    description: p.description,
    gender: p.gender,
  }
}

