<template>
  <div class="space-y-4 w-[100%]">
    <div class="flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-[#09090B]">All Products</h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <!-- Products -->
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :isLoading="isFetching"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ProductCard } from '@/components/ui'
import { fetchProducts } from '@/service'
import { computed } from 'vue'

// Fetch all products (no pagination)
const { data, isFetching } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const products = computed(() => data?.value?.products ?? [])
</script>
