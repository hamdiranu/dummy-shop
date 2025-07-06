<template>
  <div class="not-found-page">
    <h1>404 - Page Not Found</h1>
    <p>Redirecting in {{ countdown }} second<span v-if="countdown !== 1">s</span>...</p>

    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <div class="button-group">
      <button @click="redirectNow">Go Now</button>
      <button @click="cancelRedirect">Cancel</button>
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

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full vertical height */
  font-family: sans-serif;
  text-align: center;
}

.progress-container {
  width: 300px;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-bar {
  height: 100%;
  background-color: #000; /* Changed to black */
  transition: width 1s linear;
}

.button-group {
  margin-top: 20px;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #000; /* Changed to black */
  color: white;
  border-radius: 8px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #333;
}
</style>
