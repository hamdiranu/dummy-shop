<template>
  <header
    :class="[
      'h-14 bg-white border-b border-[0] border-[#e5e7eb] flex items-center px-4 justify-between sticky top-0 z-10 transition-all duration-300',
      props.isOpen ? 'ml-[14%]' : 'ml-0',
    ]"
  >
    <button @click="$emit('toggleSidebar')" class="p-1.5 cursor-pointer hover:bg-gray-100 rounded">
      <SidebarMenu class="w-5 h-5" />
    </button>
  </header>
</template>

<script setup lang="ts">
import { SidebarMenu } from '@/assets/icons'

const props = defineProps<{
  isOpen: boolean
}>()
</script>
