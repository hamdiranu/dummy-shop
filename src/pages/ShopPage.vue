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

    <!-- Loading GIF -->
    <div v-if="isFetching" class="flex justify-center items-center w-full py-20">
      <img src="@/assets/icons/loading_gif.gif" alt="Loading" class="w-auto h-[45vh]" />
    </div>

    <div v-if="products.length > 0">
      <div
        v-if="!isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6"
      >
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
      <!-- Intersection Observer target -->
      <div v-if="hasNextPage" class="h-10 w-full justify-center items-center flex">
        <!-- wrapper div gets the ref, not the component -->
        <div ref="loadMoreTrigger">
          <SpinnerComponent class="p-8 h-25 w-25 m-auto" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="products.length == 0 && !isFetching"
      class="flex flex-col items-center justify-center w-full py-12 text-center text-gray-500"
    >
      <EmptyBoxIcon class="w-64 h-64 mb-4" />
      <p class="text-2xl font-semibold">No products found</p>
      <p class="text-lg text-gray-400 mt-1">Try adjusting your search or filters</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { ProductCard, SpinnerComponent } from '@/components/ui'
import { fetchCategories, fetchProducts, fetchProductsByCategory } from '@/service'
import { EmptyBoxIcon, MagnifyGlassIcon } from '@/assets/icons'
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
  queryFn: () => fetchCategories(),
})

const categories = computed(() => categoryData.value || [])

const {
  data: productData,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: ['products', selectedCategory, debouncedSearch],
  queryFn: ({ pageParam = 0 }) =>
    selectedCategory.value
      ? fetchProductsByCategory(selectedCategory.value, {
          limit: 50,
          skip: pageParam,
        })
      : fetchProducts({
          limit: 50,
          skip: pageParam,
        }),

  getNextPageParam: (lastPage, allPages) => {
    const totalFetched = allPages.flatMap((p) => p.products).length
    return totalFetched < lastPage.total ? totalFetched : undefined
  },
  initialPageParam: 0,
})

const products = computed(() => {
  const keyword = debouncedSearch.value.toLowerCase()
  const pages = productData.value?.pages ?? []

  const filtered = pages
    .flatMap((page) => page.products)
    .filter(
      (product: IProduct) =>
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword),
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

const loadMoreTrigger = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
  const [entry] = entries
  if (entry.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage()
  }
}

onMounted(() => {
  observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1, // more responsive
  })

  nextTick(() => {
    if (loadMoreTrigger.value) {
      observer!.observe(loadMoreTrigger.value)
    }
  })
})

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
  }
  observer?.disconnect()
})

watch(
  () => productData.value,
  async () => {
    await nextTick()
    if (loadMoreTrigger.value && observer) {
      observer.disconnect()
      observer.observe(loadMoreTrigger.value)
    }
  },
  { immediate: true },
)
</script>
