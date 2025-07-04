<template>
  <!-- Drawer Sidebar -->
  <aside
    id="drawer-navigation"
    :class="[
      'w-64 bg-white border-r border-[0] border-[#e5e7eb] fixed md:static z-40 min-h-screen h-screen flex flex-col justify-between transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    ]"
    tabindex="-1"
    aria-labelledby="drawer-navigation-label"
  >
    <!-- Top Section -->
    <div>
      <!-- Brand -->
      <div class="p-4 font-semibold text-base flex items-center gap-2">
        <SidebarTitle class="w-4 h-4" />
        DummyJSON Store
      </div>

      <!-- Navigation Title -->
      <div class="text-xs text-gray-500 px-4 pt-4 uppercase tracking-wide">Navigation</div>

      <!-- Navigation Links -->
      <nav class="mt-2 px-2 text-sm text-gray-700 space-y-1">
        <RouterLink
          v-for="link in sidebarLinks"
          :key="link.name"
          :to="link.to"
          class="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 transition-colors"
          active-class="bg-gray-100 font-medium"
        >
          <component :is="link.icon" class="w-4 h-4 text-gray-500" />
          <span>{{ link.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Bottom: User Info as Dropdown -->
    <div class="relative px-4 py-4 text-xs" ref="dropdownRef">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded"
      >
        <img :src="user.image" alt="User avatar" class="w-6 h-6 rounded-full" />
        <span class="text-gray-700 truncate">{{ user.fullName }}</span>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showDropdown"
        class="absolute bottom-14 left-4 w-48 bg-white border rounded shadow-lg text-sm z-50"
      >
        <div class="font-semibold px-4 py-2 border-b">My Account</div>
        <RouterLink to="/profile" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
          <!-- Profile icon -->
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.121 17.804A11.966 11.966 0 0112 15c2.485 0 4.779.76 6.879 2.05M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Profile
        </RouterLink>
        <button class="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
          <!-- Logout icon -->
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2v-1m-7-4v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1"
            />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  CartIcons,
  DashboardIcons,
  SidebarTitle,
  OrderIcons,
  ProductIcon,
  ShopIcon,
} from '@/assets/icons'
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  gender: string
  image: string
}

defineProps<{
  isOpen: boolean
}>()

const sidebarLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: DashboardIcons },
  { name: 'Products', to: '/products', icon: ProductIcon },
  { name: 'Shop', to: '/shop', icon: ShopIcon },
  { name: 'Cart', to: '/cart', icon: CartIcons },
  { name: 'Orders', to: '/orders', icon: OrderIcons },
]

// Reactive user info from localStorage
const user = ref<User>({
  id: '',
  username: '',
  email: '',
  fullName: '',
  gender: '',
  image: '',
})

onMounted(() => {
  const rawUser = localStorage.getItem('user')
  if (rawUser) {
    const userData = JSON.parse(rawUser)
    user.value.fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
    user.value.image = userData.image || user.value.image
  }
})

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
