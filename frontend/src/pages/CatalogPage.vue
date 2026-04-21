<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import PhotoCard from '../components/PhotoCard.vue'
import { catalogCategories, curatedCollections, workflowSteps } from '../data/pages'

const route = useRoute()
const router = useRouter()

// Маппинг ID категорий на русские названия
const categoryIdToTitle: Record<string, string> = {
  'editorial': 'Редакционные подборки',
  'commercial': 'Коммерческие лицензии',
  'authentic': 'Аутентичные истории',
}

// Обработка query параметров для перенаправления на /catalog/photos
function handleQueryParams() {
  const query = route.query
  
  if (query.focus) {
    // Перенаправляем на страницу каталога с фильтром по категории
    const categoryId = query.focus as string
    const categoryTitle = categoryIdToTitle[categoryId] || categoryId
    router.replace({
      path: '/catalog/photos',
      query: { category: categoryTitle }
    })
    return
  }
  
  if (query.collection) {
    // Перенаправляем на страницу каталога с фильтром по коллекции
    router.replace({
      path: '/catalog/photos',
      query: { collection: query.collection as string }
    })
    return
  }
}

onMounted(() => {
  handleQueryParams()
})

watch(
  () => route.query,
  () => {
    handleQueryParams()
  },
  { immediate: false }
)
</script>

<template>
  <main class="page catalog-page">
    <section class="catalog-hero" aria-labelledby="catalog-hero-title">
      <div class="container catalog-hero__grid">
        <div>
          <p class="eyebrow">Каталог ФотоТочки</p>
          <h1 id="catalog-hero-title">Выбирайте лицензии и коллекции под ваши задачи</h1>
          <p class="catalog-hero__lead">
            От авторских репортажей до коммерческих подборок для брендов. Настраивайте фильтры, выбирайте
            тип лицензии и собирайте сториборды прямо на платформе.
          </p>
          <div class="catalog-hero__tags" role="list">
            <span class="tag" role="listitem">#коммерческие_права</span>
            <span class="tag" role="listitem">#редакционный_контент</span>
            <span class="tag" role="listitem">#коллекции</span>
          </div>
        </div>
        <div class="catalog-hero__card">
          <strong>3 режима лицензирования</strong>
          <ul>
            <li>Коммерческая — для рекламных и продуктовых задач</li>
            <li>Редакционная — для СМИ и сторителлинга</li>
            <li>Расширенная — для out-of-home и масштабных кампаний</li>
          </ul>
          <RouterLink class="btn btn--primary" to="/help#licenses">Сравнить лицензии</RouterLink>
        </div>
      </div>
    </section>

    <section class="catalog-section" aria-labelledby="catalog-categories">
      <div class="container">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Подборки</span>
          <h2 id="catalog-categories" class="section-heading__title">Лицензии и направления</h2>
          <p class="section-heading__subtitle">
            Выберите категорию, чтобы увидеть подборку авторов, примеры использования и чек-лист по
            лицензиям.
          </p>
        </div>

        <div class="catalog-cards">
          <RouterLink
            v-for="category in catalogCategories"
            :key="category.id"
            :to="`/catalog/photos?category=${category.title}`"
            class="catalog-card"
          >
            <div class="catalog-card__image">
              <img :src="category.coverUrl" :alt="category.title" loading="lazy" decoding="async" />
            </div>
            <div class="catalog-card__body">
              <h3>{{ category.title }}</h3>
              <p>{{ category.description }}</p>
              <div class="catalog-card__tags">
                <span v-for="tag in category.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
              <span class="catalog-card__link">Открыть коллекцию →</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="catalog-section" aria-labelledby="catalog-curated" id="collections">
      <div class="container">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Кураторский выбор</span>
          <h2 id="catalog-curated" class="section-heading__title">Коллекции месяца</h2>
          <p class="section-heading__subtitle">
            Команда редакторов еженедельно обновляет подборки под ключевые инфоповоды и тренды.
          </p>
        </div>

        <div class="catalog-collections">
          <RouterLink
            v-for="collection in curatedCollections"
            :key="collection.id"
            :to="`/catalog/photos?collection=${collection.id}`"
            class="collection-card-link"
          >
            <PhotoCard
              :photo="{
                id: collection.id,
                title: collection.title,
                category: `${collection.stats.items} объектов • ${collection.stats.updated}`,
                imageUrl: collection.imageUrl,
                uploadedAt: collection.description,
              }"
              variant="collection"
            />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="catalog-section" aria-labelledby="catalog-workflow">
      <div class="container workflow">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Процесс</span>
          <h2 id="catalog-workflow" class="section-heading__title">Как работает каталог</h2>
          <p class="section-heading__subtitle">
            Авторские работы появляются в выдаче после модерации, поэтому клиенты получают проверенный и
            юридически чистый контент.
          </p>
        </div>
        <ol class="workflow__list">
          <li v-for="step in workflowSteps" :key="step.id" class="workflow__item">
            <span class="workflow__badge">{{ step.title }}</span>
            <p>{{ step.description }}</p>
            <strong>{{ step.highlight }}</strong>
          </li>
        </ol>
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

