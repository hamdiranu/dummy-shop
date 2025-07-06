import removeEmptyValue from '@/utils/removeEmptyValue'
import api from './api'
import type {
  AddProductPayload,
  CartResponse,
  GetProductsResponse,
  IGetlListRequest,
  LoginPayload,
  LoginResponse,
  updateProductPayload,
} from './service.type'

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api({
    method: 'POST',
    url: `/auth/login`,
    data: payload,
  })
  return data
}

export const fetchUsers = async (params?: IGetlListRequest) => {
  const { data } = await api({
    method: 'GET',
    url: `/users`,
    params: removeEmptyValue(params || {}),
  })
  return data
}

export const fetchCurrentUsers = async () => {
  const { data } = await api({
    method: 'GET',
    url: `/users/me`,
  })
  return data
}

export const fetchProducts = async (params?: IGetlListRequest): Promise<GetProductsResponse> => {
  const { data } = await api({
    method: 'GET',
    url: `/products`,
    params: removeEmptyValue(params || {}),
  })
  return data
}

export const fetchProductsByCategory = async (slug: string, params?: IGetlListRequest) => {
  const { data } = await api({
    method: 'GET',
    url: `/products/category/${slug}`,
    params: removeEmptyValue(params || {}),
  })
  return data
}

export const fetchCarts = async (params?: IGetlListRequest): Promise<CartResponse> => {
  const { data } = await api({
    method: 'GET',
    url: `/carts`,
    params: removeEmptyValue(params || {}),
  })
  return data
}

export const fetchCategories = async (params?: IGetlListRequest) => {
  const { data } = await api({
    method: 'GET',
    url: `/products/categories`,
    params: removeEmptyValue(params || {}),
  })
  return data
}

export const postNewProduct = async (payload: AddProductPayload) => {
  const { data } = await api({
    method: 'POST',
    url: `/products/add`,
    data: payload,
  })
  return data
}

export const updateProduct = async (id: number, payload: updateProductPayload) => {
  const { data } = await api({
    method: 'PUT',
    url: `/products/${id}`,
    data: payload,
  })
  return data
}

export const deleteProduct = async (id: number) => {
  const { data } = await api({
    method: 'DELETE',
    url: `/products/${id}`,
  })
  return data
}
