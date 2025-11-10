<script setup lang="ts">
import type { BenefitItem } from '../data/homepage'

interface Props {
  benefits: BenefitItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <section class="benefits" aria-labelledby="benefits-title">
    <div class="container">
      <div class="section-heading">
        <span class="section-heading__eyebrow">Почему ФотоТочка</span>
        <h2 id="benefits-title" class="section-heading__title">Платформа, созданная для обучения</h2>
        <p class="section-heading__subtitle">
          Тестируйте бизнес-процессы, отрабатывайте пользовательские сценарии и демонстрируйте дипломный
          проект с реальными интерфейсами e-commerce.
        </p>
      </div>

      <div class="benefits__grid">
        <article
          v-for="benefit in props.benefits"
          :key="benefit.id"
          class="benefits__card"
        >
          <span class="benefits__number">0{{ benefit.id.split('-')[1] }}</span>
          <h3>{{ benefit.title }}</h3>
          <p>{{ benefit.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefits {
  background: var(--color-surface);
}

.benefits__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.benefits__card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem 1.75rem;
  display: grid;
  gap: 0.85rem;
  position: relative;
  overflow: hidden;
}

.benefits__number {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 2.5rem;
  color: rgba(16, 185, 129, 0.2);
}

.benefits__card h3 {
  margin: 0;
  font-size: 1.25rem;
}

.benefits__card p {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
