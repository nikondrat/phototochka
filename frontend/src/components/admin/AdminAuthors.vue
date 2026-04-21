<script setup lang="ts">
import { ref, computed } from 'vue'
import { authors, type AuthorCard } from '../../data/homepage'
import AdminIcon from './AdminIcon.vue'

const allAuthors = ref<AuthorCard[]>([...authors])
const searchQuery = ref('')

const filteredAuthors = computed(() => {
  if (!searchQuery.value) return allAuthors.value

  const query = searchQuery.value.toLowerCase()
  return allAuthors.value.filter(
    (author) =>
      author.name.toLowerCase().includes(query) ||
      author.specialty.toLowerCase().includes(query)
  )
})

function deleteAuthor(id: string) {
  if (confirm('Удалить этого автора?')) {
    allAuthors.value = allAuthors.value.filter((a) => a.id !== id)
  }
}

const isEditing = ref<string | null>(null)
const editingAuthor = ref<AuthorCard | null>(null)

function startEdit(author: AuthorCard) {
  isEditing.value = author.id
  editingAuthor.value = { ...author }
}

function saveEdit() {
  if (!editingAuthor.value || !isEditing.value) return

  const index = allAuthors.value.findIndex((a) => a.id === isEditing.value)
  if (index !== -1) {
    allAuthors.value[index] = { ...editingAuthor.value }
  }

  isEditing.value = null
  editingAuthor.value = null
}

function cancelEdit() {
  isEditing.value = null
  editingAuthor.value = null
}
</script>

<template>
  <div class="admin-authors">
    <!-- Toolbar -->
    <div class="admin-authors__toolbar">
      <div class="admin-authors__search">
        <svg class="admin-authors__search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          placeholder="Поиск по имени или специализации..."
          class="admin-authors__input"
        />
      </div>
    </div>

    <!-- Stats -->
    <div class="admin-authors__stats">
      <span class="admin-authors__stat">
        Всего: <strong>{{ allAuthors.length }}</strong>
      </span>
      <span class="admin-authors__stat">
        Отображается: <strong>{{ filteredAuthors.length }}</strong>
      </span>
    </div>

    <!-- Authors Grid -->
    <div class="admin-authors__grid">
      <div
        v-for="author in filteredAuthors"
        :key="author.id"
        class="author-card"
      >
        <div class="author-card__header">
          <div class="author-card__avatar">
            <img :src="author.avatarUrl" :alt="author.name" />
          </div>
          <div class="author-card__actions">
            <button
              class="author-card__action-btn"
              @click="startEdit(author)"
              aria-label="Редактировать"
            >
              <AdminIcon name="edit" :size="18" />
            </button>
            <button
              class="author-card__action-btn author-card__action-btn--danger"
              @click="deleteAuthor(author.id)"
              aria-label="Удалить"
            >
              <AdminIcon name="delete" :size="18" />
            </button>
          </div>
        </div>
        <div class="author-card__body">
          <div v-if="isEditing === author.id && editingAuthor" class="author-card__edit">
            <input
              v-model="editingAuthor.name"
              type="text"
              class="admin-input admin-input--small"
              placeholder="Имя"
            />
            <input
              v-model="editingAuthor.specialty"
              type="text"
              class="admin-input admin-input--small"
              placeholder="Специализация"
            />
            <div class="author-card__meta-inputs">
              <input
                v-model.number="editingAuthor.photosCount"
                type="number"
                class="admin-input admin-input--small"
                placeholder="Количество фото"
              />
              <input
                v-model.number="editingAuthor.rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                class="admin-input admin-input--small"
                placeholder="Рейтинг"
              />
            </div>
            <div class="author-card__actions">
              <button class="btn btn--primary btn--small" @click="saveEdit">Сохранить</button>
              <button class="btn btn--ghost btn--small" @click="cancelEdit">Отмена</button>
            </div>
          </div>
          <div v-else>
            <h3 class="author-card__name">{{ author.name }}</h3>
            <p class="author-card__specialty">{{ author.specialty }}</p>
            <div class="author-card__meta">
              <div class="author-card__stat">
                <AdminIcon name="star" :size="16" />
                <span>{{ author.rating || 0 }}</span>
              </div>
              <div class="author-card__stat">
                <AdminIcon name="photo" :size="16" />
                <span>{{ author.photosCount || 0 }} фото</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredAuthors.length === 0" class="admin-empty">
      <AdminIcon name="authors" class="admin-empty__icon" :size="48" />
      <p class="admin-empty__text">Авторы не найдены</p>
      <p class="admin-empty__hint">Попробуйте изменить параметры поиска</p>
    </div>
  </div>
</template>

<style scoped>
.admin-authors {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-authors__toolbar {
  display: flex;
  gap: 1rem;
}

.admin-authors__search {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.admin-authors__search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.admin-authors__input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
}

.admin-authors__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.admin-authors__stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-authors__stat strong {
  color: var(--color-text);
  font-weight: 600;
}

.admin-authors__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.author-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;
  position: relative;
}

.author-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.author-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.author-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.author-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-card__actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.author-card:hover .author-card__actions {
  opacity: 1;
}

.author-card__action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(15, 23, 42, 0.05);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.author-card__action-btn:hover {
  background: rgba(15, 23, 42, 0.1);
  transform: scale(1.1);
}

.author-card__action-btn--danger {
  color: #ef4444;
}

.author-card__action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.author-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.author-card__name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: 'Playfair Display', 'Inter', serif;
}

.author-card__specialty {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.author-card__meta {
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
}

.author-card__stat {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.author-card__stat .admin-icon {
  color: var(--color-accent);
}

.author-card__edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.author-card__meta-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.admin-input--small {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.author-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
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
  .admin-authors__grid {
    grid-template-columns: 1fr;
  }

  .author-card__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-card__actions {
    opacity: 1;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
