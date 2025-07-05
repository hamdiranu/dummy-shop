<template>
  <div v-if="!isLoading" class="bg-white rounded-lg border border-[#e5e7eb] p-6 shadow-sm">
    <div class="flex justify-between items-center mb-2">
      <p class="text-sm text-[#09090B] font-medium">{{ title }}</p>
      <component :is="icon" class="w-5 h-5" />
    </div>
    <h2 class="text-2xl font-bold">{{ value }}</h2>
    <p class="text-xs text-[#71717a] font-normal">{{ subtitle }}</p>
  </div>
  <div v-else class="bg-white rounded-lg border border-[#e5e7eb] p-6 shadow-sm animate-pulse">
    <div class="flex justify-between items-center mb-2">
      <div class="h-4 w-[70%] bg-gray-200 rounded"></div>
      <div class="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
    <div class="h-8 w-[30%] bg-gray-200 rounded mb-2"></div>
    <div class="h-3 w-[40%] bg-gray-200 rounded"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  value: string | number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any // or define proper type like Component
  isLoading?: boolean
}>()
</script>
