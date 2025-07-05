import type { IProduct } from './product/product.type'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface GetPayload {
  limit?: number
  skip?: number
}

export interface CommonGetResponse {
  total: number
  skip: number
  limit: number
}

export interface GetProductsResponse extends CommonGetResponse {
  products: IProduct[]
  skip: number
  limit: number
}

export interface ICartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
  discountPercentage?: number
}

export interface Product {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountedPrice: number
  thumbnail: string
}

export interface Item {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface IOrderSaved {
  id: number
  products: Product[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
  date: string
  status: string
  items: Item[]
  shippingInfo: ShippingInfo
}

export interface updateProductPayload {
  title: string
  description: string
  price: number
  stock: number
}

export interface AddProductPayload extends updateProductPayload {
  brand: string
  category: string
}
