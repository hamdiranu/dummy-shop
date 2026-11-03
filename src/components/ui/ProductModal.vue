<template>
  <BaseModal :open="open" @close-modal="emit('close')" maxWidth="34rem">
    <div class="space-y-6">
      <div class="flex items-start gap-4 pr-10">
        <span
          class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100"
        >
          <component :is="isEdit ? EditIcon : PlusIcon" class="h-5 w-5" />
        </span>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ isEdit ? 'Edit Product' : 'Add New Product' }}
          </h2>
          <p class="text-sm text-slate-500">
            {{ isEdit ? 'Update product information' : 'Create a new product for your store' }}
          </p>
        </div>
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
          <div class="flex flex-1 flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700"
              >Category <span class="text-rose-500">*</span></label
            >
            <select
              v-model="form.category"
              :class="['select', errors.category && 'input-error']"
              required
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.slug" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category" class="text-xs font-medium text-rose-500">
              {{ errors.category }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-slate-100 pt-5">
          <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
          <button type="submit" :disabled="isButtonLoading" class="btn-primary">
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
import { CircularIcon, EditIcon, PlusIcon } from '@/assets/icons'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  initialData?: IProduct
  isButtonLoading?: boolean
}>()

const emit = defineEmits(['close', 'on-add-data', 'on-edit-data'])

const { data: categoryData } = useQuery({
  queryKey: ['categories'],
  queryFn: () => fetchCategories(),
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
