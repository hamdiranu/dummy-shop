<template>
  <div class="w-full">
    <div class="page-header">
      <!-- Left side -->
      <div>
        <h1 class="page-title">Shop</h1>
        <p class="page-subtitle">Browse and purchase products</p>
      </div>
    </div>

    <div class="card mb-6 flex flex-col gap-3 p-3 sm:flex-row">
      <!-- Search Bar -->
      <div class="relative flex-1">
        <MagnifyGlassIcon
          class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="input pl-10 shadow-none"
        />
      </div>

      <!-- Category Dropdown -->
      <select v-model="selectedCategory" class="select shadow-none sm:w-[200px]">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.slug" :value="category.slug">
          {{ category.name }}
        </option>
      </select>

      <!-- Sort Dropdown -->
      <select v-model="selectedSort" class="select shadow-none sm:w-[200px]">
        <option value="default">Default</option>
        <option value="name-asc">Name A-Z</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Highest Rated</option>
      </select>
    </div>

    <!-- Loading GIF -->
    <div v-if="isFetching" class="flex w-full items-center justify-center py-16">
      <img src="@/assets/icons/loading_gif.gif" alt="Loading" class="h-[40vh] w-auto" />
    </div>

    <div v-if="products.length > 0">
      <!-- Sparks burst from "Add to Cart" only -->
      <ClickSpark
        v-if="!isLoading"
        selector="[data-add-to-cart]"
        spark-color="#6366f1"
        :spark-count="10"
        :spark-radius="26"
        :spark-size="12"
        :duration="450"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </ClickSpark>
      <!-- Intersection Observer target -->
      <div v-if="hasNextPage" class="flex h-10 w-full items-center justify-center">
        <!-- wrapper div gets the ref, not the component -->
        <div ref="loadMoreTrigger">
          <SpinnerComponent class="m-auto h-25 w-25 p-8" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="products.length == 0 && !isFetching" class="empty-state">
      <EmptyBoxIcon class="mb-4 h-32 w-32" />
      <p class="text-lg font-semibold text-slate-900">No products found</p>
      <p class="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { ProductCard, SpinnerComponent } from '@/components/ui'
import { ClickSpark } from '@/components/bits'
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
