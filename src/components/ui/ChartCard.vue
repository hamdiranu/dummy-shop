<template>
  <div class="bg-white rounded-lg border border-[#e5e7eb] p-4 shadow-sm">
    <h2 class="text-2xl font-semibold mb-1">{{ title }}</h2>
    <p class="text-sm text-gray-400 mb-4">{{ subtitle }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
