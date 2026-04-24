<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeroBanner from "../components/HeroBanner.vue";
import SearchFilters from "../components/SearchFilters.vue";
import PhotoCarousel from "../components/PhotoCarousel.vue";
import CategoryGrid from "../components/CategoryGrid.vue";
import AuthorShowcase from "../components/AuthorShowcase.vue";
import BenefitsSection from "../components/BenefitsSection.vue";
import DualCTA from "../components/DualCTA.vue";
import { fetchShowcase } from "../services/showcaseService";
import type { ShowcasePayload } from "../types/showcase";
import { formatApiFormError } from "../utils/apiErrors";

const router = useRouter();

const loadState = ref<"loading" | "ok" | "error">("loading");
const errorMessage = ref("");
const showcase = ref<ShowcasePayload | null>(null);

async function loadShowcase() {
  loadState.value = "loading";
  errorMessage.value = "";
  try {
    showcase.value = await fetchShowcase();
    loadState.value = "ok";
  } catch (e) {
    loadState.value = "error";
    errorMessage.value = formatApiFormError(
      e,
      "Не удалось загрузить данные главной страницы"
    );
  }
}

function retry() {
  void loadShowcase();
}

function onCategorySelect(slug: string) {
  router.push({ path: "/catalog/photos", query: { category: slug } });
}

onMounted(() => {
  void loadShowcase();
});
</script>

<template>
  <main>
    <div
      v-if="loadState === 'loading'"
      class="home-state home-state--loading container"
      aria-busy="true"
    >
      <p>{{ $t('home.loadingShowcase') }}</p>
    </div>

    <div
      v-else-if="loadState === 'error'"
      class="home-state home-state--error container"
      role="alert"
    >
      <p>{{ errorMessage }}</p>
      <button type="button" class="btn btn--primary" @click="retry">
        {{ $t('common.retry') }}
      </button>
    </div>

    <template v-else-if="loadState === 'ok' && showcase">
      <HeroBanner v-if="showcase.heroPhotos.length" :photos="showcase.heroPhotos" />
      <section
        v-else
        class="home-empty-hero container"
        aria-labelledby="empty-hero-title"
      >
        <h1 id="empty-hero-title" class="home-empty-hero__title">
          {{ $t('home.title') }}
        </h1>
        <p class="home-empty-hero__text">
          {{ $t('home.heroText') }}
        </p>
        <RouterLink class="btn btn--primary" to="/catalog">{{ $t('home.catalogBtn') }}</RouterLink>
      </section>

      <SearchFilters
        :categories="showcase.categories"
        @category-select="onCategorySelect"
      />
      <PhotoCarousel
        section-id="catalog"
        :eyebrow="$t('home.newCatalog')"
        :title="$t('home.latestAdditions')"
        :description="$t('home.newCatalogDesc')"
        :photos="showcase.newPhotos"
      />
      <CategoryGrid :categories="showcase.categories" />
      <section class="trust-block">
        <div class="container trust-block__container">
          <div>
            <p class="trust-block__eyebrow">Доверие и качество</p>
            <h2 class="trust-block__title">
              Проверенные авторы и прозрачные лицензии
            </h2>
            <p class="trust-block__text">
              Мы отбираем работы вручную и показываем условия лицензии до покупки, чтобы снизить
              риск возвратов и повысить уверенность покупателя с первого визита.
            </p>
            <div class="trust-block__badges">
              <div class="trust-block__badge">
                <strong>12 400+</strong>
                <span>верифицированных авторов</span>
              </div>
              <div class="trust-block__badge">
                <strong>4,9/5</strong>
                <span>оценка по покупкам и поддержке</span>
              </div>
              <div class="trust-block__badge">
                <strong>99,9%</strong>
                <span>успешных загрузок без ошибок</span>
              </div>
            </div>
          </div>
          <div class="trust-block__panel">
            <p class="trust-block__panel-title">Подтверждение качества</p>
            <ul class="trust-block__list">
              <li>Модерация и чёткие условия лицензии</li>
              <li>Похожие работы под карточкой для снижения отказов</li>
              <li>История просмотров и избранное — без авторизации</li>
            </ul>
          </div>
        </div>
      </section>
      <AuthorShowcase v-if="showcase.authors.length" :authors="showcase.authors" />
      <section class="subscribe-block">
        <div class="container subscribe-block__container">
          <div>
            <p class="subscribe-block__eyebrow">Возвраты и повторные визиты</p>
            <h3 class="subscribe-block__title">
              Получайте подборки свежих работ каждую неделю
            </h3>
            <p class="subscribe-block__text">
              Сохраните фильтры и подпишитесь на обновления, чтобы возвращаться к релевантным
              коллекциям без повторного поиска.
            </p>
            <div class="subscribe-block__chips">
              <span class="chip">Email-дайджест</span>
              <span class="chip">Push-уведомления</span>
              <span class="chip">Сохранённые фильтры</span>
            </div>
          </div>
          <form class="subscribe-block__form" onsubmit="return false;">
            <input type="email" name="email" placeholder="Ваш email" required />
            <button type="submit">Подписаться</button>
            <p class="subscribe-block__hint">
              Можно без регистрации — подтверждение придёт на почту.
            </p>
          </form>
        </div>
      </section>
      <BenefitsSection :benefits="showcase.benefits" />
      <DualCTA />
    </template>
  </main>
  <RouterLink class="floating-cta" to="/catalog">{{ $t('nav.catalog') }}</RouterLink>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-state {
  padding: 3rem 0 2rem;
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
}

