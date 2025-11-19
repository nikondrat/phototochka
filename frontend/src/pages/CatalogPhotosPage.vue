<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhotoGrid from '../components/PhotoGrid.vue'
import CatalogSearch from '../components/CatalogSearch.vue'
import type { Photo } from '../data/photos'
import { getPhotos, paramsFromQuery } from '../services/photoService'
import { categories } from '../data/homepage'

const route = useRoute()
const router = useRouter()

const photos = ref<Photo[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const totalPhotos = ref(0)
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const selectedOrientation = ref<'landscape' | 'portrait' | 'square' | null>(null)

const loadTriggerRef = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// Инициализация параметров из URL
function initFromQuery() {
  const params = paramsFromQuery(route.query)
  
  if (params.category) {
    selectedCategory.value = params.category
  }
  
  if (params.search) {
    searchQuery.value = params.search
  }
  
  if (params.orientation) {
    selectedOrientation.value = params.orientation
  }
  
  if (params.page) {
    currentPage.value = params.page
  }
}

// Загрузка фотографий
async function loadPhotos(page: number = 1, append: boolean = false) {
  if (loading.value) return

  loading.value = true

  try {
    const params = {
      category: selectedCategory.value || undefined,
      search: searchQuery.value || undefined,
      orientation: selectedOrientation.value || undefined,
      page,
      limit: 12,
    }

    const response = await getPhotos(params)

    // Используем nextTick для плавного обновления DOM
    await nextTick()

    if (append) {
      photos.value = [...photos.value, ...response.photos]
    } else {
      photos.value = response.photos
      totalPhotos.value = response.total
    }

    hasMore.value = response.hasMore
    currentPage.value = page
  } catch (error) {
    console.error('Ошибка загрузки фотографий:', error)
  } finally {
    loading.value = false
  }
}

// Загрузка следующей страницы
async function loadNextPage() {
  if (hasMore.value && !loading.value) {
    await loadPhotos(currentPage.value + 1, true)
  }
}

// Обработка изменения фильтров
function applyFilters() {
  const query: Record<string, string> = {}
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  
  if (searchQuery.value) {
    query.search = searchQuery.value
  }
  
  if (selectedOrientation.value) {
    query.orientation = selectedOrientation.value
  }

  router.push({ 
    path: '/catalog/photos', 
    query 
  }).then(() => {
    photos.value = []
    currentPage.value = 1
    hasMore.value = true
    loadPhotos(1)
  }).catch(() => {
    // Обработка ошибки навигации
    photos.value = []
    currentPage.value = 1
    hasMore.value = true
    loadPhotos(1)
  })
}

// Обработка выбора категории
function handleCategorySelect(category: string) {
  // Если категория уже выбрана, снимаем выбор, иначе устанавливаем
  if (selectedCategory.value === category) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = category
  }
  applyFilters()
}

// Обработка поиска
function handleSearch(query: string) {
  searchQuery.value = query
  applyFilters()
}

// Обработка выбора ориентации
function handleOrientationSelect(orientation: 'landscape' | 'portrait' | 'square') {
  selectedOrientation.value = selectedOrientation.value === orientation ? null : orientation
  applyFilters()
}

// Настройка Intersection Observer для бесконечного скролла
function setupInfiniteScroll() {
  if (!loadTriggerRef.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !loading.value) {
        loadNextPage()
      }
    },
    {
      rootMargin: '200px',
      threshold: 0.1,
    }
  )

  observer.value.observe(loadTriggerRef.value)
}

// Отслеживание изменений роута
watch(
  () => route.query,
  async () => {
    // Обновляем локальные значения из query параметров
    initFromQuery()
    
    // Плавно обновляем список - сначала очищаем с небольшой задержкой
    const currentPhotos = photos.value.length
    if (currentPhotos > 0) {
      // Добавляем небольшую задержку для плавного исчезновения
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    photos.value = []
    currentPage.value = 1
    hasMore.value = true
    await loadPhotos(1)
    
    // Переустанавливаем бесконечный скролл
    if (observer.value) {
      observer.value.disconnect()
    }
    await nextTick()
    setTimeout(() => {
      setupInfiniteScroll()
    }, 300)
  },
  { immediate: false }
)

onMounted(() => {
  initFromQuery()
  loadPhotos(1)
  
  // Настройка бесконечного скролла после первой загрузки
  setTimeout(() => {
    setupInfiniteScroll()
  }, 500)
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <main class="page catalog-photos-page">
    <section class="catalog-photos-header">
      <div class="container">
        <div class="catalog-photos-header__top">
          <div>
            <h1 class="catalog-photos-header__title">
              {{ selectedCategory ? selectedCategory : 'Каталог фотографий' }}
            </h1>
            <p v-if="totalPhotos > 0" class="catalog-photos-header__count">
              {{ totalPhotos }} {{ totalPhotos === 1 ? 'фотография' : totalPhotos < 5 ? 'фотографии' : 'фотографий' }}
            </p>
          </div>
        </div>

        <CatalogSearch
          v-model="searchQuery"
          :categories="categories"
          @search="handleSearch"
          @category-select="handleCategorySelect"
          @orientation-select="handleOrientationSelect"
        />
      </div>
    </section>

    <section class="catalog-photos-content">
      <div class="container">
          <PhotoGrid :photos="photos" :loading="loading && photos.length === 0" />

        <!-- Индикатор загрузки для следующей страницы -->
        <div v-if="loading && photos.length > 0" class="catalog-photos__loading-more">
          <div class="catalog-photos__spinner"></div>
          <p>Загрузка фотографий...</p>
        </div>

        <!-- Триггер для бесконечного скролла -->
        <div 
          ref="loadTriggerRef" 
          class="catalog-photos__load-trigger"
          v-if="hasMore && !loading"
        ></div>

        <!-- Сообщение об окончании загрузки -->
        <div v-if="!hasMore && photos.length > 0" class="catalog-photos__end">
          <p>Все фотографии загружены</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.catalog-photos-header {
  padding-top: calc(var(--header-height) + 2rem);
  padding-bottom: 2rem;
  background: linear-gradient(180deg, rgba(236, 253, 245, 0.4), #ffffff);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.catalog-photos-header__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.catalog-photos-header__title {
  margin: 0 0 0.5rem;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2rem, 3vw, 2.5rem);
  line-height: 1.2;
  color: var(--color-text);
}

.catalog-photos-header__count {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.catalog-photos-content {
  padding-top: 3rem;
  padding-bottom: 4rem;
}

.catalog-photos__loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  color: var(--color-text-muted);
}

.catalog-photos__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(16, 185, 129, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.catalog-photos__load-trigger {
  height: 1px;
  width: 100%;
}

.catalog-photos__end {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-muted);
}

@media (max-width: 1023px) {
  .catalog-photos-header {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .catalog-photos-header__top {
    flex-direction: column;
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .catalog-photos-content {
    padding-bottom: 3rem;
  }

  .catalog-photos__loading-more,
  .catalog-photos__end {
    padding: 2rem 1.5rem;
  }
}
</style>

