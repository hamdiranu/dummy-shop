<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
    <h1 class="text-6xl font-bold text-gray-800">404</h1>
    <p class="text-xl text-gray-600 mt-4">Oops! Page not found.</p>
    <RouterLink
      to="/dashboard"
      class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Go to Dashboard
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
