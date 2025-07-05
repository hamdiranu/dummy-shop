<template>
  <transition name="slide-up">
    <div
      v-if="snackbarVisible"
      class="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg px-6 py-4 w-[300px] z-50 border-1 border-[#e5e7eb]"
    >
      <p class="font-semibold text-sm text-black">{{ snackbarTitle }}</p>
      <p class="text-sm text-gray-600 mt-1">{{ snackbarMessage }}</p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { snackbarTitle, snackbarMessage, snackbarVisible } from '@/utils'
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
