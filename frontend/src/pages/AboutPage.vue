<script setup lang="ts">
import { metricHighlights, timeline } from '../data/pages'
</script>

<template>
  <main class="page about-page">
    <section class="about-hero" aria-labelledby="about-hero-title">
      <div class="container about-hero__grid">
        <div>
          <p class="eyebrow">О платформе</p>
          <h1 id="about-hero-title">ФотоТочка — маркетплейс цифровых фотографий нового поколения</h1>
          <p class="about-hero__lead">
            Мы соединяем авторов, бренды и агентства на одной площадке: предоставляем прозрачные лицензии,
            аналитику и инструменты монетизации творчества.
          </p>
          <div class="about-hero__cta">
            <RouterLink class="btn btn--primary" to="/catalog">Исследовать каталог</RouterLink>
            <RouterLink class="btn btn--ghost" to="/help#authors">Стать автором</RouterLink>
          </div>
        </div>
        <div class="about-hero__panel">
          <strong>Манифест ФотоТочки</strong>
          <p>
            Мы строим рынок, где визуальный контент принадлежит создателям, а бренды получают легальные
            изображения с понятными условиями использования.
          </p>
          <ul>
            <li>Прозрачность лицензирования и быстрый документооборот</li>
            <li>Технологии рекомендаций и аналитика спроса</li>
            <li>Сообщество авторов и образовательные программы</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="about-section" aria-labelledby="about-metrics">
      <div class="container metrics">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Метрики</span>
          <h2 id="about-metrics" class="section-heading__title">ФотоТочка в цифрах</h2>
          <p class="section-heading__subtitle">
            Платформа выросла из закрытой беты в международный маркетплейс с локальными сообществами
            авторов и партнёрами по всему миру.
          </p>
        </div>
        <div class="metrics__grid">
          <article v-for="metric in metricHighlights" :key="metric.id" class="metric-card">
            <span class="metric-card__value">{{ metric.value }}</span>
            <h3>{{ metric.label }}</h3>
            <p>{{ metric.caption }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about-section about-section--timeline" aria-labelledby="about-timeline">
      <div class="container">
        <div class="section-heading">
          <span class="section-heading__eyebrow">История</span>
          <h2 id="about-timeline" class="section-heading__title">Ключевые этапы развития</h2>
          <p class="section-heading__subtitle">
            Каждая итерация продукта усиливала сообщество авторов и расширяла возможности покупателей.
          </p>
        </div>
        <ol class="timeline">
          <li v-for="milestone in timeline" :key="milestone.id" class="timeline__item">
            <span class="timeline__period">{{ milestone.period }}</span>
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="about-section about-section--policies" aria-labelledby="about-policies">
      <div class="container policies">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Принципы</span>
          <h2 id="about-policies" class="section-heading__title">Правила и обязательства</h2>
          <p class="section-heading__subtitle">
            ФотоТочка обеспечивает безопасность данных, защищает авторские права и поддерживает принципы
            устойчивого развития.
          </p>
        </div>
        <div class="policies__grid">
          <article class="policy-card" id="policy">
            <h3>Политика конфиденциальности</h3>
            <p>
              Мы храним данные пользователей в зашифрованном виде, используем двухфакторную аутентификацию и
              не передаём информацию третьим лицам без согласия.
            </p>
            <RouterLink class="policy-card__link" to="/help#legal">Подробнее о защите данных →</RouterLink>
          </article>
          <article class="policy-card" id="terms">
            <h3>Пользовательское соглашение</h3>
            <p>
              Регламентирует отношения между авторами, покупателями и платформой: условия размещения,
              лицензирования и выплаты вознаграждений.
            </p>
            <RouterLink class="policy-card__link" to="/help#buyers">Перейти к FAQ →</RouterLink>
          </article>
          <article class="policy-card" id="rights">
            <h3>Правила использования контента</h3>
            <p>
              Покупатели получают права на использование в рамках выбранной лицензии. При нарушении автор
              может инициировать претензию через службу compliance.
            </p>
            <RouterLink class="policy-card__link" to="/help#legal">Сообщить о нарушении →</RouterLink>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.about-hero {
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 3.5rem;
  background: radial-gradient(circle at top left, #ecfdf5 0%, #ffffff 60%);
}

.about-hero__grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: start;
}

.about-hero h1 {
  margin: 0.85rem 0 1.4rem;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2.4rem, 3.8vw, 3.1rem);
  line-height: 1.16;
}

.about-hero__lead {
  max-width: 560px;
  color: var(--color-text-muted);
}

.about-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.75rem;
}

.about-hero__panel {
  border-radius: 28px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: clamp(2.2rem, 4vw, 2.8rem);
  background: #ffffff;
  box-shadow: 0 26px 56px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 1rem;
}

.about-hero__panel ul {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-text-muted);
  display: grid;
  gap: 0.45rem;
}

.about-section {
  padding-block: 4rem;
}

.metrics {
  display: grid;
  gap: 2.2rem;
}

.metrics__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.metric-card {
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 1.9rem;
  background: #ffffff;
  display: grid;
  gap: 0.6rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.metric-card__value {
  font-size: 2rem;
  font-weight: 700;
}

.metric-card h3 {
  margin: 0;
  font-size: 1.05rem;
}

.metric-card p {
  margin: 0;
  color: var(--color-text-muted);
}

.about-section--timeline {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.86));
  color: #ffffff;
}

.about-section--timeline .section-heading__subtitle {
  color: rgba(255, 255, 255, 0.72);
}

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1.75rem;
}

.timeline__item {
  padding: 1.7rem 1.9rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 0.75rem;
}

.timeline__period {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.timeline__item h3 {
  margin: 0;
  font-size: 1.2rem;
}

.timeline__item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.about-section--policies {
  background: radial-gradient(circle at top right, #ecfdf5 0%, #ffffff 55%);
}

.policies {
  display: grid;
  gap: 2rem;
}

.policies__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.policy-card {
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 1.8rem;
  background: #ffffff;
  display: grid;
  gap: 0.75rem;
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
}

.policy-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.policy-card p {
  margin: 0;
  color: var(--color-text-muted);
}

.policy-card__link {
  font-weight: 600;
  color: var(--color-accent);
}

@media (max-width: 1023px) {
  .about-hero {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .about-hero__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .about-section {
    padding-block: 3rem;
  }

  .metric-card {
    padding: 1.6rem;
  }

  .timeline__item {
    padding: 1.5rem;
  }

  .policy-card {
    padding: 1.6rem;
  }
}
</style>

