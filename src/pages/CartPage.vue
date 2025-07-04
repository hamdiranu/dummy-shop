<template>
  <div class="h-[60vh] w-[100%] flex flex-col justify-center items-center px-4 text-center">
    <SidebarTitle class="w-32 h-32 text-[#6F7074] mb-4" />
    <div class="flex flex-col justify-center items-center gap-2">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Your cart is empty</h2>
      <p class="text-md text-[#71717a] mb-4">Add some products to get started</p>
    </div>
    <RouterLink
      to="/shop"
      class="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800"
    >
      Continue Shopping
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { SidebarTitle } from '@/assets/icons'
</script>
