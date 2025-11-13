<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import PhotographerLayout from '../components/PhotographerLayout.vue'
import AdminIcon from '../components/admin/AdminIcon.vue'
import PhotoCard from '../components/PhotoCard.vue'
import alpineLake from '../assets/images/alpine-lake.jpg'
import aerialLandscape from '../assets/images/aerial-landscape.jpg'
import creativeDesk from '../assets/images/creative-desk.jpg'
import dawnTrails from '../assets/images/dawn-trails.jpg'
import santoriniSunset from '../assets/images/santorini-sunset.jpg'
import skylineOverlook from '../assets/images/skyline-overlook.jpg'

interface Photo {
  id: string
  title: string
  category: string
  imageUrl: string
  views: number
  downloads: number
  earnings: number
  status: 'published' | 'pending' | 'draft'
  uploadedAt: string
  tags: string[]
}

const photos = ref<Photo[]>([
  {
    id: '1',
    title: 'Горное утро',
    category: 'Природа',
    imageUrl: alpineLake,
    views: 1240,
    downloads: 12,
    earnings: 3600,
    status: 'published',
    uploadedAt: '2024-01-15',
    tags: ['озеро', 'рассвет'],
  },
  {
    id: '2',
    title: 'Вид сверху',
    category: 'Ландшафты',
    imageUrl: aerialLandscape,
    views: 890,
    downloads: 8,
    earnings: 2400,
    status: 'published',
    uploadedAt: '2024-01-14',
    tags: ['вид сверху', 'геометрия'],
  },
  {
    id: '3',
    title: 'План на неделю',
    category: 'Лайфстайл',
    imageUrl: creativeDesk,
    views: 0,
    downloads: 0,
    earnings: 0,
    status: 'pending',
    uploadedAt: '2024-01-16',
    tags: ['планирование', 'flatlay'],
  },
  {
    id: '4',
    title: 'Туманная тропа',
    category: 'Природа',
    imageUrl: dawnTrails,
    views: 560,
    downloads: 5,
    earnings: 1500,
    status: 'published',
    uploadedAt: '2024-01-13',
    tags: ['лес', 'утро'],
  },
  {
    id: '5',
    title: 'Сияние Санторини',
    category: 'Город',
    imageUrl: santoriniSunset,
    views: 2100,
    downloads: 18,
    earnings: 5400,
    status: 'published',
    uploadedAt: '2024-01-12',
    tags: ['эгейские купола', 'сумерки'],
  },
  {
    id: '6',
    title: 'Огни большого города',
    category: 'Город',
    imageUrl: skylineOverlook,
    views: 0,
    downloads: 0,
    earnings: 0,
    status: 'draft',
    uploadedAt: '2024-01-17',
    tags: ['ночь', 'урбанистика'],
  },
])

const filterStatus = ref<'all' | 'published' | 'pending' | 'draft'>('all')
const searchQuery = ref('')

const filteredPhotos = computed(() => {
  let result = photos.value

  if (filterStatus.value !== 'all') {
    result = result.filter((photo) => photo.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (photo) =>
        photo.title.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return result
})

function deletePhoto(id: string) {
  if (confirm('Вы уверены, что хотите удалить эту фотографию?')) {
    photos.value = photos.value.filter((photo) => photo.id !== id)
  }
}
</script>

<template>
  <PhotographerLayout>
    <div class="photos-page">
      <div class="photos-page__header">
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

      <!-- Фильтры и поиск -->
      <div class="photos-page__filters">
        <div class="search-box">
          <AdminIcon name="search" :size="20" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Поиск по названию, категории или тегам..."
          />
        </div>

        <div class="filter-tabs">
          <button
            :class="['filter-tab', { 'filter-tab--active': filterStatus === 'all' }]"
            @click="filterStatus = 'all'"
          >
            Все
          </button>
          <button
            :class="['filter-tab', { 'filter-tab--active': filterStatus === 'published' }]"
            @click="filterStatus = 'published'"
          >
            Опубликовано
          </button>
          <button
            :class="['filter-tab', { 'filter-tab--active': filterStatus === 'pending' }]"
            @click="filterStatus = 'pending'"
          >
            На модерации
          </button>
          <button
            :class="['filter-tab', { 'filter-tab--active': filterStatus === 'draft' }]"
            @click="filterStatus = 'draft'"
          >
            Черновики
          </button>
        </div>
      </div>

      <!-- Список фотографий -->
      <div v-if="filteredPhotos.length > 0" class="photos-grid">
        <PhotoCard
          v-for="photo in filteredPhotos"
          :key="photo.id"
          :photo="photo"
          :show-actions="true"
          :show-stats="true"
          :show-status="true"
          @edit="() => {}"
          @delete="deletePhoto"
        />
      </div>

      <div v-else class="photos-empty">
        <AdminIcon name="photos" :size="48" class="photos-empty__icon" />
        <h3>Фотографии не найдены</h3>
        <p>Попробуйте изменить фильтры или загрузите новую фотографию</p>
        <RouterLink to="/photographer/photos/upload" class="btn btn--primary">
          Загрузить фото
        </RouterLink>
      </div>
    </div>
  </PhotographerLayout>
</template>

<style scoped>
.photos-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.photos-page__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.photos-page__filters {
  margin-bottom: 3rem;
  display: grid;
  gap: 1.5rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box :deep(.admin-icon) {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1.1rem 0.85rem 3rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.filter-tab--active {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.photos-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-muted);
}

.photos-empty__icon {
  margin: 0 auto 1.5rem;
  color: var(--color-text-muted);
  opacity: 0.5;
  display: block;
}

.photos-empty h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: var(--color-text);
}

.photos-empty p {
  margin: 0 0 2rem;
}

@media (max-width: 768px) {
  .photos-page__header {
    flex-direction: column;
  }

  .photos-grid {
    grid-template-columns: 1fr;
  }

  .photo-card__actions {
    opacity: 1;
  }
}
</style>

