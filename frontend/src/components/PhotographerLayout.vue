<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import PhotographerSidebar from "./PhotographerSidebar.vue";

const route = useRoute();
const isSidebarOpen = ref(false);

const pageTitle = computed(() => {
  const path = route.path;
  if (path === "/photographer") return "Обзор";
  if (path.startsWith("/photographer/photos")) {
    if (path.includes("/upload")) return "Загрузить фотографию";
    return "Мои фотографии";
  }
  if (path.startsWith("/photographer/analytics")) return "Аналитика";
  if (path.startsWith("/photographer/settings")) return "Настройки";
  return "Панель управления";
});

const pageDescription = computed(() => {
  const path = route.path;
  if (path === "/photographer") return "Обзор вашей активности и статистики";
  if (path.startsWith("/photographer/photos")) {
    if (path.includes("/upload")) return "Добавьте новую работу в свой портфолио";
    return "Управляйте своими работами";
  }
  if (path.startsWith("/photographer/analytics")) return "Статистика и производительность";
  if (path.startsWith("/photographer/settings")) return "Профиль и предпочтения";
  return "";
});
</script>

<template>
  <div class="photographer-layout">
    <PhotographerSidebar :is-open="isSidebarOpen" :on-close="() => (isSidebarOpen = false)" />

    <!-- Overlay для мобильных -->
    <div
      v-if="isSidebarOpen"
      class="photographer-overlay"
      @click="isSidebarOpen = false"
    />

    <!-- Main Content -->
    <main class="photographer-main">
      <!-- Top Bar -->
      <header class="photographer-header">
        <div class="photographer-header__left">
          <button
            class="photographer-header__menu"
            @click="isSidebarOpen = !isSidebarOpen"
            aria-label="Открыть меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <div class="photographer-header__title">
            <h1 class="photographer-header__heading">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="photographer-header__subtitle">
              {{ pageDescription }}
            </p>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="photographer-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.photographer-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Overlay */
.photographer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: none;
}

/* Main Content */
.photographer-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.photographer-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.photographer-header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.photographer-header__menu {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.photographer-header__menu:hover {
  background: rgba(15, 23, 42, 0.05);
}

.photographer-header__title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.photographer-header__heading {
  margin: 0;
  font-family: "Playfair Display", "Inter", serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.photographer-header__subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Content */
.photographer-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .photographer-overlay {
    display: block;
  }

  .photographer-main {
    margin-left: 0;
  }

  .photographer-header__menu {
    display: flex;
  }

  .photographer-header {
    padding: 1rem 1.5rem;
  }

  .photographer-content {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .photographer-header {
    padding: 1rem;
  }

  .photographer-header__heading {
    font-size: 1.5rem;
  }

  .photographer-content {
    padding: 1rem;
  }
}
</style>

