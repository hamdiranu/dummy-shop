// src/store/cart.ts
import type { ICartItem } from '@/service'
import { reactive, computed } from 'vue'

const state = reactive({
  cart: JSON.parse(localStorage.getItem('cart') || '[]') as ICartItem[],
})

const cartQuantity = computed(() => state.cart.reduce((sum, item) => sum + item.quantity, 0))

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(state.cart))
}

const updateCartFromLocalStorage = () => {
  state.cart.splice(0, state.cart.length, ...JSON.parse(localStorage.getItem('cart') || '[]'))
}

export const useCart = () => ({
  state,
  cartQuantity,
  saveCart,
  updateCartFromLocalStorage,
})
