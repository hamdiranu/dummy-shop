<template>
  <div class="grid min-h-screen bg-white lg:grid-cols-2">
    <!-- Brand panel -->
    <div
      class="relative hidden overflow-hidden bg-linear-to-br from-brand-700 via-brand-600 to-violet-600 p-12 text-white lg:flex lg:flex-col lg:justify-between"
    >
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[40px_40px]"
      ></div>
      <div
        aria-hidden="true"
        class="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-400/40 blur-3xl"
      ></div>
      <div
        aria-hidden="true"
        class="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl"
      ></div>

      <div class="relative flex items-center gap-3">
        <div
          class="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur"
        >
          <SidebarTitle class="h-5 w-5" />
        </div>
        <span class="text-lg font-bold">DummyJSON Store</span>
      </div>

      <div class="relative max-w-md">
        <h1 class="text-4xl leading-tight font-bold tracking-tight">
          Run your store from one beautiful dashboard.
        </h1>
        <p class="mt-4 text-base text-white/75">
          Track metrics, manage your inventory, and shop the catalog — all in one place.
        </p>
      </div>

      <div class="relative grid max-w-md grid-cols-3 gap-3">
        <div
          v-for="feature in features"
          :key="feature.label"
          class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
        >
          <component :is="feature.icon" class="h-5 w-5 text-white/90" />
          <p class="mt-3 text-sm font-semibold">{{ feature.label }}</p>
        </div>
      </div>
    </div>

    <!-- Form panel -->
    <div class="flex items-center justify-center px-6 py-12 sm:px-10">
      <div class="w-full max-w-sm animate-fade-up">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <div
            class="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-violet-600 text-white shadow-glow"
          >
            <SidebarTitle class="h-5 w-5" />
          </div>
          <span class="text-lg font-bold text-slate-900">DummyJSON Store</span>
        </div>

        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Sign in</h2>
        <p class="mt-1 mb-8 text-sm text-slate-500">
          Enter your credentials to access the e-commerce dashboard
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="flex flex-col gap-1.5">
            <label class="block text-sm font-medium text-slate-700">
              Username<span class="text-rose-500">*</span>
            </label>
            <input
              v-model="username"
              type="text"
              required
              autocomplete="username"
              placeholder="Enter your username"
              :class="['input', usernameError && 'input-error']"
            />
            <p v-if="usernameError" class="text-xs font-medium text-rose-500">
              Username is required
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="block text-sm font-medium text-slate-700"
              >Password<span class="text-rose-500">*</span></label
            >
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="Enter your password"
              :class="['input', passwordError && 'input-error']"
            />
            <p v-if="passwordError" class="text-xs font-medium text-rose-500">
              Password is required
            </p>
          </div>

          <button
            type="submit"
            :disabled="mutation.isPending.value"
            class="btn-primary w-full py-3"
          >
            <SpinnerComponent v-if="mutation.isPending.value" class="h-4 w-4 text-white" />
            <span v-if="mutation.isPending.value">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div
          class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100"
          v-if="mutation.isError.value"
        >
          {{ errorMessage || 'Login failed' }}
        </div>

        <div class="mt-8 rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold text-brand-800">Demo Credentials</p>
            <button
              type="button"
              class="text-xs font-semibold text-brand-600 hover:text-brand-800"
              @click="useDemoCredentials"
            >
              Use demo account
            </button>
          </div>
          <div class="mt-2 space-y-1 text-sm text-slate-600">
            <p>
              Username :
              <code class="rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 ring-1 ring-brand-100">
                emilys
              </code>
            </p>
            <p>
              Password :
              <code class="rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 ring-1 ring-brand-100">
                emilyspass
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/vue-query'
import { loginUser, type LoginPayload, type LoginResponse } from '@/service'
import { showSnackbar } from '@/utils'
import { SpinnerComponent } from '@/components/ui'
import { DashboardIcons, ProductIcon, ShopIcon, SidebarTitle } from '@/assets/icons'

const router = useRouter()

const features = [
  { label: 'Analytics', icon: DashboardIcons },
  { label: 'Inventory', icon: ProductIcon },
  { label: 'Storefront', icon: ShopIcon },
]

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const usernameError = ref(false)
const passwordError = ref(false)

const useDemoCredentials = () => {
  username.value = 'emilys'
  password.value = 'emilyspass'
}

// login function

// mutation
const mutation = useMutation<LoginResponse, unknown, LoginPayload>({
  mutationFn: loginUser,
  onSuccess: (data) => {
    showSnackbar('Login successful', `Welcome back, ${data.firstName}!`)
    // Save entire auth data to localStorage
    localStorage.setItem('authToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    router.push('/dashboard')
  },
  onError: (err) => {
    if (err instanceof AxiosError) {
      errorMessage.value = err.response?.data?.message || 'Login failed'
    } else {
      errorMessage.value = 'Unexpected error occurred'
    }
  },
})

// form submission handler
const handleSubmit = () => {
  usernameError.value = username.value.trim() === ''
  passwordError.value = password.value.trim() === ''

  if (!usernameError.value && !passwordError.value) {
    mutation.mutate({ username: username.value, password: password.value })
  }
}
</script>
