<template>
  <!-- overflow-clip rather than hidden: a hidden overflow can still be scrolled sideways when an
       input gets focus, which shoved the form off-screen on phones -->
  <div class="relative isolate flex min-h-screen items-center overflow-clip">
    <PageBackground />

    <!-- Margins and widths follow the mockup: mascot ~39vw, card ~35vw, mascot about as tall as
         the card, capped by height so it never crowds a short screen -->
    <div
      class="grid w-full items-center gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_clamp(400px,35vw,680px)] lg:gap-[6.3vw] lg:pr-[12.9vw] lg:pl-[6.6vw] short:py-5"
    >
      <!-- Mascot -->
      <section class="mx-auto w-full max-w-[240px] sm:max-w-xs lg:max-w-[71vh]">
        <LoginMascot
          :eyes-closed="passwordFocused && !showPassword"
          :peek="passwordFocused && showPassword"
          :look-at="mascotLookAt"
        />
      </section>

      <!-- Sign-in card -->
      <section
        class="w-full animate-fade-up rounded-[28px] border border-white/80 bg-white/85 p-7 shadow-[0_30px_80px_-24px_rgba(30,64,175,0.28)] backdrop-blur-xl sm:p-9 lg:p-10 short:p-7"
      >
        <div class="flex flex-col items-center text-center">
          <svg
            viewBox="0 0 64 64"
            class="h-14 w-14 drop-shadow-[0_10px_14px_rgba(37,99,235,0.35)] roomy:h-16 roomy:w-16 short:h-11 short:w-11"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="login-bag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#60a5fa" />
                <stop offset="1" stop-color="#1d4ed8" />
              </linearGradient>
            </defs>
            <path
              d="M22 24v-8a10 10 0 0 1 20 0v8"
              fill="none"
              stroke="#1d4ed8"
              stroke-width="5"
              stroke-linecap="round"
            />
            <path
              d="M12 26a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4l-2 26a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"
              fill="url(#login-bag)"
            />
            <path
              d="M19 29h26"
              stroke="#ffffff"
              stroke-opacity="0.4"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <h1
            class="mt-4 text-3xl font-bold tracking-tight text-[#14213d] roomy:text-4xl short:mt-3 short:text-2xl"
          >
            Sign in
          </h1>
          <p class="mt-2 text-sm text-slate-500 roomy:text-base">
            Enter your credentials to access the e-commerce dashboard
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-5 short:mt-6 short:space-y-4">
          <div class="flex flex-col gap-1.5">
            <label
              for="login-username"
              class="block text-sm font-semibold text-[#14213d] roomy:text-base"
            >
              Username<span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <ProfileIcon
                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-username"
                ref="usernameInput"
                v-model="username"
                type="text"
                required
                autocomplete="username"
                placeholder="Enter your username"
                :class="[
                  'input h-12 pl-12 roomy:h-13 roomy:text-base short:h-11',
                  usernameError ? 'input-error' : 'focus:border-blue-500 focus:ring-blue-100',
                ]"
                @focus="usernameFocused = true"
                @blur="usernameFocused = false"
              />
            </div>
            <p v-if="usernameError" class="text-xs font-medium text-rose-500">
              Username is required
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="login-password"
              class="block text-sm font-semibold text-[#14213d] roomy:text-base"
            >
              Password<span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <LockIcon
                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Enter your password"
                :class="[
                  'input h-12 pr-12 pl-12 roomy:h-13 roomy:text-base short:h-11',
                  passwordError ? 'input-error' : 'focus:border-blue-500 focus:ring-blue-100',
                ]"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
              <!-- mousedown.prevent keeps focus in the field, so the mascot doesn't open its eyes -->
              <button
                type="button"
                class="absolute top-1/2 right-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                @mousedown.prevent
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="showPassword" class="mr-0! h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordError" class="text-xs font-medium text-rose-500">
              Password is required
            </p>
          </div>

          <button
            type="submit"
            :disabled="mutation.isPending.value"
            class="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-500 to-blue-700 text-sm font-semibold roomy:h-14 roomy:text-base short:h-11 text-white shadow-[0_14px_28px_-12px_rgba(37,99,235,0.75)] transition-all duration-200 hover:shadow-[0_18px_32px_-12px_rgba(37,99,235,0.9)] hover:brightness-110 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
          >
            <span
              aria-hidden="true"
              class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            ></span>
            <template v-if="mutation.isPending.value">
              <SpinnerComponent class="h-4 w-4 text-white" />
              <span>Signing in...</span>
            </template>
            <template v-else>
              <span>Sign in</span>
              <ArrowRightIcon class="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </template>
          </button>
        </form>

        <div
          class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100"
          v-if="mutation.isError.value"
        >
          {{ errorMessage || 'Login failed' }}
        </div>

        <div
          class="mt-6 flex items-start gap-4 rounded-2xl bg-blue-50/80 p-4 ring-1 ring-blue-100 short:mt-5 short:p-3"
        >
          <span
            class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white"
          >
            <InfoIcon class="h-4 w-4" />
          </span>
          <div class="min-w-0 flex-1 border-l-2 border-blue-200 pl-4">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-semibold text-blue-900">Demo Credentials :</p>
              <button
                type="button"
                class="shrink-0 text-xs font-semibold whitespace-nowrap text-blue-600 transition-colors hover:text-blue-800"
                @click="useDemoCredentials"
              >
                Use demo
              </button>
            </div>
            <p class="mt-1 text-sm text-slate-700">
              Username : <span class="font-medium text-slate-900">emilys</span>
            </p>
            <p class="text-sm text-slate-700">
              Password : <span class="font-medium text-slate-900">emilyspass</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/vue-query'
import { loginUser, type LoginPayload, type LoginResponse } from '@/service'
import { showSnackbar } from '@/utils'
import { LoginMascot, PageBackground, SpinnerComponent } from '@/components/ui'
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  ProfileIcon,
} from '@/assets/icons'

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const usernameError = ref(false)
const passwordError = ref(false)

const usernameInput = ref<HTMLInputElement | null>(null)
const usernameFocused = ref(false)
const passwordFocused = ref(false)
const showPassword = ref(false)

// While the username is being typed, the mascot reads along the end of the text
const mascotLookAt = computed(() => {
  if (!usernameFocused.value || !usernameInput.value) return null
  const rect = usernameInput.value.getBoundingClientRect()
  const textEnd = Math.min(rect.left + 48 + username.value.length * 8, rect.right - 16)
  return { x: textEnd, y: rect.top + rect.height / 2 }
})

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
