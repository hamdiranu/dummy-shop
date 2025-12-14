<template>
  <div class="space-y-4 w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <h1 class="text-3xl font-bold text-[#09090B]">Products</h1>
        <p class="text-md text-gray-500">Manage your product inventory</p>
      </div>

      <button
        @click="handleCreate"
        class="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800 cursor-pointer"
      >
        <PlusIcon class="h-5 w-5" />
        Add Product
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex items-center flex-1 border-[#e5e7eb] border-1 rounded-md px-3 py-2 bg-white">
        <MagnifyGlassIcon class="h-5 w-5 text-gray-400 mr-2" />
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full text-sm outline-none text-gray-700"
        />
      </div>

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

    <!-- Loading GIF -->
    <div v-if="isFetching" class="flex justify-center items-center w-full py-20">
      <img src="@/assets/icons/loading_gif.gif" alt="Loading" class="w-auto h-[45vh]" />
    </div>

    <div v-if="products.length > 0">
      <div
        v-if="!isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :isLoading="isFetching"
          type="detail"
          @open-modal-edit="
            () => {
              selectedProduct = product
              openModalCreateEdit = true
              isModalEdit = true
            }
          "
          @delete-product="() => deleteMutation.mutate(product.id)"
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

  <!-- Product Creation Modal -->
  <ProductModal
    :open="openModalCreateEdit"
    :isEdit="isModalEdit"
    :initialData="selectedProduct"
    :isButtonLoading="createMutation.isPending.value || updateMutation.isPending.value"
    @on-add-data="saveProduct"
    @on-edit-data="editProduct"
    @close="openModalCreateEdit = false"
  />
</template>

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ProductCard, ProductModal, SpinnerComponent } from '@/components/ui'
import {
  deleteProduct,
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  postNewProduct,
  updateProduct,
  type AddProductPayload,
  type updateProductPayload,
} from '@/service'
import { EmptyBoxIcon, MagnifyGlassIcon, PlusIcon } from '@/assets/icons'
import type { IProduct } from '@/service/product/product.type'
import { useDebounce } from '@/hooks'
import { showSnackbar } from '@/utils'

const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selectedCategory = ref('')
const openModalCreateEdit = ref(false)
const isModalEdit = ref(false)
const selectedProduct = ref<IProduct | undefined>(undefined)

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
  refetch,
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

  return pages
    .flatMap((page) => page.products)
    .filter(
      (product: IProduct) =>
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword),
    )
})

const handleCreate = () => {
  selectedProduct.value = undefined
  openModalCreateEdit.value = true
  isModalEdit.value = false
}

// create product mutation
const createMutation = useMutation<AddProductPayload, unknown, AddProductPayload>({
  mutationFn: postNewProduct,
  onSuccess: async (data) => {
    showSnackbar('Success!!', `${data.title} has been added successfully!`)
    await refetch() // refresh product list after adding new product
  },
  onError: (err) => {
    console.log(err)
    showSnackbar('Error!!', `${err}`)
  },
})

const saveProduct = async (product: AddProductPayload) => {
  createMutation.mutate(product)
  openModalCreateEdit.value = false
}

// update product mutation
const updateMutation = useMutation<updateProductPayload, unknown, updateProductPayload>({
  mutationFn: (data) => updateProduct(selectedProduct.value!.id, data),
  onSuccess: async (data) => {
    showSnackbar('Success!!', `product ${data.title} has been added updated!`)
    await refetch() // refresh product list after adding new product
  },
  onError: (err) => {
    console.log(err)
    showSnackbar('Error!!', `${err}`)
  },
})

const deleteMutation = useMutation<
  IProduct, // TData: expected return type of deleteProduct (assumed to be the deleted product)
  unknown, // TError: error type
  number // TVariables: the product ID passed to deleteProduct
>({
  mutationFn: (id) => deleteProduct(id),
  onSuccess: async (data) => {
    showSnackbar('Success!!', `Product "${data.title}" has been deleted!`)
    await refetch()
  },
  onError: (err) => {
    console.error(err)
    showSnackbar('Error!!', err as string)
  },
})

const editProduct = (product: IProduct) => {
  if (!selectedProduct.value) {
    console.error('No product selected for editing.')
    return
  }

  const payload: updateProductPayload = {
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
  }

  updateMutation.mutate(payload, {
    onSuccess: () => {
      openModalCreateEdit.value = false
      isModalEdit.value = false
    },
  })
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
