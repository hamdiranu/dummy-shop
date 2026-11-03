<template>
  <div class="w-full">
    <template v-if="cart.length === 0">
      <!-- Empty Cart View -->
      <div class="empty-state min-h-[60vh]">
        <span
          class="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-50 text-brand-500 ring-1 ring-brand-100"
        >
          <SidebarTitle class="h-10 w-10" />
        </span>
        <h2 class="text-lg font-semibold text-slate-900 sm:text-xl">Your cart is empty</h2>
        <p class="mt-1 mb-6 text-sm text-slate-500">Add some products to get started</p>
        <RouterLink to="/shop" class="btn-primary">Continue Shopping</RouterLink>
      </div>
    </template>

    <template v-else>
      <!-- Cart Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Shopping Cart</h1>
          <p class="page-subtitle">{{ totalItems }} items in your cart</p>
        </div>
        <button
          class="btn-secondary hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          @click="clearCart"
        >
          <TrashIcon class="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
        <!-- Cart Items -->
        <div class="flex-1 space-y-3">
          <div
            v-for="item in cart"
            :key="item.id"
            class="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-4">
              <img
                :src="item.thumbnail"
                alt="product image"
                class="h-20 w-20 shrink-0 rounded-xl bg-slate-50 object-contain p-1 ring-1 ring-slate-100"
              />
              <div class="min-w-0">
                <p class="truncate font-semibold text-slate-900">{{ item.title }}</p>
                <p class="mt-0.5 text-sm text-slate-500">${{ item.price.toFixed(2) }} each</p>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div
                class="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-soft"
              >
                <button
                  @click="decreaseQuantity(item)"
                  class="grid h-9 w-9 place-items-center rounded-l-xl text-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span class="w-9 text-center text-sm font-semibold">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  class="grid h-9 w-9 place-items-center rounded-r-xl text-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span class="w-24 text-right font-bold text-slate-900">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </span>
              <button
                @click="removeItem(item.id)"
                class="btn-icon hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remove item"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card w-full space-y-5 p-6 lg:sticky lg:top-24 lg:w-96">
          <h3 class="text-lg font-semibold text-slate-900">Order Summary</h3>
          <div class="flex flex-col gap-3 text-sm">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span class="font-medium text-slate-900">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span class="badge bg-emerald-50 py-0.5 text-emerald-700">Free</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Tax</span>
              <span class="font-medium text-slate-900">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-dashed border-slate-200"></div>
            <div class="flex items-baseline justify-between">
              <span class="font-semibold text-slate-900">Total</span>
              <span class="text-2xl font-bold tracking-tight text-slate-900">
                ${{ total.toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <button @click="router.push('/checkout')" class="btn-primary w-full py-3">
              Proceed to Checkout
            </button>

            <button @click="router.push('/shop')" class="btn-ghost w-full">Continue Shopping</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { SidebarTitle, TrashIcon } from '@/assets/icons'
import { useCart } from '@/store'

interface CartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

const router = useRouter()

// Use cart from reactive object (NOT ref)
const { state, saveCart } = useCart()
const cart = state.cart

// Load cart from localStorage on mount
const loadCart = () => {
  const saved = localStorage.getItem('cart')
  if (saved) {
    cart.splice(0, cart.length, ...JSON.parse(saved)) // reactive array update
  }
}

onMounted(loadCart)

const subtotal = computed(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0))

const tax = computed(() => 2.0)
const total = computed(() => subtotal.value + tax.value)
const totalItems = computed(() => cart.reduce((sum, item) => sum + item.quantity, 0))

const increaseQuantity = (item: CartItem) => {
  item.quantity++
  saveCart()
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    removeItem(item.id)
  }
  saveCart()
}

const removeItem = (id: number) => {
  const index = cart.findIndex((item) => item.id === id)
  if (index !== -1) {
    cart.splice(index, 1)
  }
  saveCart()
}

const clearCart = () => {
  cart.splice(0)
  saveCart()
}
</script>
