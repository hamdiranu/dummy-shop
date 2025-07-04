<template>
  <header class="h-14 bg-white border-b flex items-center px-4 justify-between sticky top-0 z-10">
    <button @click="$emit('toggleSidebar')" class="md:hidden p-2">
      <SidebarMenu class="w-5 h-5" />
    </button>
    <div class="text-sm text-gray-500">Dashboard</div>
  </header>
</template>

<script setup lang="ts">
import { SidebarMenu } from '@/assets/icons'
</script>