.catalog-hero {
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 3.5rem;
  background: radial-gradient(circle at top right, #ecfdf5 0%, #ffffff 55%);
}

.catalog-hero__grid {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  align-items: center;
}

.catalog-hero h1 {
  margin: 0.85rem 0 1.35rem;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2.4rem, 3.8vw, 3.1rem);
  line-height: 1.15;
}

.eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 600;
}

.catalog-hero__lead {
  max-width: 540px;
  color: var(--color-text-muted);
}

.catalog-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.catalog-hero__card {
  border-radius: 26px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: clamp(2rem, 4vw, 2.6rem);
  background: #ffffff;
  box-shadow: 0 24px 58px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.1rem;
}

.catalog-hero__card strong {
  font-size: 1.15rem;
}

.catalog-hero__card ul {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-text-muted);
  display: grid;
  gap: 0.5rem;
}

.catalog-section {
  padding-block: 4rem;
}

.catalog-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.catalog-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  height: 100%;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.2);
}

.catalog-card__image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.catalog-card__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.catalog-card:hover .catalog-card__image img {
  transform: scale(1.05);
}

.catalog-card__body {
  padding: 1.6rem 1.75rem 1.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  flex: 1;
}

.catalog-card__body h3 {
  margin: 0;
  font-size: 1.2rem;
}

.catalog-card__body p {
  margin: 0;
  color: var(--color-text-muted);
}

.catalog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.catalog-card__link {
  font-weight: 600;
  color: var(--color-accent);
  margin-top: auto;
}

.catalog-collections {
  display: grid;
  gap: 1.6rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.collection-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.collection-card-link:hover {
  transform: translateY(-4px);
}

.collection-card-link:hover :deep(.photo-card) {
  box-shadow: 0 24px 48px rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.2);
}

.workflow {
  display: grid;
  gap: 2rem;
}

.workflow__list {
  display: grid;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.workflow__item {
  padding: 1.6rem 1.8rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: linear-gradient(180deg, rgba(236, 253, 245, 0.6), #ffffff 55%);
  display: grid;
  gap: 0.75rem;
}

.workflow__badge {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  color: var(--color-accent-dark);
}

.workflow__item p {
  margin: 0;
  color: var(--color-text-muted);
}

.workflow__item strong {
  font-size: 0.95rem;
}

@media (max-width: 1023px) {
  .catalog-hero__grid {
    grid-template-columns: 1fr;
  }

  .catalog-hero {
    padding-top: calc(var(--header-height) + 1.5rem);
  }
}

@media (max-width: 640px) {
  .catalog-section {
    padding-block: 3rem;
  }

  .collection-card__body {
    padding: 1.5rem;
  }

  .workflow__item {
    padding: 1.4rem 1.5rem;
  }
}
</style>

