<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  categories: string[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
  'category-select': [category: string]
  'orientation-select': [orientation: 'landscape' | 'portrait' | 'square']
}>()

const searchQuery = ref(props.modelValue || '')
const showFilters = ref(false)

function handleSearch() {
  emit('update:modelValue', searchQuery.value)
  emit('search', searchQuery.value)
}

function handleCategoryClick(category: string) {
  emit('category-select', category)
}

function handleOrientationClick(orientation: 'landscape' | 'portrait' | 'square') {
  emit('orientation-select', orientation)
}
</script>

<template>
  <div class="catalog-search">
    <div class="catalog-search__main">
      <div class="catalog-search__input-wrapper">
        <input
          v-model="searchQuery"
          class="catalog-search__input"
          type="search"
          placeholder="Поиск по названию, тегам или автору..."
          aria-label="Поиск фотографий"
          @keyup.enter="handleSearch"
        />
        <button class="catalog-search__button" type="button" @click="handleSearch" aria-label="Искать">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14ZM17 17l-3.5-3.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <button
        class="catalog-search__toggle-filters"
        type="button"
        @click="showFilters = !showFilters"
        :aria-expanded="showFilters"
        aria-label="Показать фильтры"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 4h14M5 9h8M7 14h4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <span>Фильтры</span>
      </button>
    </div>

    <transition name="filters">
      <div v-if="showFilters" class="catalog-search__filters">
        <div class="catalog-search__filter-group">
          <span class="catalog-search__filter-label">Категория</span>
          <div class="catalog-search__filter-chips">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="catalog-search__chip"
              @click="handleCategoryClick(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="catalog-search__filter-group">
          <span class="catalog-search__filter-label">Ориентация</span>
          <div class="catalog-search__filter-chips">
            <button
              type="button"
              class="catalog-search__chip"
              @click="handleOrientationClick('landscape')"
            >
              Горизонтальная
            </button>
            <button
              type="button"
              class="catalog-search__chip"
              @click="handleOrientationClick('portrait')"
            >
              Вертикальная
            </button>
            <button
              type="button"
              class="catalog-search__chip"
              @click="handleOrientationClick('square')"
            >
              Квадратная
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.catalog-search {
  display: grid;
  gap: 1rem;
}

.catalog-search__main {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.catalog-search__input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.catalog-search__input {
  width: 100%;
  padding: 0.875rem 3.5rem 0.875rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.catalog-search__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.catalog-search__input::placeholder {
  color: var(--color-text-muted);
}

.catalog-search__button {
  position: absolute;
  right: 0.5rem;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: var(--color-accent);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.catalog-search__button:hover {
  background: var(--color-accent-dark);
  transform: scale(1.05);
}

.catalog-search__toggle-filters {
  padding: 0.875rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: border-color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}

.catalog-search__toggle-filters:hover {
  border-color: var(--color-accent);
  background: rgba(236, 253, 245, 0.4);
}

.catalog-search__toggle-filters svg {
  flex-shrink: 0;
}

.catalog-search__filters {
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.3), rgba(236, 253, 245, 0.1));
  display: grid;
  gap: 1.25rem;
}

.catalog-search__filter-group {
  display: grid;
  gap: 0.75rem;
}

.catalog-search__filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.catalog-search__filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.catalog-search__chip {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  background: #ffffff;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.catalog-search__chip:hover {
  border-color: var(--color-accent);
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent-dark);
  transform: translateY(-1px);
}

.filters-enter-active,
.filters-leave-active {
  transition: all 0.3s ease;
}

.filters-enter-from,
.filters-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .catalog-search__main {
    flex-direction: column;
  }

  .catalog-search__toggle-filters {
    width: 100%;
    justify-content: center;
  }

  .catalog-search__filters {
    padding: 1.25rem;
  }

  .catalog-search__filter-chips {
    gap: 0.5rem;
  }

  .catalog-search__chip {
    padding: 0.45rem 0.875rem;
    font-size: 0.8rem;
  }
}
</style>

