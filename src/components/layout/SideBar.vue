<template>
  <!-- Drawer Sidebar -->
  <aside
    id="drawer-navigation"
    :class="[
      'bg-white border-r border-[0] border-[#e5e7eb] fixed z-40 min-h-screen h-screen flex flex-col justify-between transition-transform duration-300',
      'w-[65%] md:w-[14%]',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
    tabindex="-1"
    aria-labelledby="drawer-navigation-label"
  >
    <!-- Loading Skeleton -->
    <div
      v-if="isLoading"
      class="p-4 space-y-4 flex flex-col m-auto items-center gap-2 text-gray-500"
    >
      <SpinnerComponent class="h-16 w-16" />
      <span>Loading user info...</span>
    </div>

    <!-- Error Fallback -->
    <div v-else-if="isError" class="p-4 text-sm text-red-500">
      Failed to load user data. Please try again later.
    </div>

    <!-- Normal Sidebar Content -->
    <template v-else>
      <!-- Top Section -->
      <div :class="[props.isOpen ? '' : 'hidden', 'transition-transform duration-300']">
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
            class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 font-medium"
          >
            <div class="flex items-center gap-2">
              <component :is="link.icon" class="w-4 h-4" />
              <span>{{ link.name }}</span>
            </div>
            <span
              v-if="link.name === 'Cart' && cartQuantity > 0"
              class="bg-[#2a2b30] text-white text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              {{ cartQuantity }}
            </span>
          </RouterLink>
        </nav>
      </div>

      <!-- Bottom: User Info -->
      <div class="relative px-4 py-4 text-xs" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          <img :src="user.image" alt="User avatar" class="w-6 h-6 rounded-full" />
          <span class="text-gray-700 truncate">{{ user.fullName }}</span>
        </button>

        <div
          v-if="showDropdown"
          class="absolute bottom-14 left-4 w-[90%] bg-white border border-gray-200 rounded shadow-md text-sm z-50"
        >
          <div class="font-semibold px-4 py-2">My Account</div>
          <div class="h-px my-1 bg-[#e5e7eb]"></div>

          <RouterLink to="/profile" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
            <ProfileIcon class="w-4 h-4" />
            Profile
          </RouterLink>

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
    </template>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCart } from '@/store'
import { useQuery } from '@tanstack/vue-query'
import { fetchCurrentUsers } from '@/service'
import { SpinnerComponent } from '../ui'

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

// Vue Query: useQuery for user data
const {
  data: userData,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['me-data'],
  queryFn: fetchCurrentUsers,
  retry: false,
})

// Derived/computed user info
const user = computed(() => ({
  fullName: `${userData.value?.firstName ?? ''} ${userData.value?.lastName ?? ''}`.trim(),
  image: userData.value?.image ?? '',
}))

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
  router.push('/login')
}

const { cartQuantity, updateCartFromLocalStorage } = useCart()

onMounted(() => {
  updateCartFromLocalStorage()
  window.addEventListener('storage', updateCartFromLocalStorage)
})
</script>
