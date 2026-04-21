import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../utils/auth'
import { applySeo } from '../seo/seoConfig'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../pages/CatalogPage.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/catalog/photos',
      name: 'catalog-photos',
      component: () => import('../pages/CatalogPhotosPage.vue'),
    },
    {
      path: '/photo/:id',
      name: 'photo-detail',
      component: () => import('../pages/PhotoDetailPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../pages/BlogPage.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../pages/HelpPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/RegisterPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/photographer',
      name: 'photographer-dashboard',
      component: () => import('../pages/PhotographerDashboard.vue'),
    },
    {
      path: '/photographer/photos',
      name: 'photographer-photos',
      component: () => import('../pages/PhotographerPhotos.vue'),
    },
    {
      path: '/photographer/photos/upload',
      name: 'photographer-upload',
      component: () => import('../pages/PhotographerUpload.vue'),
    },
    {
      path: '/photographer/analytics',
      name: 'photographer-analytics',
      component: () => import('../pages/PhotographerAnalytics.vue'),
    },
    {
      path: '/photographer/settings',
      name: 'photographer-settings',
      component: () => import('../pages/PhotographerSettings.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})


router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !auth.isAdmin()) {
    next({ name: 'home' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  applySeo(to)
})

export default router

