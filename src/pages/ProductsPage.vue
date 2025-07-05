<template>
  <div class="space-y-4 w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <h1 class="text-3xl font-bold text-[#09090B]">Products</h1>
        <p class="text-md text-gray-500">Manage your product inventory</p>
      </div>

      <button
        @click="handleCreate"
        class="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
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

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :isLoading="isFetching"
        type="detail"
      />
    </div>
  </div>

  <!-- Product Creation Modal -->
  <ProductModal
    :open="openModalCreate"
    :isEdit="false"
    :initialData="selectedProduct"
    @on-add-data="saveProduct"
    @close="openModalCreate = false"
  />
</template>

<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { ProductCard, ProductModal } from '@/components/ui'
import {
  fetchCategories,
  fetchProducts,
  postNewProduct,
  type AddProductPayload,
  type GetProductsResponse,
} from '@/service'
import { MagnifyGlassIcon, PlusIcon } from '@/assets/icons'
import type { IProduct } from '@/service/product/product.type'
import api from '@/service/api'
import { useDebounce } from '@/hooks'
import { showSnackbar } from '@/utils'

const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selectedCategory = ref('')
const openModalCreate = ref(false)
const selectedProduct = ref<IProduct | undefined>(undefined)

const { data: categoryData } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const categories = computed(() => categoryData.value || [])

const fetchProductsByCategory = async (slug: string): Promise<GetProductsResponse> => {
  const { data } = await api.get(`https://dummyjson.com/products/category/${slug}`)
  return data
}

const {
  data: productData,
  isFetching,
  refetch,
} = useQuery({
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

const handleCreate = () => {
  selectedProduct.value = undefined
  openModalCreate.value = true
}

// mutation
const mutation = useMutation<AddProductPayload, unknown, AddProductPayload>({
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
  mutation.mutate(product)
  openModalCreate.value = false
}
</script>
