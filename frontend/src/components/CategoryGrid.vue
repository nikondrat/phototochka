<script setup lang="ts">
interface Props {
  categories: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <section class="categories" aria-labelledby="categories-title">
    <div class="container">
      <div class="section-heading">
        <span class="section-heading__eyebrow">Популярные категории</span>
        <h2 id="categories-title" class="section-heading__title">Выберите направление съёмки</h2>
        <p class="section-heading__subtitle">
          Категории помогут быстро найти нужный стиль: от природных пейзажей до технологичных кадров и
          абстракций.
        </p>
      </div>

      <div class="categories__grid">
        <a
          v-for="category in props.categories"
          :key="category"
          class="categories__card"
          href="#catalog"
        >
          <span class="categories__label">{{ category }}</span>
          <span class="categories__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

.categories__card {
  position: relative;
  padding: 1.75rem 1.5rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.categories__card:hover {
  transform: translateY(-6px);
  border-color: var(--color-accent);
  box-shadow: 0 18px 36px rgba(16, 185, 129, 0.18);
}

.categories__label {
  font-size: 1rem;
}

.categories__arrow {
  font-size: 1.2rem;
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .categories__card {
    padding: 1.5rem 1.25rem;
  }
}
</style>


