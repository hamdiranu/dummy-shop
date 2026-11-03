<template>
  <div
    v-if="!isLoading"
    ref="rootEl"
    class="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
  >
    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-slate-50 to-slate-100">
      <img
        v-if="!imageError"
        :src="product.thumbnail"
        :alt="product.title"
        @load="imageLoaded = true"
        @error="handleImageError"
        :class="[
          'h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105',
          imageLoaded ? 'opacity-100' : 'opacity-0',
        ]"
      />

      <!-- fallback skeleton or retry -->
      <div v-else class="flex h-full w-full items-center justify-center">
        <span class="text-sm text-slate-400">Image failed to load. Retrying...</span>
      </div>

      <span
        v-if="type === 'shop' && product.discountPercentage > 0"
        class="badge absolute top-3 left-3 bg-rose-500 text-white shadow-sm"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </span>

      <span
        class="badge absolute top-3 right-3 bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200/60 backdrop-blur"
      >
        <span class="text-amber-400">★</span>{{ product.rating }}
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-3 p-5">
      <div class="flex items-center justify-between gap-2">
        <span class="badge bg-brand-50 text-brand-700 capitalize">
          {{ product.category }}
        </span>
        <span
          :class="[
            'text-xs font-medium',
            product.stock < 10 ? 'text-amber-600' : 'text-slate-400',
          ]"
        >
          Stock: {{ product.stock }}
        </span>
      </div>

      <div class="flex-1">
        <h2 class="line-clamp-2 text-base leading-snug font-semibold text-slate-900">
          {{ product.title }}
        </h2>
        <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ product.description }}</p>
      </div>

      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold tracking-tight text-slate-900">${{ product.price }}</span>
        <span v-if="type === 'shop'" class="text-sm text-slate-400 line-through">
          ${{ (product.price * (1 + product.discountPercentage / 100)).toFixed(2) }}
        </span>
      </div>

      <div v-if="type === 'detail'" class="flex gap-2">
        <button @click="emit('open-modal-edit')" class="btn-secondary flex-1">
          <EditIcon class="h-4 w-4" />
          Edit
        </button>
        <button
          @click="emit('delete-product')"
          class="btn-icon hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Delete product"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
      <button v-else class="btn-primary w-full" @click="emit('add-to-cart', product)">
        <CartIcons class="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  </div>

  <div v-else class="card w-full animate-pulse overflow-hidden">
    <div class="aspect-[4/3] bg-slate-100"></div>
    <div class="space-y-3 p-5">
      <div class="flex justify-between">
        <div class="h-5 w-20 rounded-full bg-slate-100"></div>
        <div class="h-4 w-14 rounded bg-slate-100"></div>
      </div>
      <div class="h-4 w-3/4 rounded bg-slate-200"></div>
      <div class="h-3 w-full rounded bg-slate-100"></div>
      <div class="h-3 w-5/6 rounded bg-slate-100"></div>
      <div class="h-7 w-1/3 rounded-lg bg-slate-200"></div>
      <div class="h-10 w-full rounded-xl bg-slate-100"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CartIcons, EditIcon, TrashIcon } from '@/assets/icons'
import type { IProduct } from '@/service/product/product.type'
import { ref } from 'vue'

defineProps<{
  product: IProduct
  isLoading?: boolean
  type: 'detail' | 'shop'
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: IProduct): void
  (e: 'open-modal-edit'): void
  (e: 'delete-product'): void
}>()

const rootEl = ref<HTMLElement | null>(null)
defineExpose({ rootEl }) // 👈 expose the element

const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true

  // Retry after delay (e.g., 2.5s)
  setTimeout(() => {
    imageError.value = false
    imageLoaded.value = false
  }, 2500)
}
</script>
