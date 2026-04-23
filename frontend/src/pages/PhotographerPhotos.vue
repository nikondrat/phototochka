<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PhotographerLayout from '../components/PhotographerLayout.vue'
import AdminIcon from '../components/admin/AdminIcon.vue'
import PhotoCard from '../components/PhotoCard.vue'
import {
  fetchAuthorPhotos,
  mapAuthorPhotoToCard,
} from '../services/authorPhotoService'

type Row = ReturnType<typeof mapAuthorPhotoToCard>

const loadState = ref<'loading' | 'ok' | 'error'>('loading')
const loadError = ref('')
const photos = ref<Row[]>([])

const searchQuery = ref('')

async function load() {
  loadState.value = 'loading'
  loadError.value = ''
  try {
    const raw = await fetchAuthorPhotos()
    photos.value = raw.map((p) => mapAuthorPhotoToCard(p))
    loadState.value = 'ok'
  } catch {
    loadState.value = 'error'
    loadError.value = 'Не удалось загрузить фотографии. Войдите как автор и попробуйте снова.'
  }
}

onMounted(() => {
  void load()
})

const filteredPhotos = computed(() => {
  let result = photos.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (photo) =>
        photo.title.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query) ||
        (photo.tags || []).some((tag) => tag.toLowerCase().includes(query))
    )
  }
  return result
})

function deletePhoto(_id: string) {
  alert('Удаление через API появится в следующей итерации.')
}
</script>

<template>
  <PhotographerLayout>
    <div class="photos-page">
      <p v-if="loadState === 'error'" class="photos-page__error" role="alert">
        {{ loadError }}
      </p>

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

      <template v-if="loadState !== 'error'">
        <div class="photos-page__filters">
          <div class="search-box">
            <AdminIcon name="search" :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Поиск по названию, категории или тегам..."
              :disabled="loadState === 'loading'"
            />
          </div>
        </div>

        <p v-if="loadState === 'loading'" class="photos-page__muted">Загрузка…</p>
        <div
          v-else-if="filteredPhotos.length > 0"
          class="photos-grid"
        >
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
          <p>Измените поиск или загрузите новую фотографию</p>
          <RouterLink to="/photographer/photos/upload" class="btn btn--primary">
            Загрузить фото
          </RouterLink>
        </div>
      </template>
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

.photos-page__error {
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.08);
  color: var(--color-danger, #b91c1c);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.photos-page__muted {
  margin: 0;
  color: var(--color-text-muted);
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

