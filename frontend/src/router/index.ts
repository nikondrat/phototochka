import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router

