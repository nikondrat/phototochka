<script setup lang="ts">
import HeroBanner from '../components/HeroBanner.vue'
import SearchFilters from '../components/SearchFilters.vue'
import PhotoCarousel from '../components/PhotoCarousel.vue'
import CategoryGrid from '../components/CategoryGrid.vue'
import AuthorShowcase from '../components/AuthorShowcase.vue'
import BenefitsSection from '../components/BenefitsSection.vue'
import DualCTA from '../components/DualCTA.vue'

import {
  popularPhotos,
  newPhotos,
  categories,
  authors,
  benefits,
} from '../data/homepage'
</script>

<template>
  <main>
    <HeroBanner :photos="popularPhotos" />
    <SearchFilters :categories="categories" />
    <PhotoCarousel
      section-id="catalog"
      eyebrow="Новинки каталога"
      title="Последние добавления"
      description="Новые кадры от авторов, загруженные в этом месяце. Следите за обновлениями и сохраняйте понравившиеся работы."
      :photos="newPhotos"
    />
    <CategoryGrid :categories="categories" />
    <AuthorShowcase :authors="authors" />
    <BenefitsSection :benefits="benefits" />
    <DualCTA />
  </main>
  <RouterLink class="floating-cta" to="/catalog">Каталог</RouterLink>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.floating-cta {
  position: fixed;
  inset-inline-end: 1.25rem;
  inset-block-end: 1.25rem;
  padding: 0.85rem 1.4rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.45);
  text-decoration: none;
  transition: transform 0.2s ease;
  display: none;
  z-index: 120;
}

.floating-cta:hover {
  transform: translateY(-2px);
  background: var(--color-accent-dark);
}

@media (max-width: 768px) {
  .floating-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

