<script setup lang="ts">
import { helpTopics, supportChannels } from '../data/pages'
</script>

<template>
  <main class="page help-page">
    <section class="help-hero" aria-labelledby="help-hero-title" id="faq">
      <div class="container help-hero__grid">
        <div>
          <p class="eyebrow">Центр поддержки</p>
          <h1 id="help-hero-title">Ответы на вопросы покупателей и авторов</h1>
          <p class="help-hero__lead">
            Собрали инструкции по загрузке фотографий, лицензированию, оплатам и юридическим вопросам —
            изучайте гайды или свяжитесь с нами напрямую.
          </p>
          <div class="help-hero__actions">
            <RouterLink class="btn btn--primary" to="/catalog">Перейти в каталог</RouterLink>
            <RouterLink class="btn btn--ghost" to="/help#channels">Написать в поддержку</RouterLink>
          </div>
        </div>
        <div class="help-hero__card">
          <strong>График поддержки</strong>
          <ul>
            <li>Чат: ежедневно 09:00 - 21:00 МСК</li>
            <li>Горячая линия: пн-пт 10:00 - 19:00</li>
            <li>Email — ответ в течение 24 часов</li>
          </ul>
          <RouterLink class="help-hero__link" to="/help#channels">Посмотреть контакты →</RouterLink>
        </div>
      </div>
    </section>

    <section class="help-section" aria-labelledby="help-topics">
      <div class="container help-topics">
        <div class="section-heading">
          <span class="section-heading__eyebrow">FAQ</span>
          <h2 id="help-topics" class="section-heading__title">Типовые ситуации</h2>
          <p class="section-heading__subtitle">
            Ответы на самые частые вопросы покупателей, авторов и юридических команд — всё в одном месте без
            лишних кликов.
          </p>
        </div>
        <div class="faq-grid">
          <article v-for="topic in helpTopics" :key="topic.id" :id="topic.id" class="faq-group">
            <h3>{{ topic.title }}</h3>
            <div class="faq-group__items">
              <div v-for="entry in topic.entries" :key="entry.question" class="faq-item">
                <h4>{{ entry.question }}</h4>
                <p>{{ entry.answer }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="help-section help-section--accent" aria-labelledby="help-support" id="channels">
      <div class="container support-grid">
        <div>
          <span class="section-heading__eyebrow">Поддержка</span>
          <h2 id="help-support" class="section-heading__title">Выберите удобный канал связи</h2>
          <p class="section-heading__subtitle">
            Команда поддержки поможет с лицензиями, контентом, модерацией и техническими вопросами.
          </p>
        </div>
        <div class="support-cards">
          <article v-for="channel in supportChannels" :key="channel.id" class="support-card">
            <h3>{{ channel.title }}</h3>
            <p>{{ channel.description }}</p>
            <div class="support-card__action">
              <span>{{ channel.contactLabel }}</span>
              <strong>{{ channel.contactValue }}</strong>
            </div>
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

.help-hero {
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 3.5rem;
  background: radial-gradient(circle at top right, #ecfdf5 0%, #ffffff 60%);
}

.help-hero__grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
}

.help-hero h1 {
  margin: 0.8rem 0 1.5rem;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(2.3rem, 3.6vw, 3rem);
  line-height: 1.15;
}

.help-hero__lead {
  max-width: 520px;
  color: var(--color-text-muted);
}

.help-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.75rem;
}

.help-hero__card {
  border-radius: 26px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: clamp(2rem, 3.8vw, 2.6rem);
  background: #ffffff;
  box-shadow: 0 24px 52px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1rem;
}

.help-hero__card ul {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-text-muted);
  display: grid;
  gap: 0.45rem;
}

.help-hero__link {
  font-weight: 600;
  color: var(--color-accent);
}

.help-section {
  padding-block: 4rem;
}

.help-topics {
  display: grid;
  gap: 2rem;
}

.faq-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.faq-group {
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 1.75rem 1.85rem;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1.2rem;
}

.faq-group h3 {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
}

.faq-group__items {
  display: grid;
  gap: 1.1rem;
}

.faq-item {
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 0.55rem;
}

.faq-item h4 {
  margin: 0;
  font-size: 1.05rem;
}

.faq-item p {
  margin: 0;
  color: var(--color-text-muted);
}

.help-section--accent {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.88));
  color: #ffffff;
}

.help-section--accent .section-heading__subtitle {
  color: rgba(255, 255, 255, 0.72);
}

.support-grid {
  display: grid;
  gap: 2rem;
}

.support-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.support-card {
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  padding: 1.8rem;
  display: grid;
  gap: 0.9rem;
}

.support-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
}

.support-card__action {
  display: grid;
  gap: 0.4rem;
}

.support-card__action span {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.support-card__action strong {
  font-size: 1.1rem;
}

@media (max-width: 1023px) {
  .help-hero {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .help-hero__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .help-section {
    padding-block: 3rem;
  }

  .faq-group {
    padding: 1.5rem;
  }

  .support-card {
    padding: 1.5rem;
  }
}
</style>

