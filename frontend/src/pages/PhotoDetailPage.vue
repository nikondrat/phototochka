<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Teleport } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LicenseSelector from '../components/LicenseSelector.vue'
import SimilarPhotos from '../components/SimilarPhotos.vue'
import type { Photo } from '../data/photos'
import { getPhoto, getSimilarPhotos } from '../services/photoService'

const route = useRoute()
const router = useRouter()

const photo = ref<Photo | null>(null)
const similarPhotos = ref<Photo[]>([])
const loading = ref(true)
const selectedLicenseId = ref('')
const imageZoomed = ref(false)

// Загрузка данных фотографии
async function loadPhotoData() {
  const photoId = route.params.id as string

  try {
    loading.value = true
    const photoData = await getPhoto(photoId)

    if (!photoData) {
      router.push({ name: 'catalog-photos' })
      return
    }

    photo.value = photoData

    // Выбираем первую лицензию по умолчанию
    if (photoData.licenseTypes && photoData.licenseTypes.length > 0) {
      const firstLicense = photoData.licenseTypes[0]
      if (firstLicense) {
        selectedLicenseId.value = firstLicense.id
      }
    }

    // Загружаем похожие фото
    const similar = await getSimilarPhotos(photoId, photoData.category, 6)
    similarPhotos.value = similar
  } catch (error) {
    console.error('Ошибка загрузки фотографии:', error)
    router.push({ name: 'catalog-photos' })
  } finally {
    loading.value = false
  }
}

const selectedLicense = computed(() => {
  if (!photo.value) return null
  return photo.value.licenseTypes.find((l) => l.id === selectedLicenseId.value)
})

const totalPrice = computed(() => {
  return selectedLicense.value?.price || 0
})

function handleBuy() {
  // UI только - без функциональности
  console.log('Покупка:', { photoId: photo.value?.id, licenseId: selectedLicenseId.value })
}

function handleAddToCart() {
  // UI только - без функциональности
  console.log('Добавление в корзину:', {
    photoId: photo.value?.id,
    licenseId: selectedLicenseId.value,
  })
}

function toggleZoom() {
  imageZoomed.value = !imageZoomed.value
  
  // Блокируем скролл страницы при zoom
  if (imageZoomed.value) {
    document.body.style.overflow = 'hidden'
    // Устанавливаем фокус на модальное окно для поддержки ESC
    nextTick(() => {
      const modal = document.querySelector('.photo-zoom-modal') as HTMLElement
      if (modal) {
        modal.focus()
      }
    })
  } else {
    document.body.style.overflow = ''
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Отслеживание изменения ID в роуте
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loadPhotoData()
    }
  }
)

