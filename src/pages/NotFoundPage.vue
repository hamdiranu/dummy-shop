<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-6 text-center"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(55%_60%_at_50%_0%,rgb(99_102_241/0.18),transparent)]"
    ></div>

    <div class="relative animate-fade-up">
      <p
        class="bg-linear-to-br from-brand-500 to-violet-600 bg-clip-text text-8xl font-extrabold tracking-tighter text-transparent sm:text-9xl"
      >
        404
      </p>
      <h1 class="mt-4 text-2xl font-bold tracking-tight text-slate-900">Page Not Found</h1>
      <p class="mt-2 text-sm text-slate-500">
        <template v-if="cancelled">Redirect cancelled.</template>
        <template v-else>
          Redirecting in {{ countdown }} second<span v-if="countdown !== 1">s</span>...
        </template>
      </p>

      <div class="mx-auto mt-6 h-1.5 w-72 max-w-full overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-linear-to-r from-brand-500 to-violet-500 transition-[width] duration-1000 ease-linear"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <div class="mt-8 flex justify-center gap-3">
        <button class="btn-primary" @click="redirectNow">Go Now</button>
        <button class="btn-secondary" :disabled="cancelled" @click="cancelRedirect">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const countdown = ref(5)
const totalTime = countdown.value
const progress = ref(100)
let interval: ReturnType<typeof setInterval> | null = null
const cancelled = ref(false)

function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

function redirectNow() {
  if (interval) clearInterval(interval)
  router.push({ name: isAuthenticated() ? 'Dashboard' : 'Login' })
}

function cancelRedirect() {
  if (interval) clearInterval(interval)
  cancelled.value = true
}

onMounted(() => {
  interval = setInterval(() => {
    countdown.value--
    progress.value = (countdown.value / totalTime) * 100

    if (countdown.value <= 0) {
      redirectNow()
    }
  }, 1000)
})
</script>
