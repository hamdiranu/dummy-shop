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
