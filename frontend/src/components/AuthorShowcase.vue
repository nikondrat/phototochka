<script setup lang="ts">
import type { AuthorCard } from '../types/showcase'

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
        <article v-for="author in props.authors" :key="author.id" class="authors__card" role="listitem">
          <div class="authors__avatar">
            <img
              v-if="author.avatarUrl"
              :src="author.avatarUrl"
              :alt="author.name"
              loading="lazy"
              decoding="async"
            />
            <span v-else class="authors__avatar-fallback" aria-hidden="true">{{
              author.name.charAt(0).toUpperCase()
            }}</span>
          </div>
          <div class="authors__info">
            <h3 class="authors__name">{{ author.name }}</h3>
            <p class="authors__specialty">{{ author.specialty }}</p>
            <div class="authors__stats">
              <span>{{ author.photosCount }} фото</span>
              <span>Рейтинг {{ author.rating.toFixed(1) }}</span>
            </div>
            <button class="btn btn--ghost authors__cta" type="button">Смотреть профиль</button>
          </div>
        </article>
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
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  padding: 1.75rem;
  display: grid;
  gap: 1.25rem;
}

.authors__avatar {
  inline-size: 80px;
  block-size: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.25);
}

.authors__avatar img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.authors__avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  block-size: 100%;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-accent), #0f172a);
}

.authors__info {
  display: grid;
  gap: 0.65rem;
}

.authors__name {
  margin: 0;
  font-size: 1.2rem;
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
}
</style>




