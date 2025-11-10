<script setup lang="ts">
import { ref } from 'vue'
import type { PhotoCard } from '../data/homepage'

interface Props {
  title: string
  eyebrow?: string
  description?: string
  photos: PhotoCard[]
  sectionId?: string
}

const props = defineProps<Props>()

const scroller = ref<HTMLDivElement | null>(null)

function scroll(direction: 'prev' | 'next') {
  const container = scroller.value
  if (!container) return
  const card = container.querySelector<HTMLElement>('[data-card]')
  const step = card ? card.offsetWidth + 24 : 320
  const delta = direction === 'next' ? step : -step
  container.scrollBy({ left: delta, behavior: 'smooth' })
}
</script>

<template>
  <section :id="props.sectionId" class="carousel">
    <div class="container">
      <div class="carousel__header">
        <div>
          <span v-if="props.eyebrow" class="section-heading__eyebrow">{{ props.eyebrow }}</span>
          <h2 class="section-heading__title">{{ props.title }}</h2>
          <p v-if="props.description" class="section-heading__subtitle">{{ props.description }}</p>
        </div>
        <div class="carousel__controls" aria-hidden="true">
          <button type="button" class="carousel__arrow" @click="scroll('prev')" aria-label="Предыдущие">
            ←
          </button>
          <button type="button" class="carousel__arrow" @click="scroll('next')" aria-label="Следующие">
            →
          </button>
        </div>
      </div>

      <div class="carousel__wrapper">
        <div ref="scroller" class="carousel__scroller" role="list">
          <article
            v-for="photo in props.photos"
            :key="photo.id"
            data-card
            class="carousel__card"
            role="listitem"
          >
            <div class="carousel__image-wrapper">
              <img :src="photo.imageUrl" :alt="photo.title" loading="lazy" decoding="async" />
            </div>
            <div class="carousel__meta">
              <span class="carousel__category">{{ photo.category }}</span>
              <h3 class="carousel__title">{{ photo.title }}</h3>
              <div v-if="photo.tags?.length" class="carousel__tags">
                <span v-for="tag in photo.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.carousel__controls {
  display: inline-flex;
  gap: 0.75rem;
}

.carousel__arrow {
  inline-size: 40px;
  block-size: 40px;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.15);
  background: #ffffff;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.1);
  cursor: pointer;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.carousel__arrow:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent);
}

.carousel__wrapper {
  position: relative;
  margin-inline: calc(-1 * clamp(1rem, 6vw, 2.5rem));
  padding-inline: clamp(1rem, 6vw, 2.5rem);
}

.carousel__wrapper::before,
.carousel__wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(40px, 9vw, 72px);
  pointer-events: none;
  z-index: 5;
}

.carousel__wrapper::before {
  left: clamp(1rem, 6vw, 2.5rem);
  background: linear-gradient(90deg, var(--color-bg) 0%, rgba(255, 255, 255, 0));
}

.carousel__wrapper::after {
  right: clamp(1rem, 6vw, 2.5rem);
  background: linear-gradient(270deg, var(--color-bg) 0%, rgba(255, 255, 255, 0));
}

.carousel__scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(260px, 28vw, 320px);
  gap: 1.5rem;
  overflow-x: auto;
  padding-block: 0.75rem 2.2rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.carousel__scroller::-webkit-scrollbar {
  display: none;
}

.carousel__card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  display: grid;
  scroll-snap-align: start;
}

.carousel__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  background: rgba(15, 23, 42, 0.05);
}

.carousel__image-wrapper img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel__meta {
  padding: 1.25rem 1.5rem 1.5rem;
  display: grid;
  gap: 0.6rem;
}

.carousel__category {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.carousel__title {
  font-size: 1.15rem;
  margin: 0;
}

.carousel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 1023px) {
  .carousel__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .carousel__controls {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  .carousel__wrapper {
    margin-inline: -1.2rem;
    padding-inline: 1.2rem;
  }

  .carousel__wrapper::before,
  .carousel__wrapper::after {
    bottom: 0;
  }

  .carousel__scroller {
    grid-auto-columns: 78vw;
    gap: 1rem;
    padding-block-end: 2.6rem;
  }
}
</style>
