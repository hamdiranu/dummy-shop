import api from './api'
import type {
  AddProductPayload,
  GetProductsResponse,
  LoginPayload,
  LoginResponse,
  updateProductPayload,
} from './service.type'

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

export const fetchCategories = async () => {
  const { data } = await api.get('https://dummyjson.com/products/categories')
  return data
}

export const postNewProduct = async (payload: AddProductPayload) => {
  const { data } = await api.post('https://dummyjson.com/products/add', payload)
  return data
}

export const updateProduct = async (id: number, payload: updateProductPayload) => {
  const { data } = await api.put(`https://dummyjson.com/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete(`https://dummyjson.com/products/${id}`)
  return data
}
