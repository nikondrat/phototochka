<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import PhotographerLayout from "../components/PhotographerLayout.vue";
import AdminIcon from "../components/admin/AdminIcon.vue";
import PhotoCard from "../components/PhotoCard.vue";
import alpineLake from "../assets/images/alpine-lake.jpg";
import aerialLandscape from "../assets/images/aerial-landscape.jpg";
import creativeDesk from "../assets/images/creative-desk.jpg";
import dawnTrails from "../assets/images/dawn-trails.jpg";

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  color: string;
  bgGradient: string;
}


const stats = ref<StatCard[]>([
  {
    id: "total-photos",
    title: "Всего фотографий",
    value: 128,
    change: "+12%",
    icon: "photos",
    color: "#10B981",
    bgGradient:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
  },
  {
    id: "total-views",
    title: "Просмотры",
    value: "24.5K",
    change: "+18%",
    icon: "view",
    color: "#8B5CF6",
    bgGradient:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))",
  },
  {
    id: "total-downloads",
    title: "Скачивания",
    value: 342,
    change: "+23%",
    icon: "view",
    color: "#3B82F6",
    bgGradient:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
  },
  {
    id: "total-earnings",
    title: "Заработано",
    value: "₽45,200",
    change: "+15%",
    icon: "money",
    color: "#F59E0B",
    bgGradient:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
  },
]);

const recentPhotos = ref([
  {
    id: "1",
    title: "Горное утро",
    category: "Природа",
    imageUrl: alpineLake,
    views: 1240,
    downloads: 12,
    status: "published" as const,
    uploadedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Вид сверху",
    category: "Ландшафты",
    imageUrl: aerialLandscape,
    views: 890,
    downloads: 8,
    status: "published" as const,
    uploadedAt: "2024-01-14",
  },
  {
    id: "3",
    title: "План на неделю",
    category: "Лайфстайл",
    imageUrl: creativeDesk,
    views: 0,
    downloads: 0,
    status: "pending" as const,
    uploadedAt: "2024-01-16",
  },
  {
    id: "4",
    title: "Туманная тропа",
    category: "Природа",
    imageUrl: dawnTrails,
    views: 560,
    downloads: 5,
    status: "published" as const,
    uploadedAt: "2024-01-13",
  },
]);

</script>

<template>
  <PhotographerLayout>
    <div class="dashboard">
      <!-- Header with CTA -->
      <div class="dashboard__header">
        <RouterLink to="/photographer/photos/upload" class="btn btn--primary">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Загрузить фото
        </RouterLink>
      </div>

      <!-- Stats Grid -->
      <div class="dashboard__stats">
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="stat-card"
          :style="{ background: stat.bgGradient }"
        >
          <div class="stat-card__header">
            <div class="stat-card__icon-wrapper" :style="{ color: stat.color }">
              <AdminIcon :name="stat.icon" class="stat-card__icon" :size="24" />
            </div>
            <span class="stat-card__trend" :style="{ color: stat.color }">
              {{ stat.change }}
            </span>
          </div>
          <div class="stat-card__body">
            <div class="stat-card__value" :style="{ color: stat.color }">
              {{ typeof stat.value === "number" ? stat.value.toLocaleString("ru-RU") : stat.value }}
            </div>
            <div class="stat-card__label">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard__section">
        <h2 class="dashboard__section-title">Быстрые действия</h2>
        <div class="quick-actions">
          <RouterLink to="/photographer/photos" class="quick-action">
            <div class="quick-action__icon quick-action__icon--green">
              <AdminIcon name="photos" :size="24" />
            </div>
            <div class="quick-action__content">
              <h3 class="quick-action__title">Управление фотографиями</h3>
              <p class="quick-action__description">Просмотр, редактирование и удаление</p>
            </div>
          </RouterLink>
          <RouterLink to="/photographer/analytics" class="quick-action">
            <div class="quick-action__icon quick-action__icon--purple">
              <AdminIcon name="stats" :size="24" />
            </div>
            <div class="quick-action__content">
              <h3 class="quick-action__title">Аналитика</h3>
              <p class="quick-action__description">Статистика и производительность</p>
            </div>
          </RouterLink>
          <RouterLink to="/photographer/settings" class="quick-action">
            <div class="quick-action__icon quick-action__icon--blue">
              <AdminIcon name="category" :size="24" />
            </div>
            <div class="quick-action__content">
              <h3 class="quick-action__title">Настройки</h3>
              <p class="quick-action__description">Профиль и предпочтения</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Photos -->
      <div class="dashboard__section">
        <div class="dashboard__section-header">
          <h2 class="dashboard__section-title">Последние фотографии</h2>
          <RouterLink to="/photographer/photos" class="dashboard__link">
            Все фотографии →
          </RouterLink>
        </div>
        <div class="recent-photos">
          <PhotoCard
            v-for="photo in recentPhotos"
            :key="photo.id"
            :photo="photo"
            :show-status="true"
            :show-stats="true"
            variant="compact"
          />
        </div>
      </div>
    </div>
  </PhotographerLayout>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.dashboard__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-card__icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__icon {
  width: 24px;
  height: 24px;
}

.stat-card__trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.stat-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card__value {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  font-family: "Inter", sans-serif;
}

.stat-card__label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.dashboard__section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard__section-title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.dashboard__link {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dashboard__link:hover {
  color: var(--color-accent-dark);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-action {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--color-text);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  border-color: var(--color-accent);
}

.quick-action__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-action__icon--green {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.quick-action__icon--purple {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.quick-action__icon--blue {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.quick-action__content {
  flex: 1;
  display: grid;
  gap: 0.25rem;
}

.quick-action__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.quick-action__description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.recent-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard__header {
    justify-content: stretch;
  }

  .dashboard__header .btn {
    width: 100%;
  }

  .dashboard__stats {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .recent-photos {
    grid-template-columns: 1fr;
  }

  .dashboard__section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