onMounted(() => {
  loadPhotoData()
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <main class="page photo-detail-page">
    <div v-if="loading" class="photo-detail-loading">
      <div class="container">
        <div class="photo-detail-loading__skeleton">
          <div class="photo-detail-loading__skeleton-image"></div>
          <div class="photo-detail-loading__skeleton-info">
            <div class="photo-detail-loading__skeleton-line"></div>
            <div class="photo-detail-loading__skeleton-line photo-detail-loading__skeleton-line--short"></div>
            <div class="photo-detail-loading__skeleton-line"></div>
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="photo">
      <!-- Breadcrumbs -->
      <section class="photo-detail-breadcrumbs">
        <div class="container">
          <nav aria-label="Навигационная цепочка">
            <ol class="breadcrumbs">
              <li class="breadcrumbs__item">
                <router-link to="/">Главная</router-link>
              </li>
              <li class="breadcrumbs__item">
                <router-link to="/catalog">Каталог</router-link>
              </li>
              <li class="breadcrumbs__item">
                <router-link :to="`/catalog/photos?category=${photo.category}`">
                  {{ photo.category }}
                </router-link>
              </li>
              <li class="breadcrumbs__item breadcrumbs__item--current" aria-current="page">
                {{ photo.title }}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <!-- Hero секция с изображением -->
      <section class="photo-detail-hero">
        <div class="container photo-detail-hero__container">
          <div class="photo-detail-hero__image">
            <div class="photo-detail-hero__image-wrapper">
              <img
                :src="photo.imageUrl"
                :alt="photo.title"
                @click="toggleZoom"
                class="photo-detail-hero__img"
              />
              <button
                class="photo-detail-hero__zoom-btn"
                @click="toggleZoom"
                aria-label="Увеличить изображение"
              >
                🔍
              </button>
            </div>
          </div>

          <div class="photo-detail-hero__info">
            <div class="photo-detail-hero__meta">
              <span class="photo-detail-hero__category">{{ photo.category }}</span>
              <time v-if="photo.uploadedAt" class="photo-detail-hero__date">
                {{ formatDate(photo.uploadedAt) }}
              </time>
            </div>

            <h1 class="photo-detail-hero__title">{{ photo.title }}</h1>

            <div v-if="photo.description" class="photo-detail-hero__description">
              <p>{{ photo.description }}</p>
            </div>

            <!-- Автор -->
            <div class="photo-detail-hero__author">
              <div v-if="photo.author.avatarUrl" class="photo-detail-hero__author-avatar">
                <img :src="photo.author.avatarUrl" :alt="photo.author.name" />
              </div>
              <div class="photo-detail-hero__author-info">
                <span class="photo-detail-hero__author-label">Автор</span>
                <strong class="photo-detail-hero__author-name">{{ photo.author.name }}</strong>
              </div>
            </div>

            <!-- Теги -->
            <div v-if="photo.tags && photo.tags.length > 0" class="photo-detail-hero__tags">
              <span v-for="tag in photo.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>

            <!-- Статистика -->
            <div v-if="photo.views || photo.downloads" class="photo-detail-hero__stats">
              <div v-if="photo.views" class="photo-detail-hero__stat">
                <span class="photo-detail-hero__stat-label">Просмотров:</span>
                <span class="photo-detail-hero__stat-value">{{ photo.views }}</span>
              </div>
              <div v-if="photo.downloads" class="photo-detail-hero__stat">
                <span class="photo-detail-hero__stat-label">Скачиваний:</span>
                <span class="photo-detail-hero__stat-value">{{ photo.downloads }}</span>
              </div>
            </div>

            <!-- Размеры -->
            <div v-if="photo.dimensions" class="photo-detail-hero__dimensions">
              <span class="photo-detail-hero__dimensions-label">Размер:</span>
              <span class="photo-detail-hero__dimensions-value">
                {{ photo.dimensions.width }} × {{ photo.dimensions.height }} px
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Лицензии и покупка -->
      <section class="photo-detail-licenses">
        <div class="container photo-detail-licenses__container">
          <div class="photo-detail-licenses__content">
            <LicenseSelector
              v-model="selectedLicenseId"
              :licenses="photo.licenseTypes"
            />

            <div class="photo-detail-licenses__actions">
              <button class="btn btn--primary photo-detail-licenses__buy" @click="handleBuy">
                Купить за ₽{{ totalPrice.toLocaleString() }}
              </button>
              <button
                class="btn btn--ghost photo-detail-licenses__cart"
                @click="handleAddToCart"
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Похожие фото -->
      <SimilarPhotos v-if="similarPhotos.length > 0" :photos="similarPhotos" />
    </template>
  </main>

  <!-- Модальное окно для zoom изображения -->
  <Teleport to="body">
    <div
      v-if="imageZoomed && photo"
      class="photo-zoom-modal"
      @click.self="toggleZoom"
      @keydown.esc.prevent="toggleZoom"
      role="dialog"
      aria-modal="true"
      aria-label="Полноэкранный просмотр изображения"
      tabindex="-1"
    >
      <button
        class="photo-zoom-modal__close"
        @click="toggleZoom"
        aria-label="Закрыть"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div class="photo-zoom-modal__content">
        <img
          :src="photo.imageUrl"
          :alt="photo.title"
          class="photo-zoom-modal__img"
          @click="toggleZoom"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Loading skeleton */
.photo-detail-loading {
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 4rem;
}

.photo-detail-loading__skeleton {
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr 1fr;
}

.photo-detail-loading__skeleton-image {
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.05) 0%,
    rgba(15, 23, 42, 0.1) 50%,
    rgba(15, 23, 42, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 24px;
  animation: shimmer 1.5s infinite;
}

.photo-detail-loading__skeleton-info {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.photo-detail-loading__skeleton-line {
  height: 24px;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.05) 0%,
    rgba(15, 23, 42, 0.1) 50%,
    rgba(15, 23, 42, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.photo-detail-loading__skeleton-line--short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Breadcrumbs */
.photo-detail-breadcrumbs {
  padding-top: calc(var(--header-height) + 1.5rem);
  padding-bottom: 1rem;
  background: radial-gradient(circle at top right, #ecfdf5 0%, #ffffff 55%);
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumbs__item:not(:last-child)::after {
  content: '→';
  color: var(--color-text-muted);
  margin-left: 0.5rem;
}

.breadcrumbs__item a {
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

.breadcrumbs__item a:hover {
  color: var(--color-accent);
}

.breadcrumbs__item--current {
  color: var(--color-text);
  font-weight: 600;
}

/* Hero section */
.photo-detail-hero {
  padding: 3rem 0 4rem;
}

.photo-detail-hero__container {
  display: grid;
  gap: 3rem;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: start;
}

.photo-detail-hero__image {
  position: sticky;
  top: calc(var(--header-height) + 2rem);
}

.photo-detail-hero__image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.05);
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.photo-detail-hero__img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-detail-hero__zoom-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.photo-detail-hero__zoom-btn:hover {
  transform: scale(1.1);
  background: #ffffff;
}

.photo-detail-hero__info {
  display: grid;
  gap: 1.5rem;
}

.photo-detail-hero__meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.photo-detail-hero__category {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.photo-detail-hero__date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.photo-detail-hero__title {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.2;
}

.photo-detail-hero__description {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.photo-detail-hero__description p {
  margin: 0;
}

.photo-detail-hero__author {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.4), rgba(236, 253, 245, 0.2));
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.photo-detail-hero__author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(16, 185, 129, 0.2);
}

.photo-detail-hero__author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-detail-hero__author-info {
  display: grid;
  gap: 0.25rem;
}

.photo-detail-hero__author-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.photo-detail-hero__author-name {
  font-size: 1rem;
  color: var(--color-text);
}

.photo-detail-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.photo-detail-hero__stats {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.photo-detail-hero__stat {
  display: grid;
  gap: 0.25rem;
}

.photo-detail-hero__stat-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.photo-detail-hero__stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.photo-detail-hero__dimensions {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.photo-detail-hero__dimensions-value {
  font-weight: 600;
  color: var(--color-text);
}

/* Licenses section */
.photo-detail-licenses {
  padding: 4rem 0;
  background: radial-gradient(circle at top left, #f5fdf9, #ffffff 55%);
}

.photo-detail-licenses__container {
  max-width: 800px;
}

.photo-detail-licenses__content {
  display: grid;
  gap: 2rem;
}

.photo-detail-licenses__actions {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr auto;
}

.photo-detail-licenses__buy {
  min-width: 200px;
}

.photo-detail-licenses__cart {
  white-space: nowrap;
}

@media (max-width: 1023px) {
  .photo-detail-hero__container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .photo-detail-hero__image {
    position: static;
  }

  .photo-detail-licenses__actions {
    grid-template-columns: 1fr;
  }

  .photo-detail-licenses__buy,
  .photo-detail-licenses__cart {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .photo-detail-hero {
    padding: 2rem 0 3rem;
  }

  .photo-detail-breadcrumbs {
    padding-top: calc(var(--header-height) + 1rem);
  }

  .photo-detail-licenses {
    padding: 3rem 0;
  }

  .photo-detail-hero__stats {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Модальное окно для zoom */
.photo-zoom-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(4px);
  padding: 2rem;
  animation: fadeIn 0.2s ease;
  outline: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.photo-zoom-modal__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.photo-zoom-modal__close:hover {
  background: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.photo-zoom-modal__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-zoom-modal__img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  cursor: zoom-out;
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .photo-zoom-modal {
    padding: 1rem;
  }

  .photo-zoom-modal__close {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
}
</style>

