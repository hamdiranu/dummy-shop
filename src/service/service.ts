import api from './api'
import type { GetProductsResponse, LoginPayload, LoginResponse } from './service.type'

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post('https://dummyjson.com/auth/login', payload)
  return data
}

export const fetchUsers = async () => {
  const { data } = await api.get('https://dummyjson.com/users')
  return data
}

export const fetchProducts = async (): Promise<GetProductsResponse> => {
  const { data } = await api.get('https://dummyjson.com/products?limit=100')
  return data
}

export const fetchCarts = async () => {
  const { data } = await api.get('https://dummyjson.com/carts')
  return data
}
