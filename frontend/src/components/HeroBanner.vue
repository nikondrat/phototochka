<script setup lang="ts">
import type { PhotoCard } from '../data/homepage'

interface Props {
  photos: PhotoCard[]
}

const props = defineProps<Props>()
</script>

<template>
  <section class="hero" aria-labelledby="hero-heading">
    <div class="container">
      <div class="hero__grid">
        <div class="hero__copy">
          <p class="hero__eyebrow">Маркетплейс цифровых фотографий</p>
          <h1 id="hero-heading" class="hero__title">Создавайте. Делитесь. Вдохновляйте.</h1>
          <p class="hero__subtitle">
            «ФотоТочка» объединяет фотографов и дизайнеров. Исследуйте коллекции, находите идеальные
            кадры и делитесь своим творчеством в безопасной среде.
          </p>
          <div class="hero__actions">
            <RouterLink class="btn btn--primary" to="/catalog">Открыть каталог</RouterLink>
            <RouterLink class="btn btn--ghost" to="/help#authors">Присоединиться как автор</RouterLink>
          </div>
          <div class="hero__tags" role="list">
            <span class="tag" role="listitem">#цифровая_фотография</span>
            <span class="tag" role="listitem">#лицензии</span>
            <span class="tag" role="listitem">#портфолио</span>
          </div>
        </div>
        <div class="hero__gallery" aria-label="Популярные фотографии">
          <div
            v-for="photo in props.photos"
            :key="photo.id"
            class="hero__card"
            :class="[`hero__card--${photo.orientation}`]"
          >
            <img
              :src="photo.imageUrl"
              :alt="photo.title"
              loading="lazy"
              decoding="async"
            />
            <div class="hero__card-info">
              <span>{{ photo.category }}</span>
              <strong>{{ photo.title }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: calc(var(--header-height) + 3.5rem);
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: 3rem;
}

.hero__eyebrow {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.hero__title {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2.5rem, 4vw, 3.75rem);
  line-height: 1.1;
  margin: 0.5rem 0 1.5rem;
}

.hero__subtitle {
  max-width: 540px;
  color: var(--color-text-muted);
  margin-bottom: 2.25rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__gallery {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 220px;
}

.hero__card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.hero__card img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.hero__card-info {
  position: absolute;
  inset: auto 16px 16px 16px;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(4px);
  display: grid;
  gap: 0.35rem;
  font-size: 0.85rem;
}

.hero__card-info strong {
  font-size: 0.95rem;
}

.hero__card--portrait {
  grid-row: span 2;
}

.hero__card--landscape {
  grid-row: span 1;
}

@media (max-width: 1023px) {
  .hero {
    padding-top: calc(var(--header-height) + 2.5rem);
  }

  .hero__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .hero__subtitle {
    max-width: none;
  }

  .hero__gallery {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;
    order: -1;
  }
}

@media (max-width: 640px) {
  .hero__gallery {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 180px;
  }

  .hero__card--portrait {
    grid-row: span 1;
  }

  .hero__card-info {
    font-size: 0.8rem;
  }
}
</style>
