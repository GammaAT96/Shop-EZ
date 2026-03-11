export type Role = 'user' | 'admin'

export type ApiUser = {
  id: string
  username: string
  email: string
  usertype: Role
  createdAt?: string
}

export type ApiAuthResponse = {
  user: ApiUser
  token: string
}

export type ApiProduct = {
  id: string
  title: string
  description: string
  mainImg: string
  carousel: string[]
  sizes: string[]
  category: string
  gender: string
  price: number
  discount: number
  createdAt?: string
}

export type ApiProductListResponse = {
  items: ApiProduct[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UiProduct = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  sizes?: string[]
  description?: string
  gender?: string
}

export type UiCartItem = UiProduct & {
  quantity: number
  selectedSize?: string
}

export type ApiCartItem = {
  id: string
  userId: string
  title: string
  description: string
  mainImg: string
  size: string
  quantity: number
  price: number
  discount: number
}

export type ApiOrder = {
  id: string
  userId: string
  name: string
  email: string
  mobile: string
  address: string
  pincode: string
  title: string
  description: string
  mainImg: string
  size: string
  quantity: number
  price: number
  discount: number
  paymentMethod: string
  orderDate: string
  deliveryDate?: string | null
  orderStatus: 'order placed' | 'in-transit' | 'delivered' | 'cancelled'
  createdAt?: string
}

