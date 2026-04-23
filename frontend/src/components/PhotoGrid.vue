<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Photo } from '../data/photos'
import PhotoCard from './PhotoCard.vue'

interface Props {
  photos: Photo[]
  loading?: boolean
  favoriteIds?: string[]
}

withDefaults(defineProps<Props>(), {
  loading: false,
  favoriteIds: () => [],
})

const emit = defineEmits<{
  'toggle-favorite': [id: string]
}>()

// Преобразуем Photo в формат для PhotoCard
function toPhotoCardFormat(photo: Photo) {
  return {
    id: photo.id,
    title: photo.title,
    category: photo.category,
    imageUrl: photo.imageUrl,
    imageWebp: photo.imageWebp,
    imageAvif: photo.imageAvif,
    blurHash: photo.blurHash,
    tags: photo.tags,
    views: photo.views,
    downloads: photo.downloads,
  }
}
</script>

<template>
  <div class="photo-grid">
    <div v-if="loading && photos.length === 0" class="photo-grid__loading">
      <div v-for="i in 8" :key="`skeleton-${i}`" class="photo-grid__skeleton">
        <div class="photo-grid__skeleton-image"></div>
        <div class="photo-grid__skeleton-body">
          <div class="photo-grid__skeleton-line"></div>
          <div class="photo-grid__skeleton-line photo-grid__skeleton-line--short"></div>
        </div>
      </div>
    </div>

    <div v-else-if="photos.length === 0" class="photo-grid__empty">
      <p>Фотографии не найдены</p>
    </div>

    <div v-else class="photo-grid__items">
      <RouterLink
        v-for="(photo, index) in photos"
        :key="photo.id"
        :to="`/photo/${photo.id}`"
        class="photo-grid__link"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <PhotoCard
          :photo="toPhotoCardFormat(photo)"
          :show-favorite="true"
          :is-favorite="favoriteIds.includes(photo.id)"
          @toggle-favorite="emit('toggle-favorite', photo.id)"
        />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.photo-grid {
  width: 100%;
}

.photo-grid__items {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  justify-content: center;
}

.photo-grid__link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, opacity 0.3s ease;
  opacity: 1;
  animation: fadeIn 0.4s ease;
}

.photo-grid__link:hover {
  transform: translateY(-4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.photo-grid__loading {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.photo-grid__skeleton {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.photo-grid__skeleton-image {
  aspect-ratio: 16 / 10;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.05) 0%,
    rgba(15, 23, 42, 0.1) 50%,
    rgba(15, 23, 42, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.photo-grid__skeleton-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.photo-grid__skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.05) 0%,
    rgba(15, 23, 42, 0.1) 50%,
    rgba(15, 23, 42, 0.05) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.photo-grid__skeleton-line--short {
  width: 60%;
}

.photo-grid__empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-muted);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 1023px) {
  .photo-grid__items,
  .photo-grid__loading {
    grid-template-columns: repeat(auto-fill, minmax(240px, 300px));
    gap: 1.25rem;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .photo-grid__items,
  .photo-grid__loading {
    grid-template-columns: minmax(280px, 100%);
    gap: 1rem;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .photo-grid__empty {
    padding: 3rem 1.5rem;
  }
}
</style>

