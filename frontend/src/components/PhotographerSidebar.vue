<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "../utils/auth";
import AdminIcon from "./admin/AdminIcon.vue";

const route = useRoute();
const router = useRouter();
const currentUser = ref(auth.getCurrentUser());

const navItems = [
  {
    id: "dashboard",
    label: "Обзор",
    icon: "stats",
    path: "/photographer",
    description: "Главная панель",
  },
  {
    id: "photos",
    label: "Мои фотографии",
    icon: "photos",
    path: "/photographer/photos",
    description: "Управление работами",
  },
  {
    id: "analytics",
    label: "Аналитика",
    icon: "stats",
    path: "/photographer/analytics",
    description: "Статистика и метрики",
  },
  {
    id: "settings",
    label: "Настройки",
    icon: "category",
    path: "/photographer/settings",
    description: "Профиль и предпочтения",
  },
];

const activeItem = computed(() => {
  const currentPath = route.path;
  if (currentPath === "/photographer") return "dashboard";
  if (currentPath.startsWith("/photographer/photos")) return "photos";
  if (currentPath.startsWith("/photographer/analytics")) return "analytics";
  if (currentPath.startsWith("/photographer/settings")) return "settings";
  return null;
});

function handleLogout() {
  auth.logout();
  router.push("/");
}

defineProps<{
  isOpen?: boolean;
  onClose?: () => void;
}>();
</script>

<template>
  <aside :class="['photographer-sidebar', { 'photographer-sidebar--open': isOpen }]">
    <div class="photographer-sidebar__header">
      <div class="photographer-sidebar__brand">
        <span class="photographer-sidebar__logo-dot" />
        <div>
          <h2 class="photographer-sidebar__title">Панель автора</h2>
          <p class="photographer-sidebar__subtitle">ФотоТочка</p>
        </div>
      </div>
      <button
        v-if="onClose"
        class="photographer-sidebar__close"
        @click="onClose?.()"
        aria-label="Закрыть меню"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <nav class="photographer-sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.path"
        :class="[
          'photographer-sidebar__item',
          { 'photographer-sidebar__item--active': activeItem === item.id },
        ]"
        @click="onClose?.()"
      >
        <AdminIcon :name="item.icon" class="photographer-sidebar__icon" :size="20" />
        <div class="photographer-sidebar__content">
          <span class="photographer-sidebar__label">{{ item.label }}</span>
          <span class="photographer-sidebar__description">{{ item.description }}</span>
        </div>
      </RouterLink>
    </nav>

    <div class="photographer-sidebar__footer">
      <div class="photographer-sidebar__user">
        <div class="photographer-sidebar__user-avatar">
          {{ currentUser?.name?.charAt(0).toUpperCase() || "A" }}
        </div>
        <div class="photographer-sidebar__user-info">
          <span class="photographer-sidebar__user-name">{{ currentUser?.name }}</span>
          <span class="photographer-sidebar__user-email">{{ currentUser?.email }}</span>
        </div>
      </div>
        <button class="photographer-sidebar__logout" @click="handleLogout">
          <AdminIcon name="logout" :size="18" />
          Выйти
        </button>
    </div>
  </aside>
</template>

<style scoped>
.photographer-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(0);
  transition: transform 0.3s ease;
  box-shadow: 2px 0 24px rgba(15, 23, 42, 0.06);
}

.photographer-sidebar__header {
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.photographer-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.photographer-sidebar__logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
}

.photographer-sidebar__title {
  margin: 0;
  font-family: "Playfair Display", "Inter", serif;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.photographer-sidebar__subtitle {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.photographer-sidebar__close {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.photographer-sidebar__close:hover {
  background: rgba(15, 23, 42, 0.05);
  color: var(--color-text);
}

.photographer-sidebar__nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.photographer-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.photographer-sidebar__item:hover {
  background: rgba(16, 185, 129, 0.08);
}

.photographer-sidebar__item--active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
  color: var(--color-accent-dark);
  font-weight: 600;
}

.photographer-sidebar__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photographer-sidebar__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.photographer-sidebar__label {
  font-size: 0.95rem;
  font-weight: 500;
}

.photographer-sidebar__description {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  opacity: 0.8;
}

.photographer-sidebar__item--active .photographer-sidebar__description {
  color: var(--color-accent-dark);
  opacity: 0.9;
}

.photographer-sidebar__footer {
  padding: 1.25rem 1rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(236, 253, 245, 0.3);
}

.photographer-sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.photographer-sidebar__user-avatar {
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

.photographer-sidebar__user-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.photographer-sidebar__user-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photographer-sidebar__user-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photographer-sidebar__logout {
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

.photographer-sidebar__logout:hover {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.3);
}

@media (max-width: 1024px) {
  .photographer-sidebar {
    transform: translateX(-100%);
  }

  .photographer-sidebar--open {
    transform: translateX(0);
  }

  .photographer-sidebar__close {
    display: flex;
  }
}

@media (max-width: 640px) {
  .photographer-sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>

