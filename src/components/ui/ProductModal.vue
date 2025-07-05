<template>
  <BaseModal :open="open" @close-modal="emit('close')" maxWidth="32rem">
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold">
          {{ isEdit ? 'Edit Product' : 'Add New Product' }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ isEdit ? 'Update product information' : 'Create a new product for your store' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Title"
          type="text"
          required
          :error="!!errors.title"
          :errorMessage="errors.title"
        />
        <BaseInput
          v-model="form.description"
          label="Description"
          type="textarea"
          required
          :error="!!errors.description"
          :errorMessage="errors.description"
        />

        <div class="flex gap-4">
          <BaseInput
            v-model="form.price"
            label="Price"
            type="number"
            required
            class="flex-1"
            :error="!!errors.price"
            :errorMessage="errors.price"
          />
          <BaseInput
            v-model="form.stock"
            label="Stock"
            type="number"
            required
            class="flex-1"
            :error="!!errors.stock"
            :errorMessage="errors.stock"
          />
        </div>

        <div v-if="!isEdit" class="flex gap-4">
          <BaseInput
            v-model="form.brand"
            label="Brand"
            type="text"
            required
            class="flex-1"
            :error="!!errors.brand"
            :errorMessage="errors.brand"
          />
          <div class="gap-2 flex flex-col w-[48%]">
            <label class="text-sm font-medium">Category <span class="text-red-500">*</span></label>
            <select
              v-model="form.category"
              :class="[
                'text-sm border rounded-md px-3 py-2 bg-white w-full input',
                errors.category ? 'border-red-500' : 'border-[#e5e7eb]',
              ]"
              required
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.slug" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            type="submit"
            :disabled="isButtonLoading"
            class="bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <CircularIcon v-if="isButtonLoading" class="h-5 w-5" />
            <span>{{ isEdit ? 'Update Product' : 'Add Product' }}</span>
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import { computed, reactive, watch } from 'vue'
import { fetchCategories } from '@/service'
import type { IProduct } from '@/service/product/product.type'
import { CircularIcon } from '@/assets/icons'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  initialData?: IProduct
  isButtonLoading?: boolean
}>()

const emit = defineEmits(['close', 'on-add-data', 'on-edit-data'])

const { data: categoryData } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const categories = computed(() => categoryData.value || [])

const form = reactive({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  brand: '',
  category: '',
})

const errors = reactive<Record<string, string>>({})

const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    price: 0,
    stock: 0,
    brand: '',
    category: '',
  })
  Object.keys(errors).forEach((key) => (errors[key] = ''))
}

const validateForm = () => {
  errors.title = form.title ? '' : 'Title is required'
  errors.description = form.description ? '' : 'Description is required'
  errors.price = form.price > 0 ? '' : 'Price is required'
  errors.stock = form.stock > 0 ? '' : 'Stock is required'
  errors.brand = form.brand ? '' : 'Brand is required'
  errors.category = form.category ? '' : 'Category is required'

  return Object.values(errors).every((e) => !e)
}

// Reset form when modal opens (if not editing)
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && !props.isEdit) resetForm()
  },
)

// Prefill form when editing
watch(
  () => props.initialData,
  (data) => {
    if (props.isEdit && data) Object.assign(form, data)
  },
  { immediate: true },
)

// Clear individual errors on field input
Object.keys(form).forEach((key) => {
  watch(
    () => form[key as keyof typeof form],
    () => {
      errors[key] = ''
    },
  )
})

const handleSubmit = () => {
  if (!validateForm()) return
  emit(props.isEdit ? 'on-edit-data' : 'on-add-data', { ...form })
  emit('close')
}
</script>
