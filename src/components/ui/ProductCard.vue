<template>
  <div
    v-if="!isLoading"
    :class="[
      'bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 relative transition-shadow duration-300',
      type === 'shop' && 'group hover:shadow-lg',
    ]"
  >
    <img
      :src="product.thumbnail"
      alt="Product Image"
      :class="[
        'w-full h-[50vdh] object-contain mb-4 transition-transform duration-300',
        type === 'shop' && 'group-hover:scale-105',
      ]"
    />
    <div
      v-if="type === 'shop' && product.discountPercentage > 0"
      class="absolute top-7 left-9 bg-red-500 text-white text-xs font-semibold px-3.5 py-1 rounded-full"
    >
      -{{ Math.round(product.discountPercentage) }}%
    </div>

    <h2 class="text-2xl text-[09090B] font-semibold flex flex-1">{{ product.title }}</h2>
    <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>

    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl text-[09090B] font-bold">${{ product.price }}</h2>
        <span v-if="type === 'shop'" class="line-through text-lg m-auto text-[#71717a]"
          >${{ (product.price * (1 + product.discountPercentage / 100)).toFixed(2) }}</span
        >
      </div>
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

    <div v-if="type === 'detail'" class="flex items-center justify-between text-sm">
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
    <div v-else class="flex items-center justify-between text-sm">
      <button
        class="w-full flex items-center justify-center gap-4 px-4 py-3 rounded-md cursor-pointer bg-[#2a2b30] hover:bg-[#3a3b40] transition-colors duration-200"
      >
        <CartIcons class="w-5 h-5 text-white" />
        <span class="text-white">Add to Cart</span>
      </button>
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
import { CartIcons, EditIcon, TrashIcon } from '@/assets/icons'
import type { IProduct } from '@/service/product/product.type'

defineProps<{
  product: IProduct
  isLoading?: boolean
  type: 'detail' | 'shop'
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
