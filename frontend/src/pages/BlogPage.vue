<script setup lang="ts">
import { blogPosts, blogSpotlight } from '../data/pages'
</script>

<template>
  <main class="page blog-page">
    <section class="blog-hero" aria-labelledby="blog-hero-title" id="guides">
      <div class="container blog-hero__grid">
        <div>
          <p class="eyebrow">Блог ФотоТочки</p>
          <h1 id="blog-hero-title">Исследования, тренды и практики для авторов и брендов</h1>
          <p class="blog-hero__lead">
            Делимся аналитикой рынка цифровой фотографии, примерами сторителлинга и инструкциями по
            работе с платформой.
          </p>
          <div class="blog-hero__meta">
            <span>Еженедельные обновления</span>
            <span>Авторские рубрики и подборки</span>
          </div>
        </div>
        <article class="spotlight">
          <img
            :src="blogSpotlight.imageUrl"
            :alt="blogSpotlight.title"
            loading="lazy"
            decoding="async"
          />
          <div class="spotlight__body">
            <span class="spotlight__eyebrow">Исследование</span>
            <h2>{{ blogSpotlight.title }}</h2>
            <p>{{ blogSpotlight.description }}</p>
            <RouterLink class="spotlight__link" to="/blog?post=color-theory#trends">
              {{ blogSpotlight.linkLabel }} →
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section class="blog-section" aria-labelledby="blog-trends" id="trends">
      <div class="container">
        <div class="section-heading">
          <span class="section-heading__eyebrow">Новые материалы</span>
          <h2 id="blog-trends" class="section-heading__title">Свежие статьи и обзоры</h2>
          <p class="section-heading__subtitle">
            Обновляем рубрики «Индустрия», «Практика», «Авторам» — следите за подборками трендов и
            живыми кейсами от наших авторов.
          </p>
        </div>
        <div class="blog-list">
          <article v-for="post in blogPosts" :key="post.id" class="blog-card">
            <div class="blog-card__meta">
              <span>{{ post.category }}</span>
              <span>{{ post.readTime }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <div class="blog-card__footer">
              <span>{{ post.author }}</span>
              <span>{{ post.date }}</span>
            </div>
            <RouterLink class="blog-card__link" :to="`/blog?post=${post.id}`">
              Читать заметку →
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section class="blog-section blog-section--accent" aria-labelledby="blog-collections" id="collections">
      <div class="container blog-collections">
        <div>
          <span class="section-heading__eyebrow">Подборки</span>
          <h2 id="blog-collections" class="section-heading__title">Креативные сценарии и коллекции</h2>
          <p class="section-heading__subtitle">
            Разбираем, как собирать сториборд и moodboard в ФотоТочке: готовые сценарии для старта кампании,
            запусков продуктов и спецпроектов.
          </p>
        </div>
        <ul class="blog-collections__list">
          <li>
            <strong>Onboarding авторов</strong>
            <p>Бриф, чек-лист метаданных, советы по тегированию и доступ к базе релизов.</p>
          </li>
          <li>
            <strong>Гайды по сторителлингу</strong>
            <p>Примеры визуальных серий, структура сюжетов и шаблоны для презентаций.</p>
          </li>
          <li>
            <strong>Коллекции под отрасли</strong>
            <p>Тематические подборки для финтеха, ритейла, edtech и госорганизаций.</p>
          </li>
        </ul>
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

.blog-hero {
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 3.5rem;
  background: radial-gradient(circle at top left, #ecfdf5 0%, #ffffff 55%);
}

.blog-hero__grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
}

.blog-hero h1 {
  margin: 0.85rem 0 1.4rem;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2.3rem, 3.5vw, 3rem);
  line-height: 1.15;
}

.blog-hero__lead {
  max-width: 520px;
  color: var(--color-text-muted);
}

.blog-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.6rem;
  font-weight: 600;
}

.spotlight {
  border-radius: 26px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  display: grid;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.1);
}

.spotlight img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.spotlight__body {
  padding: 1.8rem 2rem 2.1rem;
  display: grid;
  gap: 0.8rem;
}

.spotlight__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 600;
}

.spotlight__body h2 {
  margin: 0;
  font-size: 1.4rem;
}

.spotlight__body p {
  margin: 0;
  color: var(--color-text-muted);
}

.spotlight__link {
  font-weight: 600;
  color: var(--color-accent);
}

.blog-section {
  padding-block: 4rem;
}

.blog-list {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.blog-card {
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #ffffff;
  padding: 1.75rem;
  display: grid;
  gap: 0.85rem;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.blog-card__meta {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.blog-card h3 {
  margin: 0;
  font-size: 1.25rem;
}

.blog-card p {
  margin: 0;
  color: var(--color-text-muted);
}

.blog-card__footer {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.blog-card__link {
  font-weight: 600;
  color: var(--color-accent);
}

.blog-section--accent {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.85));
  color: #ffffff;
}

.blog-collections {
  display: grid;
  gap: 2rem;
}

.blog-collections .section-heading__subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.blog-collections__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.blog-collections__list li {
  padding: 1.6rem 1.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 0.6rem;
}

.blog-collections__list p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
}

@media (max-width: 1023px) {
  .blog-hero {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .blog-hero__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .blog-section {
    padding-block: 3rem;
  }

  .spotlight__body {
    padding: 1.5rem;
  }

  .blog-card {
    padding: 1.5rem;
  }
}
</style>

