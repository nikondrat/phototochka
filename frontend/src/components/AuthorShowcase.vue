<script setup lang="ts">
import type { AuthorCard } from '../types/showcase'
import AuthorAvatar from './common/AuthorAvatar.vue'

interface Props {
  authors: AuthorCard[]
}

const props = defineProps<Props>()
</script>

<template>
  <section class="authors" aria-labelledby="authors-title">
    <div class="container">
      <div class="section-heading">
        <span class="section-heading__eyebrow">Авторы месяца</span>
        <h2 id="authors-title" class="section-heading__title">Откройте новых фотографов</h2>
        <p class="section-heading__subtitle">
          Лучшие авторы получают дополнительное продвижение и делятся своими историями успеха внутри
          сообщества «ФотоТочка».
        </p>
      </div>

      <div class="authors__grid" role="list">
        <RouterLink 
          v-for="author in props.authors" 
          :key="author.id" 
          class="authors__card" 
          role="listitem"
          :to="`/author/@${author.username}`"
        >
          <div class="authors__header">
            <AuthorAvatar 
              :src="author.avatarUrl" 
              :name="author.name" 
              size="lg" 
            />
          </div>
          <div class="authors__info">
            <h3 class="authors__name">{{ author.name }}</h3>
            <p class="authors__specialty">{{ author.specialty }}</p>
            <div class="authors__stats">
              <span>{{ author.photosCount }} фото</span>
              <span>Рейтинг {{ author.rating.toFixed(1) }}</span>
            </div>
            <span class="btn btn--ghost authors__cta">Смотреть профиль</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.authors__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.authors__card {
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
  padding: 1.75rem;
  display: grid;
  gap: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.authors__card:hover {
  transform: translateY(-8px);
  border-color: var(--color-accent);
  box-shadow: 0 24px 48px rgba(16, 185, 129, 0.12);
}

.authors__header {
  display: flex;
  justify-content: flex-start;
}

.authors__info {
  display: grid;
  gap: 0.65rem;
}

.authors__name {
  margin: 0;
  font-size: 1.35rem;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
}

.authors__specialty {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.authors__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.authors__cta {
  justify-self: flex-start;
  margin-top: 0.5rem;
  pointer-events: none; /* Чтобы клик шел по карточке */
}
</style>




