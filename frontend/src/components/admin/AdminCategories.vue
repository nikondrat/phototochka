<script setup lang="ts">
import { ref } from "vue";
import { categories } from "../../data/homepage";
import AdminIcon from "./AdminIcon.vue";

const allCategories = ref<string[]>([...categories]);
const newCategory = ref("");
const isAdding = ref(false);

function addCategory() {
  if (
    newCategory.value.trim() &&
    !allCategories.value.includes(newCategory.value.trim())
  ) {
    allCategories.value.push(newCategory.value.trim());
    newCategory.value = "";
    isAdding.value = false;
  }
}

function deleteCategory(category: string) {
  if (confirm(`Удалить категорию "${category}"?`)) {
    allCategories.value = allCategories.value.filter((c) => c !== category);
  }
}

const isEditing = ref<string | null>(null);
const editingValue = ref("");

function startEdit(category: string) {
  isEditing.value = category;
  editingValue.value = category;
}

function saveEdit() {
  if (!isEditing.value || !editingValue.value.trim()) return;

  const index = allCategories.value.findIndex((c) => c === isEditing.value);
  if (
    index !== -1 &&
    !allCategories.value.includes(editingValue.value.trim())
  ) {
    allCategories.value[index] = editingValue.value.trim();
  }

  isEditing.value = null;
  editingValue.value = "";
}

function cancelEdit() {
  isEditing.value = null;
  editingValue.value = "";
}
</script>

<template>
  <div class="admin-categories">
    <!-- Header -->
    <div class="admin-categories__header">
      <div>
        <h3 class="admin-categories__title">Управление категориями</h3>
        <p class="admin-categories__subtitle">
          Организуйте контент по категориям для удобной навигации
        </p>
      </div>
      <button
        v-if="!isAdding"
        class="btn btn--primary"
        @click="isAdding = true"
      >
        <AdminIcon name="add" :size="18" />
        Добавить категорию
      </button>
    </div>

    <!-- Add Form -->
    <transition name="slide">
      <div v-if="isAdding" class="admin-categories__add-form">
        <div class="admin-categories__add-input">
          <svg class="admin-categories__add-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18 18l-4.35-4.35"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            v-model="newCategory"
            type="text"
            placeholder="Название категории"
            class="admin-categories__input"
            @keyup.enter="addCategory"
            @keyup.esc="isAdding = false"
            autofocus
          />
        </div>
        <div class="admin-categories__add-actions">
          <button class="btn btn--primary" @click="addCategory">Добавить</button>
          <button class="btn btn--ghost" @click="isAdding = false">Отмена</button>
        </div>
      </div>
    </transition>

    <!-- Stats -->
    <div class="admin-categories__stats">
      Всего категорий: <strong>{{ allCategories.length }}</strong>
    </div>

    <!-- Categories Grid -->
    <div class="admin-categories__grid">
      <div
        v-for="category in allCategories"
        :key="category"
        class="category-card"
      >
        <div v-if="isEditing === category" class="category-card__edit">
          <input
            v-model="editingValue"
            type="text"
            class="admin-categories__edit-input"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            autofocus
          />
          <div class="category-card__actions">
            <button class="btn btn--primary btn--small" @click="saveEdit">
              Сохранить
            </button>
            <button class="btn btn--ghost btn--small" @click="cancelEdit">
              Отмена
            </button>
          </div>
        </div>
        <div v-else class="category-card__content">
          <div class="category-card__header">
            <AdminIcon name="category" class="category-card__icon" :size="20" />
            <span class="category-card__name">{{ category }}</span>
          </div>
          <div class="category-card__actions">
            <button
              class="category-card__action-btn"
              @click="startEdit(category)"
              aria-label="Редактировать"
            >
              <AdminIcon name="edit" :size="18" />
            </button>
            <button
              class="category-card__action-btn category-card__action-btn--danger"
              @click="deleteCategory(category)"
              aria-label="Удалить"
            >
              <AdminIcon name="delete" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allCategories.length === 0" class="admin-empty">
      <AdminIcon name="category" class="admin-empty__icon" :size="48" />
      <p class="admin-empty__text">Категории не найдены</p>
      <p class="admin-empty__hint">Добавьте первую категорию для организации контента</p>
    </div>
  </div>
</template>

<style scoped>
.admin-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-categories__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.admin-categories__title {
  margin: 0 0 0.5rem;
  font-family: "Playfair Display", "Inter", serif;
  font-size: 1.75rem;
  font-weight: 700;
}

.admin-categories__subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-categories__add-form {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-categories__add-input {
  position: relative;
  display: flex;
  align-items: center;
}

.admin-categories__add-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.admin-categories__input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
}

.admin-categories__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.admin-categories__add-actions {
  display: flex;
  gap: 0.75rem;
}

.admin-categories__stats {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.admin-categories__stats strong {
  color: var(--color-text);
  font-weight: 600;
}

.admin-categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.category-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.category-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.category-card__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card__name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text);
}

.category-card__actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.category-card:hover .category-card__actions {
  opacity: 1;
}

.category-card__action-btn {
  width: 36px;
  height: 36px;
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

.category-card__action-btn:hover {
  background: rgba(15, 23, 42, 0.1);
  transform: scale(1.1);
}

.category-card__action-btn--danger {
  color: #ef4444;
}

.category-card__action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.category-card__edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-categories__edit-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
}

.admin-categories__edit-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
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

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .admin-categories__header {
    flex-direction: column;
  }

  .admin-categories__grid {
    grid-template-columns: 1fr;
  }

  .category-card__actions {
    opacity: 1;
  }
}
</style>
