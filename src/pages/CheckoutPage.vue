<template>
  <div class="w-full">
    <h1 class="text-3xl font-bold">Checkout</h1>
    <p class="text-md text-gray-500 mb-6">Complete your purchase</p>

    <form @submit.prevent="completeOrder">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Side -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping -->
          <section class="shadow-sm border-1 border-[#e5e7eb] p-6 rounded-md">
            <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-for="field in shippingFields"
                :key="field.model"
                v-model="form[field.model]"
                v-bind="field.props"
                :error="v$.form[field.model]?.$error"
              />
              <BaseInput
                v-model="form.address"
                label="Address"
                placeholder="Address"
                class="col-span-2"
                :error="v$.form.address.$error"
                error-message="Required"
                required
              />
            </div>
            <div class="flex flex-col sm:flex-row gap-4 mt-4">
              <BaseInput
                v-for="field in ['city', 'state', 'zip']"
                :key="field"
                v-model="form[field]"
                :label="capitalize(field)"
                :placeholder="capitalize(field)"
                class="w-full"
                :error="v$.form[field]?.$error"
                error-message="Required"
                required
              />
            </div>
          </section>

          <!-- Payment -->
          <section class="shadow-sm border-1 border-[#e5e7eb] p-6 rounded-md">
            <h2 class="text-2xl font-semibold mb-4">Payment Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-for="field in paymentFields"
                :key="field.model"
                v-model="payment[field.model]"
                v-bind="field.props"
                :error="v$.payment[field.model]?.$error"
              />
            </div>
          </section>
        </div>

        <!-- Right Side -->
        <div class="shadow-sm border-1 border-[#e5e7eb] p-6 rounded-md space-y-4 h-fit">
          <h2 class="text-2xl font-semibold">Order Summary</h2>
          <div class="flex flex-col gap-0 max-h-105 overflow-y-auto pr-2">
            <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm">
              <div class="flex items-center gap-2">
                <img :src="item.thumbnail" class="w-16 h-16 rounded" />
                <div>
                  <p class="font-medium text-sm">{{ item.title }}</p>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
              </div>
              <div class="font-medium text-sm m-auto mr-0">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <hr class="border-1 border-[#e5e7eb]" />

          <div class="flex flex-col gap-2">
            <div
              v-for="line in summaryLines"
              :key="line.label"
              class="flex justify-between text-sm"
            >
              <span class="font-normal text-base text-[#09090b]">{{ line.label }}</span>
              <span class="font-medium text-[#09090b]">{{
                line.value > 0 ? `$${line.value.toFixed(2)}` : 'Free'
              }}</span>
            </div>
          </div>

          <hr class="border-1 border-[#e5e7eb]" />

          <div class="flex justify-between font-semibold">
            <span class="text-lg font-bold text-[#09090b]">Total</span>
            <span class="font-medium text-sm text-[#09090b]">${{ total.toFixed(2) }}</span>
          </div>

          <button
            type="submit"
            class="w-full px-4 py-3 rounded-md bg-[#2a2b30] hover:bg-[#3a3b40] text-white font-medium transition-colors"
          >
            Complete Order
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import useVuelidate from '@vuelidate/core'
import { required, email, numeric, minLength, helpers } from '@vuelidate/validators'
import { useCart } from '@/store'
import type { ICartItem } from '@/service'
import { BaseInput } from '@/components/ui'
import { showSnackbar } from '@/utils'
import api from '@/service/api'
import { useRouter } from 'vue-router'

const { state: cartState, saveCart } = useCart()

const form: { [key: string]: string } = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
})

const payment: { [key: string]: string } = reactive({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
})

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const shippingFields = [
  {
    model: 'firstName',
    props: {
      label: 'First Name',
      placeholder: 'First Name',
      required: true,
      errorMessage: 'Required',
    },
  },
  {
    model: 'lastName',
    props: {
      label: 'Last Name',
      placeholder: 'Last Name',
      required: true,
      errorMessage: 'Required',
    },
  },
  {
    model: 'email',
    props: {
      label: 'Email',
      placeholder: 'Email',
      required: true,
      errorMessage: 'Valid email required',
    },
  },
  { model: 'phone', props: { label: 'Phone', placeholder: 'Phone' } },
]

const paymentFields = [
  {
    model: 'cardName',
    props: {
      label: 'Cardholder Name',
      placeholder: 'Cardholder Name',
      required: true,
      errorMessage: 'Required',
      class: 'col-span-2',
    },
  },
  {
    model: 'cardNumber',
    props: {
      label: 'Card Number',
      placeholder: 'Card Number',
      required: true,
      errorMessage: 'Card number required',
      class: 'col-span-2',
    },
  },
  {
    model: 'expiry',
    props: { label: 'Expiry', placeholder: 'MM/YY', required: true, errorMessage: 'Required' },
  },
  {
    model: 'cvv',
    props: { label: 'CVV', placeholder: 'CVV', required: true, errorMessage: 'Required' },
  },
]

const summaryLines = computed(() => [
  { label: 'Subtotal', value: subtotal.value },
  { label: 'Shipping', value: 0 },
  { label: 'Tax', value: tax.value },
])

const cartItems = computed(() => cartState.cart)

const subtotal = computed(() =>
  cartItems.value.reduce((sum: number, item: ICartItem) => sum + item.price * item.quantity, 0),
)
const tax = computed(() => 4.0)
const total = computed(() => subtotal.value + tax.value)

const expiryFormat = helpers.regex(/^((0[1-9])|(1[0-2]))\/\d{2}$/) // MM/YY

const rules = {
  form: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    address: { required },
    city: { required },
    state: { required },
    zip: { required },
  },
  payment: {
    cardName: { required },
    cardNumber: { required, numeric, minLength: minLength(12) },
    expiry: { required, expiryFormat },
    cvv: { required, numeric, minLength: minLength(3) },
  },
}

const v$ = useVuelidate(rules, { form, payment })

const { data: userData } = useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await api.get('https://dummyjson.com/user/me')
    return res.data
  },
})

watchEffect(() => {
  const data = userData.value
  if (data) {
    form.firstName = data.firstName
    form.lastName = data.lastName
    form.email = data.email
    form.phone = data.phone
    form.address = data.address?.address || ''
    form.city = data.address?.city || ''
    form.state = data.address?.state || ''
    form.zip = data.address?.postalCode || ''
  }
})

const router = useRouter()

const completeOrder = async () => {
  const valid = await v$.value.$validate()
  if (!valid) {
    showSnackbar('Error', 'Please fill in all required fields')
    return
  }

  const now = new Date()
  const id = now.getTime()

  const products = cartItems.value.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
    discountPercentage: item.discountPercentage,
    discountedPrice: Math.floor(item.price * (1 - (item.discountPercentage ?? 0) / 100)),
    thumbnail: item.thumbnail,
  }))

  const order = {
    id,
    products,
    total: subtotal.value + tax.value,
    discountedTotal: products.reduce((sum, p) => sum + p.discountedPrice * p.quantity, 0),
    userId: userData.value?.id || 1,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
    date: now.toISOString(),
    status: 'completed',
    items: cartItems.value.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
    })),
    shippingInfo: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zip,
    },
  }

  // Save to localStorage
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  existingOrders.push(order)
  localStorage.setItem('orders', JSON.stringify(existingOrders))

  // Clear cart
  cartState.cart.splice(0)
  saveCart()
  router.push('/cart')
  showSnackbar('Success', 'Order completed successfully!')
}
</script>
