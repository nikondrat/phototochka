<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryItem } from '../types/showcase'

interface Props {
  categories: CategoryItem[]
}

type QuickFilter = {
  id: string
  label: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'category-select': [slug: string]
  'search': [query: string]
  'orientation-select': [orientation: string]
}>()

const orientationFilters: QuickFilter[] = [
  { id: 'orientation-horizontal', label: 'Горизонтальная' },
  { id: 'orientation-vertical', label: 'Вертикальная' },
  { id: 'orientation-square', label: 'Квадратная' },
]

const extraFilters: QuickFilter[] = [
  { id: 'color', label: 'Цвет' },
  { id: 'size', label: 'Размер' },
  { id: 'license', label: 'Лицензия' },
]

const showAdvanced = ref(false)
const searchQuery = ref('')

function toggleAdvanced() {
  showAdvanced.value = !showAdvanced.value
}

function handleCategoryClick(category: CategoryItem) {
  emit('category-select', category.slug)
}

function handleSearch() {
  emit('search', searchQuery.value)
}

function handleOrientationClick(orientation: string) {
  emit('orientation-select', orientation)
}
</script>

<template>
  <section class="search" aria-labelledby="search-heading">
    <div class="container">
      <div class="search__panel">
        <div class="search__header">
          <div>
            <p class="search__eyebrow">Поиск по каталогу</p>
            <h2 id="search-heading" class="search__title">Найдите идеальный кадр</h2>
            <p class="search__subtitle">
              Используйте быстрый поиск по ключевым словам и категориям или уточняйте параметры в
              расширенном режиме.
            </p>
          </div>
          <button class="search__more" type="button" @click="toggleAdvanced">
            {{ showAdvanced ? 'Скрыть расширенный поиск' : 'Расширенный поиск' }}
          </button>
        </div>

        <div class="search__controls">
          <div class="search__input-wrap">
            <input
              v-model="searchQuery"
              class="search__input"
              type="search"
              placeholder="Введите тему, тег или автора"
              aria-label="Поиск по сайту"
              @keyup.enter="handleSearch"
            />
            <button class="btn btn--primary search__submit" type="button" @click="handleSearch">Искать</button>
          </div>

          <div class="search__filters">
            <div class="search__group" aria-label="Категории">
              <span class="search__group-title">Категории</span>
              <div class="search__chips">
                <button
                  v-for="category in props.categories"
                  :key="category.slug"
                  type="button"
                  class="search__chip"
                  @click="handleCategoryClick(category)"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>

            <transition name="expand">
              <div v-if="showAdvanced" class="search__advanced" aria-label="Расширенный поиск">
                <div class="search__group">
                  <span class="search__group-title">Ориентация</span>
                  <div class="search__chips">
                    <button
                      v-for="item in orientationFilters"
                      :key="item.id"
                      type="button"
                      class="search__chip"
                      @click="handleOrientationClick(item.id)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div class="search__group">
                  <span class="search__group-title">Параметры</span>
                  <div class="search__chips">
                    <button
                      v-for="item in extraFilters"
                      :key="item.id"
                      type="button"
                      class="search__chip"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div class="search__group">
                  <span class="search__group-title">Диапазон цены</span>
                  <div class="search__range">
                    <label>
                      <span>От</span>
                      <input type="number" placeholder="0" min="0" />
                    </label>
                    <label>
                      <span>До</span>
                      <input type="number" placeholder="5000" min="0" />
                    </label>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search {
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
}

.search__panel {
  padding: clamp(2rem, 3vw, 2.75rem);
  border-radius: 28px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: radial-gradient(circle at top left, #f5fdf9, #ffffff 55%);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: clamp(1.5rem, 2.5vw, 2.25rem);
}

.search__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.search__subtitle {
  margin-top: 0.65rem;
  color: var(--color-text-muted);
  max-width: 460px;
}

.search__eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 600;
}

.search__title {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(1.9rem, 2.9vw, 2.5rem);
  margin: 0.35rem 0 0;
}

.search__more {
  border: none;
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-accent);
  font-weight: 600;
  padding: 0.65rem 1.1rem;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.search__more:hover {
  background: rgba(16, 185, 129, 0.18);
  color: var(--color-accent-dark);
}

.search__controls {
  display: grid;
  gap: 1.75rem;
}

.search__input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}

.search__input {
  padding: 1rem 1.3rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 1rem;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.search__input:focus {
  border-color: var(--color-accent);
  outline: 0;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.search__submit {
  padding-inline: 1.75rem;
  white-space: nowrap;
}

.search__filters {
  display: grid;
  gap: 1.5rem;
}

.search__group {
  display: grid;
  gap: 0.75rem;
}

.search__group-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.search__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.search__chip {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  padding: 0.55rem 1.1rem;
  background: rgba(255, 255, 255, 0.92);
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.search__chip:hover {
  border-color: var(--color-accent);
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-accent-dark);
}

.search__advanced {
  display: grid;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
}

.search__range {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.search__range label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.search__range input {
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 1023px) {
  .search__panel {
    padding: 2.25rem;
  }

  .search__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search__input-wrap {
    grid-template-columns: 1fr;
  }

  .search__submit {
    width: 100%;
    justify-self: start;
  }
}

@media (max-width: 640px) {
  .search {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .search__panel {
    padding: 2rem 1.5rem;
  }

  .search__chips {
    gap: 0.5rem;
  }

  .search__chip {
    padding: 0.45rem 0.85rem;
    font-size: 0.85rem;
  }

  .search__more {
    align-self: flex-start;
  }
}
</style>
