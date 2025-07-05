<template>
  <div class="flex min-h-screen text-gray-900">
    <Sidebar :isOpen="isSidebarOpen" />

    <!-- Adjusted layout container -->
    <div :class="['flex flex-col min-h-screen w-full transition-all duration-300']">
      <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" :isOpen="isSidebarOpen" />
      <main
        :class="[
          'p-6 transition-all flex flex-1 duration-300',
          isSidebarOpen ? 'md:ml-[14%]' : 'ml-0',
        ]"
      >
        <RouterView />
      </main>
    </div>
  </div>
  <SnackBar />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './SideBar.vue'
import Navbar from './NavBar.vue'
import { SnackBar } from '../ui'

const isSidebarOpen = ref(true)
</script>
