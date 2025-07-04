<template>
  <div class="space-y-4 w-[100%]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <!-- Left side -->
      <div>
        <h1 class="text-3xl font-bold text-[#09090B]">Products</h1>
        <p class="text-md text-gray-500">Manage your product inventory</p>
      </div>

      <!-- Right side -->
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
      >
        <PlusIcon class="h-5 w-5" />
        Add Product
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-2">
      <!-- Search Bar -->
      <div class="flex items-center flex-1 border-[#e5e7eb] border-1 rounded-md px-3 py-2 bg-white">
        <MagnifyGlassIcon class="h-5 w-5 text-gray-400 mr-2" />

        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full text-sm outline-none text-gray-700"
        />
      </div>

      <!-- Category Dropdown -->
      <select
        v-model="selectedCategory"
        class="text-sm border-[#e5e7eb] border-1 rounded-md px-3 py-2 bg-white w-full sm:w-[200px]"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.slug" :value="category.slug">
          {{ category.name }}
        </option>
      </select>
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
import { fetchCategories, fetchProducts } from '@/service'
import { computed, ref } from 'vue'
import { MagnifyGlassIcon, PlusIcon } from '@/assets/icons'
import api from '@/service/api'
import type { IProduct } from '@/service/product/product.type'
import { useDebounce } from '@/hooks'

const search = ref('')
const debouncedSearch = useDebounce(search, 500) // 300ms debounce
const selectedCategory = ref('')

const { data: categoryData } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const categories = computed(() => categoryData.value || [])

const fetchProductsByCategory = async (slug: string) => {
  const { data } = await api.get(`https://dummyjson.com/products/category/${slug}`)
  return data
}

const { data: productData, isFetching } = useQuery({
  queryKey: ['products', selectedCategory],
  queryFn: () =>
    selectedCategory.value ? fetchProductsByCategory(selectedCategory.value) : fetchProducts(),
})

const products = computed(() => {
  const items = productData?.value?.products ?? []
  const keyword = debouncedSearch.value.toLowerCase()

  return items.filter(
    (product: IProduct) =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword),
  )
})
</script>
