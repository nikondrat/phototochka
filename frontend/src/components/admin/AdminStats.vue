<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { adminService, type AdminStats } from "../../services/adminService";
import AdminIcon from "./AdminIcon.vue";

const loading = ref(true);
const statsData = ref<AdminStats | null>(null);

onMounted(async () => {
  try {
    statsData.value = await adminService.getStats();
  } catch (error) {
    console.error("Failed to fetch admin stats", error);
  } finally {
    loading.value = false;
  }
});

const stats = computed(() => [
  {
    label: "Всего фотографий",
    value: statsData.value?.totalPhotos || 0,
    icon: "photos",
    color: "#10B981",
    bgGradient:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
    trend: (statsData.value as any)?.trends?.photos || "+0%",
  },
  {
    label: "Авторов",
    value: statsData.value?.totalAuthors || 0,
    icon: "authors",
    color: "#3B82F6",
    bgGradient:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
    trend: (statsData.value as any)?.trends?.authors || "+0%",
  },
  {
    label: "Просмотров",
    value: statsData.value?.totalViews || 0,
    icon: "view",
    color: "#8B5CF6",
    bgGradient:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))",
    trend: (statsData.value as any)?.trends?.views || "+0%",
  },
  {
    label: "Продаж",
    value: statsData.value?.totalSales || 0,
    icon: "money",
    color: "#F59E0B",
    bgGradient:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
    trend: (statsData.value as any)?.trends?.sales || "+0%",
  },
]);

const recentActivity = computed(() => statsData.value?.recentActivity || []);
</script>

<template>
  <div class="admin-stats">
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
        :style="{ background: stat.bgGradient }"
      >
        <div class="stat-card__header">
          <div class="stat-card__icon-wrapper" :style="{ color: stat.color }">
            <AdminIcon :name="stat.icon" class="stat-card__icon" :size="24" />
          </div>
          <span class="stat-card__trend" :style="{ color: stat.color }">
            {{ stat.trend }}
          </span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value" :style="{ color: stat.color }">
            {{
              (typeof stat.value === "number"
                ? stat.value
                : Number(stat.value) || 0
              ).toLocaleString("ru-RU")
            }}
          </div>
          <div class="stat-card__label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <div class="stats-content">
      <div class="stats-section">
        <div class="stats-section__header">
          <h3 class="stats-section__title">Общая статистика</h3>
          <span class="stats-section__badge">За всё время</span>
        </div>
        <div class="stats-section__body">
          <div class="stat-item">
            <span class="stat-item__label">Выручка</span>
            <span class="stat-item__value"
              >{{ (statsData?.revenue || 0).toLocaleString("ru-RU") }} ₽</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-item__label">Средний чек</span>
            <span class="stat-item__value"
              >{{
                (statsData?.totalSales && statsData.totalSales > 0
                  ? Math.round((statsData.revenue || 0) / statsData.totalSales)
                  : 0
                ).toLocaleString("ru-RU")
              }}
              ₽</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-item__label">Конверсия</span>
            <span class="stat-item__value"
              >{{
                statsData?.totalViews && statsData.totalViews > 0
                  ? ((statsData.totalSales / statsData.totalViews) * 100).toFixed(2)
                  : "0.00"
              }}%</span
            >
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section__header">
          <h3 class="stats-section__title">Последняя активность</h3>
        </div>
        <div class="activity-list">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="activity-item"
          >
            <div class="activity-item__icon">
              <AdminIcon
                :name="
                  activity.type === 'photo'
                    ? 'photos'
                    : activity.type === 'author'
                    ? 'authors'
                    : 'stats'
                "
                :size="20"
              />
            </div>
            <div class="activity-item__content">
              <div class="activity-item__action">{{ activity.action }}</div>
              <div class="activity-item__meta">
                <span>{{ activity.author }}</span>
                <span class="activity-item__time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
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
  font-size: 1.5rem;
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

.stats-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stats-section {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.stats-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.stats-section__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Playfair Display", "Inter", serif;
}

.stats-section__badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent-dark);
  border-radius: 6px;
  font-weight: 500;
}

.stats-section__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(236, 253, 245, 0.3);
  border-radius: 8px;
}

.stat-item__label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.stat-item__value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-accent-dark);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(236, 253, 245, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(236, 253, 245, 0.4);
}

.activity-item__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.activity-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-item__action {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.activity-item__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.activity-item__time {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-content {
    grid-template-columns: 1fr;
  }
}
</style>
