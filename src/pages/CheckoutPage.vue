<template>
  <div class="w-full">
    <div class="page-header">
      <div>
        <h1 class="page-title">Checkout</h1>
        <p class="page-subtitle">Complete your purchase</p>
      </div>
    </div>

    <form @submit.prevent="completeOrder">
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <!-- Left Side -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Shipping -->
          <section class="card p-6">
            <div class="mb-5 flex items-center gap-3">
              <span
                class="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-glow"
              >
                1
              </span>
              <h2 class="text-lg font-semibold text-slate-900">Shipping Information</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BaseInput
                v-for="field in shippingFields"
                :key="field.model"
                v-model="form[field.model]"
                v-bind="field.props"
                :error="v$.form[field.model]?.$error"
                :error-message="fieldError('form', field.model)"
              />
              <BaseInput
                v-model="form.address"
                label="Address"
                placeholder="Address"
                class="sm:col-span-2"
                :error="v$.form.address.$error"
                :error-message="fieldError('form', 'address')"
                required
              />
            </div>
            <div class="mt-4 flex flex-col gap-4 sm:flex-row">
              <BaseInput
                v-for="field in ['city', 'state', 'zip']"
                :key="field"
                v-model="form[field]"
                :label="capitalize(field)"
                :placeholder="capitalize(field)"
                class="w-full"
                :error="v$.form[field]?.$error"
                :error-message="fieldError('form', field)"
                required
              />
            </div>
          </section>

          <!-- Payment -->
          <section class="card p-6">
            <div class="mb-5 flex items-center gap-3">
              <span
                class="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-glow"
              >
                2
              </span>
              <h2 class="text-lg font-semibold text-slate-900">Payment Information</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BaseInput
                v-for="field in paymentFields"
                :key="field.model"
                v-model="payment[field.model]"
                v-bind="field.props"
                :error="v$.payment[field.model]?.$error"
                :error-message="fieldError('payment', field.model)"
              />
            </div>
          </section>
        </div>

        <!-- Right Side -->
        <div class="card space-y-5 p-6 lg:sticky lg:top-24">
          <h2 class="text-lg font-semibold text-slate-900">Order Summary</h2>
          <div class="scroll-thin flex max-h-105 flex-col gap-3 overflow-y-auto pt-2 pr-2">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
              <div class="relative shrink-0">
                <img
                  :src="item.thumbnail"
                  class="h-14 w-14 rounded-xl bg-slate-50 object-contain p-1 ring-1 ring-slate-100"
                />
                <span
                  class="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white ring-2 ring-white"
                >
                  {{ item.quantity }}
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ item.title }}</p>
                <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
              </div>
              <div class="shrink-0 text-sm font-semibold text-slate-900">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100"></div>

          <div class="flex flex-col gap-3">
            <div
              v-for="line in summaryLines"
              :key="line.label"
              class="flex justify-between text-sm"
            >
              <span class="text-slate-600">{{ line.label }}</span>
              <span class="font-medium text-slate-900">{{
                line.value > 0 ? `$${line.value.toFixed(2)}` : 'Free'
              }}</span>
            </div>
          </div>

          <div class="border-t border-dashed border-slate-200"></div>

          <div class="flex items-baseline justify-between">
            <span class="font-semibold text-slate-900">Total</span>
            <span class="text-2xl font-bold tracking-tight text-slate-900">
              ${{ total.toFixed(2) }}
            </span>
          </div>

          <button type="submit" class="btn-primary w-full py-3">Complete Order</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import useVuelidate, { type ErrorObject } from '@vuelidate/core'
import { required, email, numeric, minLength, helpers } from '@vuelidate/validators'
import { useCart } from '@/store'
import { fetchCurrentUsers, type ICartItem } from '@/service'
import { BaseInput } from '@/components/ui'
import { showSnackbar } from '@/utils'
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
    props: { label: 'First Name', placeholder: 'First Name', required: true },
  },
  {
    model: 'lastName',
    props: { label: 'Last Name', placeholder: 'Last Name', required: true },
  },
  {
    model: 'email',
    props: { label: 'Email', placeholder: 'Email', required: true },
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
      class: 'sm:col-span-2',
    },
  },
  {
    model: 'cardNumber',
    props: {
      label: 'Card Number',
      placeholder: 'At least 12 digits',
      required: true,
      class: 'sm:col-span-2',
    },
  },
  {
    model: 'expiry',
    props: { label: 'Expiry', placeholder: 'MM/YY', required: true },
  },
  {
    model: 'cvv',
    props: { label: 'CVV', placeholder: 'CVV', required: true },
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

const requiredField = helpers.withMessage('Required', required)
const digitsOnly = helpers.withMessage('Digits only, no spaces or dashes', numeric)

const rules = {
  form: {
    firstName: { required: requiredField },
    lastName: { required: requiredField },
    email: { required: requiredField, email: helpers.withMessage('Enter a valid email', email) },
    address: { required: requiredField },
    city: { required: requiredField },
    state: { required: requiredField },
    zip: { required: requiredField },
  },
  payment: {
    cardName: { required: requiredField },
    cardNumber: {
      required: requiredField,
      numeric: digitsOnly,
      minLength: helpers.withMessage('Card number must be at least 12 digits', minLength(12)),
    },
    expiry: {
      required: requiredField,
      expiryFormat: helpers.withMessage('Use the MM/YY format', expiryFormat),
    },
    cvv: {
      required: requiredField,
      numeric: digitsOnly,
      minLength: helpers.withMessage('CVV must be at least 3 digits', minLength(3)),
    },
  },
}

const v$ = useVuelidate(rules, { form, payment })

// Message of the first rule a field fails, so the hint matches what is actually wrong
const fieldError = (group: 'form' | 'payment', key: string) => {
  const fields = v$.value[group] as unknown as Record<string, { $errors: ErrorObject[] }>
  const message = fields[key]?.$errors[0]?.$message
  return message ? unref(message) : ''
}

const { data: userData } = useQuery({
  queryKey: ['user'],
  queryFn: () => fetchCurrentUsers(),
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
    showSnackbar('Error', 'Please fix the highlighted fields')
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
