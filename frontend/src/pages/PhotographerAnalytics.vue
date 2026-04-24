<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PhotographerLayout from '../components/PhotographerLayout.vue'
import AdminIcon from '../components/admin/AdminIcon.vue'
import { authorService } from '../services/authorPhotoService'

interface ChartData {
  date: string
  views: number
  downloads: number
  earnings: number
}

interface TopPhoto {
  id: string
  title: string
  views: number
  downloads: number
  earnings: number
}

interface StatCard {
  id: string
  title: string
  value: string | number
  change: string
  icon: string
  color: string
  bgGradient: string
}

const timeRange = ref<'week' | 'month' | 'year'>('month')
const loading = ref(true)
const statsData = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    statsData.value = await authorService.getStats()
  } catch (e) {
    console.error('Failed to load analytics', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const chartData = computed<ChartData[]>(() => statsData.value?.chartData || [])
const topPhotos = computed<TopPhoto[]>(() => statsData.value?.topPhotos || [])

const stats = computed<StatCard[]>(() => [
  {
    id: 'views',
    title: 'Всего просмотров',
    value: statsData.value?.totalViews || 0,
    change: statsData.value?.trends?.views || '—',
    icon: 'view',
    color: '#8B5CF6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
  },
  {
    id: 'downloads',
    title: 'Скачиваний',
    value: statsData.value?.totalDownloads || 0,
    change: statsData.value?.trends?.downloads || '—',
    icon: 'download',
    color: '#3B82F6',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
  },
  {
    id: 'earnings',
    title: 'Заработано',
    value: `₽${(statsData.value?.totalEarnings || 0).toLocaleString()}`,
    change: statsData.value?.trends?.earnings || '—',
    icon: 'money',
    color: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
  },
  {
    id: 'photos',
    title: 'Активных фото',
    value: statsData.value?.totalPhotos || 0,
    change: statsData.value?.trends?.photos || '—',
    icon: 'photos',
    color: '#10B981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
  },
])

const maxValue = computed(() =>
  Math.max(...chartData.value.map((d) => Math.max(d.views, d.downloads * 50, d.earnings / 10)))
)
</script>

<template>
  <PhotographerLayout>
    <div class="analytics-page">
      <div class="analytics-page__header">
        <div class="time-range-selector">
          <button
            :class="['time-range-btn', { 'time-range-btn--active': timeRange === 'week' }]"
            @click="timeRange = 'week'"
          >
            Неделя
          </button>
          <button
            :class="['time-range-btn', { 'time-range-btn--active': timeRange === 'month' }]"
            @click="timeRange = 'month'"
          >
            Месяц
          </button>
          <button
            :class="['time-range-btn', { 'time-range-btn--active': timeRange === 'year' }]"
            @click="timeRange = 'year'"
          >
            Год
          </button>
        </div>
      </div>

      <!-- Общая статистика -->
      <div class="analytics-stats">
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
              {{ typeof stat.value === 'number' ? stat.value.toLocaleString('ru-RU') : stat.value }}
            </div>
            <div class="stat-card__label">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- График -->
      <div class="analytics-chart-section">
        <h2 class="analytics-section-title">Динамика показателей</h2>
        <div class="analytics-chart">
          <div class="analytics-chart__bars">
            <div
              v-for="data in chartData"
              :key="data.date"
              class="chart-bar-group"
            >
              <div class="chart-bar-wrapper">
                <div
                  class="chart-bar chart-bar--views"
                  :style="{ height: `${(data.views / maxValue) * 100}%` }"
                  :title="`Просмотры: ${data.views}`"
                />
                <div
                  class="chart-bar chart-bar--downloads"
                  :style="{ height: `${((data.downloads * 50) / maxValue) * 100}%` }"
                  :title="`Скачивания: ${data.downloads}`"
                />
                <div
                  class="chart-bar chart-bar--earnings"
                  :style="{ height: `${((data.earnings / 10) / maxValue) * 100}%` }"
                  :title="`Заработано: ₽${data.earnings}`"
                />
              </div>
              <span class="chart-label">
                {{ new Date(data.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
          </div>
          <div class="analytics-chart__legend">
            <div class="chart-legend-item">
              <span class="chart-legend-color chart-legend-color--views" />
              <span>Просмотры</span>
            </div>
            <div class="chart-legend-item">
              <span class="chart-legend-color chart-legend-color--downloads" />
              <span>Скачивания</span>
            </div>
            <div class="chart-legend-item">
              <span class="chart-legend-color chart-legend-color--earnings" />
              <span>Заработано</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Топ фотографий -->
      <div class="analytics-top-photos">
        <h2 class="analytics-section-title">Топ фотографий</h2>
        <div class="top-photos-list">
          <div
            v-for="(photo, index) in topPhotos"
            :key="photo.id"
            class="top-photo-item"
          >
            <div class="top-photo-item__rank">#{{ index + 1 }}</div>
            <div class="top-photo-item__content">
              <h3 class="top-photo-item__title">{{ photo.title }}</h3>
              <div class="top-photo-item__stats">
                <div class="top-photo-item__stat">
                  <AdminIcon name="view" :size="16" class="top-photo-item__stat-icon" />
                  <span>{{ photo.views.toLocaleString() }}</span>
                </div>
                <div class="top-photo-item__stat">
                  <AdminIcon name="download" :size="16" class="top-photo-item__stat-icon" />
                  <span>{{ photo.downloads }}</span>
                </div>
                <div class="top-photo-item__stat">
                  <AdminIcon name="money" :size="16" class="top-photo-item__stat-icon" />
                  <span>₽{{ photo.earnings.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PhotographerLayout>
</template>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.analytics-page__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.time-range-selector {
  display: flex;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 0.25rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.time-range-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.time-range-btn:hover {
  color: var(--color-text);
  background: rgba(15, 23, 42, 0.05);
}

.time-range-btn--active {
  background: var(--color-accent);
  color: #ffffff;
}

.analytics-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
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
  font-family: 'Inter', sans-serif;
}

.stat-card__label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.analytics-section-title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Playfair Display', 'Inter', serif;
}

.analytics-chart-section {
  margin-bottom: 3rem;
}

.analytics-chart {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.analytics-chart__bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  height: 300px;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.chart-bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
}

.chart-bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.25rem;
  position: relative;
}

.chart-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.chart-bar--views {
  background: var(--color-accent);
}

.chart-bar--downloads {
  background: #3b82f6;
}

.chart-bar--earnings {
  background: #f59e0b;
}

.chart-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.analytics-chart__legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
}

.chart-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.chart-legend-color--views {
  background: var(--color-accent);
}

.chart-legend-color--downloads {
  background: #3b82f6;
}

.chart-legend-color--earnings {
  background: #f59e0b;
}

.analytics-top-photos {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.top-photos-list {
  display: grid;
  gap: 1rem;
}

.top-photo-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: var(--color-surface);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.top-photo-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  background: #ffffff;
}

.top-photo-item__rank {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.top-photo-item__content {
  flex: 1;
  display: grid;
  gap: 0.5rem;
}

.top-photo-item__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.top-photo-item__stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.top-photo-item__stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.top-photo-item__stat-icon {
  color: var(--color-text-muted);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .analytics-page__header {
    flex-direction: column;
  }

  .analytics-stats {
    grid-template-columns: 1fr;
  }

  .analytics-chart__bars {
    height: 200px;
  }

  .chart-bar-group {
    min-width: 40px;
  }

  .top-photo-item__stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
