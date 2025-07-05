import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { DashboardPage, ProductsPage, LoginPage, NotFoundPage } from '@/pages'
import ShopPage from '@/pages/ShopPage.vue'
import CartPage from '@/pages/CartPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'shop',
        name: 'Shop',
        component: ShopPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: CartPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: OrdersPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: CheckoutPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Simple fake auth check
function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

// Global navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated()) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
