<script setup lang="ts">
import { ref, computed } from 'vue'
import { popularPhotos, newPhotos, type PhotoCard } from '../../data/homepage'
import AdminIcon from './AdminIcon.vue'

// Инициализируем данные напрямую
const allPhotos = ref<PhotoCard[]>([...popularPhotos, ...newPhotos])
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const viewMode = ref<'grid' | 'list'>('grid')

const filteredPhotos = computed(() => {
  let filtered = allPhotos.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (photo) =>
        (photo.title || '').toLowerCase().includes(query) ||
        (photo.category || '').toLowerCase().includes(query) ||
        photo.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((photo) => photo.category === selectedCategory.value)
  }

  return filtered
})

const categories = computed(() => {
  const cats = new Set(allPhotos.value.map((p) => p.category))
  return Array.from(cats).sort()
})

function deletePhoto(id: string) {
  if (confirm('Удалить эту фотографию?')) {
    allPhotos.value = allPhotos.value.filter((p) => p.id !== id)
  }
}

const isEditing = ref<string | null>(null)
const editingPhoto = ref<PhotoCard | null>(null)

function startEdit(photo: PhotoCard) {
  isEditing.value = photo.id
  editingPhoto.value = { ...photo }
}

function saveEdit() {
  if (!editingPhoto.value || !isEditing.value) return

  const index = allPhotos.value.findIndex((p) => p.id === isEditing.value)
  if (index !== -1) {
    allPhotos.value[index] = { ...editingPhoto.value }
  }

  isEditing.value = null
  editingPhoto.value = null
}

function cancelEdit() {
  isEditing.value = null
  editingPhoto.value = null
}
</script>

<template>
  <div class="admin-photos">
    <!-- Toolbar -->
    <div class="admin-photos__toolbar">
      <div class="admin-photos__search">
        <svg class="admin-photos__search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18 18l-4.35-4.35"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию, категории, тегам..."
          class="admin-photos__input"
        />
      </div>
      <div class="admin-photos__filters">
        <select v-model="selectedCategory" class="admin-photos__select">
          <option value="all">Все категории</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <div class="admin-photos__view-toggle">
          <button
            :class="['admin-photos__view-btn', { 'admin-photos__view-btn--active': viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
            aria-label="Сетка"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="1" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </button>
          <button
            :class="['admin-photos__view-btn', { 'admin-photos__view-btn--active': viewMode === 'list' }]"
            @click="viewMode = 'list'"
            aria-label="Список"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="16" height="3" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="1" y="7" width="16" height="3" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="1" y="13" width="16" height="3" rx="1" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="admin-photos__stats">
      <span class="admin-photos__stat">
        Всего: <strong>{{ allPhotos.length }}</strong>
      </span>
      <span class="admin-photos__stat">
        Отображается: <strong>{{ filteredPhotos.length }}</strong>
      </span>
    </div>

    <!-- Photos Grid/List -->
    <div
      :class="['admin-photos__container', { 'admin-photos__container--list': viewMode === 'list' }]"
    >
      <div
        v-for="photo in filteredPhotos"
        :key="photo.id"
        :class="['photo-card', { 'photo-card--list': viewMode === 'list' }]"
      >
        <div class="photo-card__image">
          <img :src="photo.imageUrl" :alt="photo.title || 'Фотография'" />
          <div class="photo-card__overlay">
            <button
              class="photo-card__action-btn"
              @click="startEdit(photo)"
              aria-label="Редактировать"
            >
              <AdminIcon name="edit" :size="18" />
            </button>
            <button
              class="photo-card__action-btn photo-card__action-btn--danger"
              @click="deletePhoto(photo.id)"
              aria-label="Удалить"
            >
              <AdminIcon name="delete" :size="18" />
            </button>
          </div>
        </div>
        <div class="photo-card__body">
          <div v-if="isEditing === photo.id && editingPhoto" class="photo-card__edit">
            <input
              v-model="editingPhoto.title"
              type="text"
              class="admin-input admin-input--small"
              placeholder="Название"
            />
            <select v-model="editingPhoto.category" class="admin-select admin-select--small">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <div class="photo-card__actions">
              <button class="btn btn--primary btn--small" @click="saveEdit">Сохранить</button>
              <button class="btn btn--ghost btn--small" @click="cancelEdit">Отмена</button>
            </div>
          </div>
          <div v-else>
            <h3 class="photo-card__title">{{ photo.title || 'Без названия' }}</h3>
            <p class="photo-card__category">{{ photo.category }}</p>
            <div v-if="photo.tags && photo.tags.length > 0" class="photo-card__tags">
              <span v-for="tag in photo.tags" :key="tag" class="tag tag--small">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredPhotos.length === 0" class="admin-empty">
      <AdminIcon name="search" class="admin-empty__icon" :size="48" />
      <p class="admin-empty__text">Фотографии не найдены</p>
      <p class="admin-empty__hint">Попробуйте изменить параметры поиска</p>
    </div>
  </div>
</template>

<style scoped>
.admin-photos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-photos__toolbar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.admin-photos__search {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.admin-photos__search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.admin-photos__input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
}

.admin-photos__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.admin-photos__filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.admin-photos__select {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-photos__select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.admin-photos__view-toggle {
  display: flex;
  gap: 0.25rem;
  background: rgba(15, 23, 42, 0.05);
  padding: 0.25rem;
  border-radius: 10px;
}

.admin-photos__view-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-photos__view-btn:hover {
  background: rgba(15, 23, 42, 0.08);
  color: var(--color-text);
}

.admin-photos__view-btn--active {
  background: #ffffff;
  color: var(--color-accent);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.admin-photos__stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-photos__stat strong {
  color: var(--color-text);
  font-weight: 600;
}

.admin-photos__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.admin-photos__container--list {
  grid-template-columns: 1fr;
}

.photo-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.photo-card--list {
  flex-direction: row;
}

.photo-card__image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.photo-card--list .photo-card__image {
  width: 200px;
  aspect-ratio: 1;
  flex-shrink: 0;
}

.photo-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-card:hover .photo-card__overlay {
  opacity: 1;
}

.photo-card__action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.photo-card__action-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
}

.photo-card__action-btn--danger {
  color: #ef4444;
}

.photo-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.photo-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.photo-card__category {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.photo-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag--small {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.photo-card__edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-input--small,
.admin-select--small {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.photo-card__actions {
  display: flex;
  gap: 0.5rem;
}

.admin-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px dashed rgba(15, 23, 42, 0.2);
}

.admin-empty__icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  opacity: 0.5;
  color: var(--color-text-muted);
}

.admin-empty__text {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.admin-empty__hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .admin-photos__toolbar {
    flex-direction: column;
  }

  .admin-photos__search {
    width: 100%;
  }

  .admin-photos__container {
    grid-template-columns: 1fr;
  }

  .photo-card--list {
    flex-direction: column;
  }

  .photo-card--list .photo-card__image {
    width: 100%;
  }
}
</style>
