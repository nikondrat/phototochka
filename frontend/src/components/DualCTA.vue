<template>
  <section class="dual-cta" aria-labelledby="dual-cta-title">
    <div class="container">
      <div class="dual-cta__grid">
        <article class="dual-cta__card">
          <h2 id="dual-cta-title">Начните продавать</h2>
          <p>
            Загружайте фотографии, описывайте лицензии и отслеживайте статистику продаж в личном кабинете
            автора.
          </p>
          <RouterLink class="btn btn--primary" to="/help#authors">Стать автором</RouterLink>
        </article>
        <article class="dual-cta__card dual-cta__card--secondary" aria-labelledby="dual-cta-sub">
          <h2 id="dual-cta-sub">Найдите идеальные фото</h2>
          <p>
            Используйте расширенный поиск и фильтры, чтобы быстро подобрать изображения для проектов и
            презентаций.
          </p>
          <RouterLink class="btn btn--ghost" to="/catalog">Перейти в каталог</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dual-cta__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.dual-cta__card {
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 2.25rem;
  display: grid;
  gap: 0.85rem;
  background: #ffffff;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.dual-cta__card h2 {
  margin: 0;
  font-size: 1.6rem;
  font-family: 'Playfair Display', 'Inter', serif;
}

.dual-cta__card p {
  margin: 0;
  color: var(--color-text-muted);
  max-width: 320px;
}

.dual-cta__card--secondary {
  background: #0f172a;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.12);
}

.dual-cta__card--secondary p {
  color: rgba(255, 255, 255, 0.72);
}

.dual-cta__card--secondary .btn--ghost {
  border-color: #ffffff;
  color: #ffffff;
}

.dual-cta__card--secondary .btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>



