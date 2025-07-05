<template>
  <div class="w-[100%]">
    <template v-if="cart.length === 0">
      <!-- Empty Cart View -->
      <div class="h-[60vh] w-full flex flex-col justify-center items-center px-4 text-center">
        <SidebarTitle class="w-32 h-32 text-[#6F7074] mb-4" />
        <div class="flex flex-col justify-center items-center gap-2">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Your cart is empty</h2>
          <p class="text-md text-[#71717a] mb-4">Add some products to get started</p>
        </div>
        <RouterLink
          to="/shop"
          class="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800"
        >
          Continue Shopping
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <!-- Cart Header -->
      <div class="flex justify-between">
        <div class="flex-col flex">
          <h2 class="text-3xl font-bold mb-1">Shopping Cart</h2>
          <p class="text-md text-gray-500 mb-6">{{ totalItems }} items in your cart</p>
        </div>
        <button
          class="text-sm text-[#18181b] font-medium bg-white border border-[#e5e7eb] px-4 py-2 rounded m-auto mr-0 cursor-pointer hover:bg-gray-100"
          @click="clearCart"
        >
          Clear Cart
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Cart Items -->
        <div class="flex-1 space-y-4">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center justify-between p-4 shadow-sm border-1 border-[#e5e7eb] rounded-md"
          >
            <div class="flex items-center gap-4">
              <img :src="item.thumbnail" alt="product image" class="w-24 h-24 rounded" />
              <div>
                <p class="font-semibold">{{ item.title }}</p>
                <p class="font-bold text-2xl">${{ item.price.toFixed(2) }}</p>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-4">
              <button
                @click="decreaseQuantity(item)"
                class="px-3 py-2 border border-[#e5e7eb] rounded cursor-pointer hover:bg-gray-100 font-bold"
              >
                −
              </button>
              <span class="font-semibold">{{ item.quantity }}</span>
              <button
                @click="increaseQuantity(item)"
                class="px-3 py-2 border border-[#e5e7eb] rounded cursor-pointer hover:bg-gray-100 font-bold"
              >
                +
              </button>
              <span class="ml-4 font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              <button
                @click="removeItem(item.id)"
                class="px-3 py-2 cursor-pointer rounded hover:bg-gray-100 bg-white"
              >
                <TrashIcon class="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="w-full lg:w-1/3 border-1 border-[#e5e7eb] rounded p-6 space-y-4 shadow-sm">
          <div class="gap-4 flex flex-col">
            <h3 class="text-2xl font-semibold mb-2">Order Summary</h3>
            <div class="flex flex-col space-y-2 gap-2">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <hr />
              <div class="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            @click="router.push('/checkout')"
            class="w-full flex items-center justify-center gap-4 px-4 py-3 rounded-md cursor-pointer bg-[#2a2b30] hover:bg-[#3a3b40] transition-colors duration-200 text-white font-medium"
          >
            Proceed to Checkout
          </button>

          <button
            @click="router.push('/shop')"
            class="w-full border border-[#e5e7eb] py-2 rounded cursor-pointer hover:bg-gray-100 font-medium"
          >
            Continue Shopping
          </button>
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
