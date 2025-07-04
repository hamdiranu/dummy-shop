<template>
  <div
    v-if="!isLoading"
    class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2"
  >
    <img
      :src="product.thumbnail"
      alt="Product Image"
      class="w-full h-[50vdh] object-contain mb-4"
    />

    <h2 class="text-2xl text-[09090B] font-semibold">{{ product.title }}</h2>
    <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>

    <div class="flex items-center justify-between mt-1 text-sm">
      <h2 class="mt-2 text-2xl text-[09090B] font-bold">${{ product.price }}</h2>
      <span class="flex items-center gap-1">
        <span class="text-yellow-500 text-lg">★</span>{{ product.rating }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-1 text-sm text-gray-500">
      <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl text-xs font-semibold capitalize">
        {{ product.category }}
      </span>

      <span>Stock: {{ product.stock }}</span>
    </div>

    <div class="mt-2 flex items-center justify-between text-sm">
      <div class="flex gap-2 mt-2">
        <button
          class="px-3 py-2 border-[#e5e7eb] border-1 cursor-pointer rounded hover:bg-gray-100"
        >
          <EditIcon class="w-4 h-4" />
        </button>
        <button
          class="px-3 py-2 border-[#e5e7eb] border-1 cursor-pointer rounded hover:bg-gray-100"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
  <div v-else class="border w-full border-gray-200 rounded-lg p-4 animate-pulse bg-white">
    <div class="h-[50vh] bg-gray-200 rounded mb-4"></div>
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div class="h-3 bg-gray-100 rounded w-full mb-2"></div>
    <div class="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
    <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div class="flex justify-between">
      <div class="h-6 w-16 bg-gray-200 rounded"></div>
      <div class="h-6 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditIcon, TrashIcon } from '@/assets/icons'
import type { IProduct } from '@/service/product/product.type'

defineProps<{
  product: IProduct
  isLoading?: boolean
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
