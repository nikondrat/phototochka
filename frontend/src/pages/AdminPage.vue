<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../utils/auth'
import AdminStats from '../components/admin/AdminStats.vue'
import AdminPhotos from '../components/admin/AdminPhotos.vue'
import AdminAuthors from '../components/admin/AdminAuthors.vue'
import AdminCategories from '../components/admin/AdminCategories.vue'
import AdminIcon from '../components/admin/AdminIcon.vue'

const router = useRouter()
const route = useRoute()

type Tab = 'stats' | 'photos' | 'authors' | 'categories'

const activeTab = ref<Tab>((route.query.tab as Tab) || 'stats')
const currentUser = ref(auth.getCurrentUser())
const isSidebarOpen = ref(false)

onMounted(() => {
  if (!auth.isAdmin()) {
    router.push('/login')
  }
})

function handleLogout() {
  auth.logout()
  router.push('/')
}

function setTab(tab: Tab) {
  activeTab.value = tab
  isSidebarOpen.value = false
  router.replace({ query: { tab } })
}

const tabs = [
  { id: 'stats' as Tab, label: 'Статистика', icon: 'stats', description: 'Обзор платформы' },
  { id: 'photos' as Tab, label: 'Фотографии', icon: 'photos', description: 'Управление контентом' },
  { id: 'authors' as Tab, label: 'Авторы', icon: 'authors', description: 'Управление пользователями' },
  { id: 'categories' as Tab, label: 'Категории', icon: 'categories', description: 'Организация контента' },
]

const activeTabData = computed(() => tabs.find((t) => t.id === activeTab.value))
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside :class="['admin-sidebar', { 'admin-sidebar--open': isSidebarOpen }]">
      <div class="admin-sidebar__header">
        <div class="admin-sidebar__brand">
          <span class="admin-sidebar__logo-dot" />
          <div>
            <h2 class="admin-sidebar__title">Админ-панель</h2>
            <p class="admin-sidebar__subtitle">ФотоТочка</p>
          </div>
        </div>
        <button
          class="admin-sidebar__close"
          @click="isSidebarOpen = false"
          aria-label="Закрыть меню"
        >
          <AdminIcon name="close" />
        </button>
      </div>

      <nav class="admin-sidebar__nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['admin-sidebar__item', { 'admin-sidebar__item--active': activeTab === tab.id }]"
          @click="setTab(tab.id)"
        >
          <AdminIcon :name="tab.icon" class="admin-sidebar__icon" :size="20" />
          <div class="admin-sidebar__content">
            <span class="admin-sidebar__label">{{ tab.label }}</span>
            <span class="admin-sidebar__description">{{ tab.description }}</span>
          </div>
        </button>
      </nav>

      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__user">
          <div class="admin-sidebar__user-avatar">
            {{ (currentUser?.displayName || currentUser?.username || '?').charAt(0).toUpperCase() }}
          </div>
          <div class="admin-sidebar__user-info">
            <span class="admin-sidebar__user-name">{{ currentUser?.displayName || currentUser?.username }}</span>
            <span class="admin-sidebar__user-email">{{ currentUser?.email }}</span>
          </div>
        </div>
        <button class="admin-sidebar__logout" @click="handleLogout">
          <AdminIcon name="logout" :size="18" />
          Выйти
        </button>
      </div>
    </aside>

    <!-- Overlay для мобильных -->
    <div
      v-if="isSidebarOpen"
      class="admin-overlay"
      @click="isSidebarOpen = false"
    />

    <!-- Main Content -->
    <main class="admin-main">
      <!-- Top Bar -->
      <header class="admin-header">
        <div class="admin-header__left">
          <button
            class="admin-header__menu"
            @click="isSidebarOpen = !isSidebarOpen"
            aria-label="Открыть меню"
          >
            <AdminIcon name="menu" :size="24" />
          </button>
          <div class="admin-header__title">
            <h1 class="admin-header__heading">{{ activeTabData?.label }}</h1>
            <p class="admin-header__subtitle">{{ activeTabData?.description }}</p>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="admin-content">
        <transition name="fade" mode="out-in">
          <AdminStats v-if="activeTab === 'stats'" key="stats" />
          <AdminPhotos v-else-if="activeTab === 'photos'" key="photos" />
          <AdminAuthors v-else-if="activeTab === 'authors'" key="authors" />
          <AdminCategories v-else-if="activeTab === 'categories'" key="categories" />
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Sidebar */
.admin-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateX(0);
  transition: transform 0.3s ease;
  box-shadow: 2px 0 24px rgba(15, 23, 42, 0.06);
}

.admin-sidebar__header {
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-sidebar__logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
}

.admin-sidebar__title {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.admin-sidebar__subtitle {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.admin-sidebar__close {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.admin-sidebar__close:hover {
  background: rgba(15, 23, 42, 0.05);
  color: var(--color-text);
}

.admin-sidebar__nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.admin-sidebar__item:hover {
  background: rgba(16, 185, 129, 0.08);
}

.admin-sidebar__item--active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
  color: var(--color-accent-dark);
  font-weight: 600;
}

.admin-sidebar__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-sidebar__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.admin-sidebar__label {
  font-size: 0.95rem;
  font-weight: 500;
}

.admin-sidebar__description {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  opacity: 0.8;
}

.admin-sidebar__item--active .admin-sidebar__description {
  color: var(--color-accent-dark);
  opacity: 0.9;
}

.admin-sidebar__footer {
  padding: 1.25rem 1rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(236, 253, 245, 0.3);
}

.admin-sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.admin-sidebar__user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.admin-sidebar__user-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.admin-sidebar__user-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-sidebar__user-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-sidebar__logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #ffffff;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #ef4444;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.admin-sidebar__logout:hover {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Overlay */
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: none;
}

/* Main Content */
.admin-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.admin-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background: #ffffff;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.admin-header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.admin-header__menu {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.admin-header__menu:hover {
  background: rgba(15, 23, 42, 0.05);
}

.admin-header__title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-header__heading {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.admin-header__subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-header__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}


/* Content */
.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-overlay {
    display: block;
  }

  .admin-main {
    margin-left: 0;
  }

  .admin-header__menu {
    display: flex;
  }

  .admin-header {
    padding: 1rem 1.5rem;
  }

  .admin-content {
    padding: 1.5rem;
  }

  .admin-sidebar__close {
    display: flex;
  }
}

@media (max-width: 640px) {
  .admin-header {
    padding: 1rem;
  }

  .admin-header__heading {
    font-size: 1.5rem;
  }

  .admin-content {
    padding: 1rem;
  }

  .admin-sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>
