<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-2">Sign in</h2>
      <p class="text-center text-sm text-gray-500 mb-6">
        Enter your credentials to access the e-commerce dashboard
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Username<span class="text-red-500">*</span>
          </label>
          <input
            v-model="username"
            type="text"
            required
            :class="[
              'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2',
              usernameError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-black',
            ]"
          />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">Username is required</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password<span class="text-red-500">*</span></label
          >
          <input
            v-model="password"
            type="password"
            required
            :class="[
              'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2',
              passwordError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-black',
            ]"
          />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">Password is required</p>
        </div>

        <button
          type="submit"
          :disabled="mutation.isPending.value"
          class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          <span v-if="mutation.isPending.value">Signing in...</span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <div class="text-sm text-red-500 mt-4" v-if="mutation.isError.value">
        {{ errorMessage || 'Login failed' }}
      </div>

      <div class="bg-blue-50 p-4 mt-6 rounded text-sm text-gray-800">
        <p class="font-semibold text-blue-800 mb-1">Demo Credentials :</p>
        <p>Username : emilys</p>
        <p>Password : emilyspass</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/vue-query'
import api from '@/api'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const usernameError = ref(false)
const passwordError = ref(false)

// login function
const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post('https://dummyjson.com/auth/login', payload)
  return res.data
}

// mutation
const mutation = useMutation<LoginResponse, unknown, LoginPayload>({
  mutationFn: loginUser,
  onSuccess: (data) => {
    alert('Login success!')
    // Save entire auth data to localStorage
    localStorage.setItem('authToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    // Save user info (you can customize what to keep)
    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    }

    localStorage.setItem('user', JSON.stringify(userInfo))

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
