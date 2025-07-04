<template>
  <!-- Drawer Sidebar -->
  <aside
    id="drawer-navigation"
    :class="[
      'w-[14%] bg-white border-r border-[0] border-[#e5e7eb] fixed z-40 min-h-screen h-screen flex flex-col justify-between transition-transform duration-300',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
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
          <component :is="link.icon" class="w-4 h-4" />
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

      <!-- Dropdown Menu with shadow -->
      <div
        v-if="showDropdown"
        class="absolute bottom-14 left-4 w-[90%] bg-white border border-gray-200 rounded shadow-md text-sm z-50"
      >
        <div class="font-semibold px-4 py-2">My Account</div>

        <!-- Divider -->
        <div class="h-px my-1 bg-[#e5e7eb]"></div>

        <RouterLink to="/profile" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
          <ProfileIcon class="w-4 h-4" />
          Profile
        </RouterLink>

        <!-- Divider -->
        <div class="h-px my-1 bg-[#e5e7eb]"></div>

        <button
          @click="handleSignOut"
          class="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
        >
          <SignOutIcon class="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import {
  CartIcons,
  DashboardIcons,
  SidebarTitle,
  OrderIcons,
  ProductIcon,
  ShopIcon,
  ProfileIcon,
  SignOutIcon,
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

const props = defineProps<{
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

const router = useRouter()

const handleSignOut = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
