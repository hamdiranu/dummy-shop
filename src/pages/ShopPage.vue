<template>
  <div class="space-y-4 w-[100%] gap-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <!-- Left side -->
      <div>
        <h1 class="text-3xl font-bold text-[#09090B]">Shop</h1>
        <p class="text-md text-[#71717a]">Browse and purchase products</p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
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

      <!-- Sort Dropdown -->
      <select
        v-model="selectedSort"
        class="text-sm border-[#e5e7eb] border-1 rounded-md px-3 py-2 bg-white w-full sm:w-[200px]"
      >
        <option value="default">Default</option>
        <option value="name-asc">Name A-Z</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Highest Rated</option>
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6">
      <!-- Products -->
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :isLoading="isFetching"
        type="shop"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ProductCard } from '@/components/ui'
import { fetchCategories, fetchProducts } from '@/service'
import { MagnifyGlassIcon } from '@/assets/icons'
import api from '@/service/api'
import type { IProduct } from '@/service/product/product.type'
import { useDebounce } from '@/hooks'
import { showSnackbar } from '@/utils'
import { useCart } from '@/store' // ✅ New: use cart store

const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selectedCategory = ref('')
const selectedSort = ref('default')

const { state, saveCart } = useCart() // ✅ cart state from store
const cart = state.cart

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
  const items: IProduct[] = productData?.value?.products ?? []
  const keyword = debouncedSearch.value.toLowerCase()

  const filtered = items.filter(
    (product) =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword),
  )

  switch (selectedSort.value) {
    case 'name-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    default:
      break
  }

  return filtered
})

function handleAddToCart(product: IProduct) {
  const index = cart.findIndex((item) => item.id === product.id)

  if (index !== -1) {
    cart[index].quantity += 1
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    })
  }

  saveCart()
  showSnackbar('Added to cart', `${product.title} has been added to your cart`)
}
</script>
