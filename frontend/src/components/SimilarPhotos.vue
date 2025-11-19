<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Photo } from '../data/photos'

interface Props {
  photos: Photo[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Похожие фотографии',
})

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
  <section v-if="photos.length > 0" class="similar-photos" aria-labelledby="similar-photos-title">
    <div class="container">
      <div class="similar-photos__header">
        <h2 id="similar-photos-title" class="similar-photos__title">{{ title }}</h2>
        <div class="similar-photos__controls" aria-hidden="true">
          <button
            type="button"
            class="similar-photos__arrow"
            @click="scroll('prev')"
            aria-label="Предыдущие"
          >
            ←
          </button>
          <button
            type="button"
            class="similar-photos__arrow"
            @click="scroll('next')"
            aria-label="Следующие"
          >
            →
          </button>
        </div>
      </div>

      <div class="similar-photos__wrapper">
        <div ref="scroller" class="similar-photos__scroller" role="list">
          <RouterLink
            v-for="photo in photos"
            :key="photo.id"
            :to="`/photo/${photo.id}`"
            data-card
            class="similar-photos__card"
            role="listitem"
          >
            <div class="similar-photos__image-wrapper">
              <img
                :src="photo.imageUrl"
                :alt="photo.title"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="similar-photos__meta">
              <span class="similar-photos__category">{{ photo.category }}</span>
              <h3 class="similar-photos__title-small">{{ photo.title }}</h3>
              <div v-if="photo.tags && photo.tags.length > 0" class="similar-photos__tags">
                <span v-for="tag in photo.tags.slice(0, 3)" :key="tag" class="tag">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.similar-photos {
  padding: 4rem 0;
}

.similar-photos__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.similar-photos__title {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(1.9rem, 2.6vw, 2.5rem);
  line-height: 1.2;
}

.similar-photos__controls {
  display: inline-flex;
  gap: 0.75rem;
}

.similar-photos__arrow {
  inline-size: 44px;
  block-size: 44px;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.15);
  background: #ffffff;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.1);
  cursor: pointer;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.similar-photos__arrow:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent);
  background: rgba(236, 253, 245, 0.5);
}

.similar-photos__wrapper {
  position: relative;
  margin-inline: calc(-1 * clamp(1rem, 6vw, 2.5rem));
  padding-inline: clamp(1rem, 6vw, 2.5rem);
}

.similar-photos__wrapper::before,
.similar-photos__wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(40px, 9vw, 72px);
  pointer-events: none;
  z-index: 5;
}

.similar-photos__wrapper::before {
  left: clamp(1rem, 6vw, 2.5rem);
  background: linear-gradient(90deg, var(--color-bg) 0%, rgba(255, 255, 255, 0));
}

.similar-photos__wrapper::after {
  right: clamp(1rem, 6vw, 2.5rem);
  background: linear-gradient(270deg, var(--color-bg) 0%, rgba(255, 255, 255, 0));
}

.similar-photos__scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(280px, 30vw, 360px);
  gap: 1.5rem;
  overflow-x: auto;
  padding-block: 0.75rem 2.2rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.similar-photos__scroller::-webkit-scrollbar {
  display: none;
}

.similar-photos__card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  display: grid;
  scroll-snap-align: start;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.similar-photos__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.2);
}

.similar-photos__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.similar-photos__image-wrapper img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.similar-photos__card:hover .similar-photos__image-wrapper img {
  transform: scale(1.05);
}

.similar-photos__meta {
  padding: 1.25rem 1.5rem 1.5rem;
  display: grid;
  gap: 0.6rem;
}

.similar-photos__category {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.similar-photos__title-small {
  font-size: 1.15rem;
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
}

.similar-photos__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 1023px) {
  .similar-photos {
    padding: 3.5rem 0;
  }

  .similar-photos__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .similar-photos__controls {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  .similar-photos {
    padding: 3rem 0;
  }

  .similar-photos__wrapper {
    margin-inline: -1.2rem;
    padding-inline: 1.2rem;
  }

  .similar-photos__wrapper::before,
  .similar-photos__wrapper::after {
    bottom: 0;
  }

  .similar-photos__scroller {
    grid-auto-columns: 78vw;
    gap: 1rem;
    padding-block-end: 2.6rem;
  }
}
</style>