.home-state--error {
  color: var(--color-danger);
}

.home-empty-hero {
  padding: calc(var(--header-height) + 2rem) 0 2rem;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.home-empty-hero__title {
  font-family: "Playfair Display", "Inter", serif;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  margin: 0 0 0.75rem;
}

.home-empty-hero__text {
  color: var(--color-text-muted);
  margin: 0 0 1.5rem;
  line-height: 1.5;
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

.trust-block {
  padding: 3.5rem 0;
  background: linear-gradient(180deg, rgba(236, 253, 245, 0.35), #ffffff);
  border-block: 1px solid rgba(15, 23, 42, 0.06);
}

.trust-block__container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  align-items: center;
}

.trust-block__eyebrow {
  margin: 0 0 0.5rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.01em;
}

.trust-block__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.25;
}

.trust-block__text {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
  max-width: 640px;
}

.trust-block__badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.trust-block__badge {
  padding: 1rem 1.1rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.trust-block__badge strong {
  display: block;
  font-size: 1.4rem;
  color: var(--color-text);
}

.trust-block__badge span {
  color: var(--color-text-muted);
  font-weight: 500;
}

.trust-block__panel {
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.25);
}

.trust-block__panel-title {
  margin: 0 0 0.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.trust-block__list {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.5rem;
}

.trust-block__list li {
  color: #e2e8f0;
}

.subscribe-block {
  padding: 3rem 0;
  background: #0f172a;
  color: #ffffff;
}

.subscribe-block__container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
  align-items: center;
}

.subscribe-block__eyebrow {
  margin: 0 0 0.5rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.01em;
}

.subscribe-block__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
}

.subscribe-block__text {
  margin: 0 0 1rem;
  color: #cbd5e1;
  max-width: 640px;
}

.subscribe-block__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.28);
  font-weight: 600;
}

.subscribe-block__form {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
  display: grid;
  gap: 0.75rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.subscribe-block__form input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 0.9rem;
  background: #0b1224;
  color: #ffffff;
}

.subscribe-block__form button {
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-weight: 700;
  background: var(--color-accent);
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.subscribe-block__form button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.35);
}

.subscribe-block__hint {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .floating-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .trust-block__container,
  .subscribe-block__container {
    grid-template-columns: 1fr;
  }

  .trust-block__panel {
    order: 2;
  }
}
</style>
