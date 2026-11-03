<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
  >
    <button @click="$emit('toggleSidebar')" class="btn-icon" aria-label="Toggle sidebar">
      <SidebarMenu class="h-5 w-5" />
    </button>

    <div class="hidden h-6 w-px bg-slate-200 sm:block"></div>

    <nav class="flex min-w-0 items-center gap-2 text-sm" aria-label="Breadcrumb">
      <span class="hidden text-slate-400 sm:inline">Store</span>
      <span class="hidden text-slate-300 sm:inline">/</span>
      <span class="truncate font-semibold text-slate-900">{{ route.name }}</span>
    </nav>

    <div class="ml-auto flex items-center gap-3">
      <RouterLink to="/cart" class="btn-icon relative" aria-label="Cart">
        <CartIcons class="h-5 w-5" />
        <span
          v-if="cartQuantity > 0"
          class="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white"
        >
          {{ cartQuantity }}
        </span>
      </RouterLink>

      <img
        v-if="userData?.image"
        :src="userData.image"
        :alt="userData.firstName"
        class="h-10 w-10 rounded-full bg-brand-50 object-cover shadow-soft ring-2 ring-white"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { CartIcons, SidebarMenu } from '@/assets/icons'
import { fetchCurrentUsers } from '@/service'
import { useCart } from '@/store'

defineEmits(['toggleSidebar'])

const route = useRoute()
const { cartQuantity } = useCart()

// Shares the cache entry with the sidebar, so this doesn't trigger a second request
const { data: userData } = useQuery({
  queryKey: ['me-data'],
  queryFn: () => fetchCurrentUsers(),
  retry: false,
})
</script>
