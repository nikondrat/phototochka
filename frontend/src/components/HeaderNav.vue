<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "../utils/auth";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const panelRef = ref<HTMLDivElement | null>(null);
const route = useRoute();
const router = useRouter();
const userState = ref(auth.getCurrentUser());

type NavLink = {
  label: string;
  to: { name: string };
};

const navLinks: NavLink[] = [
  { label: "Каталог", to: { name: "catalog" } },
  { label: "Блог", to: { name: "blog" } },
  { label: "Помощь", to: { name: "help" } },
  { label: "О проекте", to: { name: "about" } },
];

const currentUser = computed(() => userState.value);
const isAdmin = computed(() => userState.value?.role === "admin");

watch(
  () => route.path,
  () => {
    userState.value = auth.getCurrentUser();
  }
);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function handleScroll() {
  isScrolled.value = window.scrollY > 16;
}

function navigate(link: NavLink) {
  router.push(link.to);
  closeMenu();
}

function handleLogout() {
  auth.logout();
  userState.value = null;
  router.push("/");
  closeMenu();
}

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";

  if (open) {
    nextTick(() => {
      panelRef.value?.focus();
    });
  }
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "";
});
</script>

<template>
  <header
    :class="[
      'header',
      { 'header--scrolled': isScrolled, 'header--menu-open': isMenuOpen },
    ]"
    id="top"
  >
    <div class="container header__content">
      <RouterLink class="header__logo" to="/" @click="closeMenu">
        <span class="header__logo-dot" />ФотоТочка
      </RouterLink>

      <nav class="header__nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          :class="[
            'header__nav-link',
            { 'header__nav-link--active': route.name === link.to.name },
          ]"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <template v-if="currentUser">
          <RouterLink v-if="isAdmin" class="btn btn--ghost" to="/admin"
            >Админка</RouterLink
          >
          <span class="header__user">{{ currentUser.name }}</span>
          <button class="btn btn--ghost" @click="handleLogout">Выйти</button>
        </template>
        <template v-else>
          <RouterLink class="btn btn--ghost" to="/login">Войти</RouterLink>
          <RouterLink class="btn btn--primary" to="/register"
            >Стать автором</RouterLink
          >
        </template>
      </div>

      <button
        class="header__burger"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-navigation"
        aria-label="Открыть меню"
        @click="toggleMenu"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <Teleport to="body">
      <transition name="drawer">
        <div
          v-if="isMenuOpen"
          class="header__mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          @keyup.esc="closeMenu"
        >
          <div class="header__mobile-backdrop" @click="closeMenu" />
          <div ref="panelRef" class="header__mobile-panel" tabindex="-1">
            <div class="header__mobile-hero">
              <div class="header__mobile-brand">
                <span class="header__logo-dot" aria-hidden="true" />
                <div class="header__mobile-copy">
                  <p id="mobile-menu-title" class="header__mobile-title">
                    ФотоТочка
                  </p>
                  <p class="header__mobile-tagline">
                    Маркетплейс цифровых фотографий
                  </p>
                </div>
              </div>
              <button
                class="header__close"
                type="button"
                aria-label="Закрыть меню"
                @click="closeMenu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L14 14"
                    stroke="#0F172A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M14 4L4 14"
                    stroke="#0F172A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            <div class="header__mobile-links">
              <button
                v-for="link in navLinks"
                :key="`mobile-${link.label}`"
                type="button"
                :class="[
                  'header__mobile-link',
                  {
                    'header__mobile-link--active': route.name === link.to.name,
                  },
                ]"
                @click="navigate(link)"
              >
                <span>{{ link.label }}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div class="header__mobile-actions">
              <template v-if="currentUser">
                <RouterLink
                  v-if="isAdmin"
                  class="btn btn--ghost"
                  to="/admin"
                  @click="closeMenu"
                >
                  Админка
                </RouterLink>
                <span class="header__mobile-user">{{ currentUser.name }}</span>
                <button class="btn btn--ghost" @click="handleLogout">
                  Выйти
                </button>
              </template>
              <template v-else>
                <RouterLink
                  class="btn btn--ghost"
                  to="/login"
                  @click="closeMenu"
                  >Войти</RouterLink
                >
                <RouterLink
                  class="btn btn--primary"
                  to="/register"
                  @click="closeMenu"
                >
                  Стать автором
                </RouterLink>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.header--scrolled {
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.header--menu-open {
  border-color: transparent;
  box-shadow: none;
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  gap: 1.5rem;
}

.header__logo {
  font-family: "Playfair Display", "Inter", serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.header__logo-dot {
  inline-size: 16px;
  block-size: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-weight: 500;
}

.header__nav-link {
  position: relative;
  padding: 0.25rem 0;
  color: inherit;
  transition: color 0.2s ease;
}

.header__nav-link::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% - 6px);
  block-size: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.header__nav-link:hover::after,
.header__nav-link--active::after {
  transform: scaleX(1);
}

.header__nav-link--active {
  color: var(--color-accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.55rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.header__burger span {
  display: block;
  inline-size: 24px;
  block-size: 2px;
  background: var(--color-text);
  border-radius: 2px;
}

.header__burger:hover {
  background: rgba(15, 23, 42, 0.12);
}

.header__mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  --nav-padding: clamp(1rem, 7vw, 2.2rem);
  padding-inline: var(--nav-padding);
  padding-block-start: calc(var(--nav-padding) + env(safe-area-inset-top, 0px));
  padding-block-end: var(--nav-padding);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.header__mobile-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(4, 12, 18, 0.82),
    rgba(4, 12, 18, 0.72)
  );
  backdrop-filter: blur(12px);
}

.header__mobile-panel {
  position: relative;
  inline-size: min(420px, 100%);
  max-height: min(
    640px,
    calc(100dvh - var(--nav-padding) * 2 - env(safe-area-inset-top, 0px))
  );
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 32px 60px rgba(15, 23, 42, 0.18);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  outline: none;
}

.header__mobile-panel::-webkit-scrollbar {
  display: none;
}

@supports not (height: 100dvh) {
  .header__mobile-panel {
    max-height: min(
      640px,
      calc(100vh - var(--nav-padding) * 2 - env(safe-area-inset-top, 0px))
    );
  }
}

.header__mobile-hero {
  position: relative;
  background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 68%);
  padding: clamp(2.2rem, 9vw, 2.8rem) clamp(1.8rem, 8vw, 2.6rem)
    clamp(1.8rem, 7vw, 2.3rem);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.header__mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.header__mobile-copy {
  display: grid;
  gap: 0.45rem;
}

.header__mobile-title {
  margin: 0;
  font-family: "Playfair Display", "Inter", serif;
  font-size: clamp(1.6rem, 5.4vw, 1.9rem);
  font-weight: 700;
}

.header__mobile-tagline {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.header__close {
  position: absolute;
  top: clamp(1.6rem, 6vw, 2rem);
  right: clamp(1.6rem, 6vw, 2rem);
  inline-size: 44px;
  block-size: 44px;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.05);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.header__close:hover {
  background: rgba(15, 23, 42, 0.12);
  border-color: rgba(15, 23, 42, 0.2);
}

.header__mobile-links {
  padding: clamp(1.8rem, 6vw, 2.4rem) clamp(1.8rem, 7.5vw, 2.7rem);
  display: grid;
  gap: 1.1rem;
  overflow-y: auto;
}

.header__mobile-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  transition: color 0.2s ease;
  background: transparent;
  border: none;
  padding-inline: 0;
  cursor: pointer;
}

.header__mobile-link span:last-child {
  font-size: 1.2rem;
  opacity: 0.35;
}

.header__mobile-link:hover,
.header__mobile-link--active {
  color: var(--color-accent);
}

.header__mobile-actions {
  padding: clamp(1.6rem, 6vw, 2.4rem);
  display: grid;
  gap: 0.9rem;
  background: linear-gradient(180deg, rgba(236, 253, 245, 0.55), #ffffff 70%);
}

.header__mobile-actions .btn {
  width: 100%;
  justify-content: center;
}

.header__user {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.header__mobile-user {
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  padding: 0.5rem 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.28s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .header__mobile-panel,
.drawer-leave-to .header__mobile-panel {
  transform: translateY(16px);
  opacity: 0;
}

@media (max-width: 1023px) {
  .header__nav,
  .header__actions {
    display: none;
  }

  .header__burger {
    display: inline-flex;
  }
}
</style>
