<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { auth } from "../utils/auth";
import { formatApiFormError } from "../utils/apiErrors";
import creativePortrait from "../assets/images/creative-portrait-1.jpg";
import { Eye, EyeOff, Mail, Lock } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const identifier = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");
const showPassword = ref(false);

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = "";
  isLoading.value = true;

  if (!identifier.value.trim() || !password.value) {
    error.value = "Пожалуйста, заполните все поля";
    isLoading.value = false;
    return;
  }

  try {
    await auth.login(identifier.value.trim(), password.value);

    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (err) {
    error.value = formatApiFormError(
      err,
      "Неверный email, имя пользователя или пароль"
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-layout">
      <!-- Визуальная панель -->
      <div class="auth-visual">
        <div class="auth-visual__overlay" />
        <div class="auth-visual__content">
          <RouterLink to="/" class="auth-visual__logo">
            <span class="auth-visual__logo-dot" />ФотоТочка
          </RouterLink>
          <div class="auth-visual__quote">
            <p class="auth-visual__quote-text">
              «Каждая фотография — это история, которую стоит рассказать»
            </p>
            <p class="auth-visual__quote-author">— Сообщество ФотоТочки</p>
          </div>
        </div>
        <img
          :src="creativePortrait"
          alt="Творческий портрет"
          class="auth-visual__image"
          loading="eager"
        />
      </div>

      <!-- Форма -->
      <div class="auth-form-panel">
        <div class="auth-form-container">
          <div class="auth-header">
            <h1 class="auth-title">Добро пожаловать</h1>
            <p class="auth-subtitle">
              Войдите в свой аккаунт, чтобы продолжить работу с платформой
            </p>
          </div>

          <form @submit="handleSubmit" class="auth-form">
            <div v-if="error" class="auth-error" role="alert">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6024 1.66666 10 1.66666C5.39762 1.66666 1.66666 5.39762 1.66666 9.99999C1.66666 14.6024 5.39762 18.3333 10 18.3333Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 6.66666V10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 13.3333H10.0083"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ error }}</span>
            </div>

            <div class="form-group">
              <label for="login-identifier" class="form-label"
                >Email или имя пользователя</label
              >
              <div class="form-input-wrapper">
                <Mail class="form-input-icon" :size="20" />
                <input
                  id="login-identifier"
                  v-model="identifier"
                  type="text"
                  class="form-input"
                  placeholder="you@example.com или nickname"
                  required
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Пароль</label>
              <div class="form-input-wrapper">
                <Lock class="form-input-icon" :size="20" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Введите пароль"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="form-toggle-password"
                  @click="showPassword = !showPassword"
                  :aria-label="
                    showPassword ? 'Скрыть пароль' : 'Показать пароль'
                  "
                >
                  <Eye v-if="showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn--primary auth-submit"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="auth-submit__loading">
                  <span class="auth-submit__spinner" />
                  Вход...
                </span>
                <span v-else>Войти в аккаунт</span>
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p class="auth-footer__text">
              Нет аккаунта?
              <RouterLink to="/register" class="auth-link"
                >Создать аккаунт</RouterLink
              >
            </p>
            <RouterLink to="/help" class="auth-link auth-link--muted">
              Забыли пароль?
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  background: var(--color-auth-page-bg);
}

.auth-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-height: 100vh;
}

/* Визуальная панель */
.auth-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-auth-visual-start) 0%,
    var(--color-auth-visual-end) 100%
  );
  overflow: hidden;
}

.auth-visual__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.auth-visual__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--color-auth-overlay-start) 0%,
    var(--color-auth-overlay-mid) 50%,
    var(--color-auth-overlay-end) 100%
  );
  z-index: 1;
}

.auth-visual__content {
  position: relative;
  z-index: 2;
  padding: 3rem;
  max-width: 500px;
  color: var(--color-auth-on-visual);
}

.auth-visual__logo {
  font-family: "Playfair Display", "Inter", serif;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 4rem;
  color: var(--color-auth-on-visual);
}

.auth-visual__logo-dot {
  inline-size: 20px;
  block-size: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 24px var(--color-auth-logo-glow);
}

.auth-visual__quote {
  display: grid;
  gap: 1.5rem;
}

.auth-visual__quote-text {
  font-family: "Playfair Display", "Inter", serif;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  color: var(--color-auth-on-visual);
}

.auth-visual__quote-author {
  font-size: 1rem;
  color: var(--color-auth-on-visual-muted);
  margin: 0;
  font-style: italic;
}

/* Панель формы */
.auth-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(
    180deg,
    var(--color-auth-form-panel-top) 0%,
    var(--color-auth-form-panel-mid) 30%,
    var(--color-auth-form-panel-top) 100%
  );
  overflow-y: auto;
}

.auth-form-container {
  width: 100%;
  max-width: 440px;
  display: grid;
  gap: 2.5rem;
}

.auth-header {
  display: grid;
  gap: 0.75rem;
}

.auth-title {
  margin: 0;
  font-family: "Playfair Display", "Inter", serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}

.auth-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.5;
}

.auth-form {
  display: grid;
  gap: 1.75rem;
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--color-auth-error-surface);
  border: 1px solid var(--color-auth-error-border);
  border-radius: var(--radius-auth-card);
  color: var(--color-danger);
  font-size: 0.9rem;
  line-height: 1.4;
}

.auth-error svg {
  flex-shrink: 0;
}

.form-group {
  display: grid;
  gap: 0.65rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input-icon {
  position: absolute;
  left: 1.1rem;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 1rem 1.1rem 1rem 3.25rem;
  border: 1.5px solid var(--color-auth-form-input-border);
  border-radius: var(--radius-auth-card);
  font-size: 0.95rem;
  font-family: inherit;
  background: var(--color-auth-form-input-surface);
  transition: all 0.2s ease;
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-auth-form-input-focus-shadow);
  background: var(--color-auth-form-input-surface);
}

.form-input:focus + .form-toggle-password,
.form-input:focus ~ .form-toggle-password {
  color: var(--color-accent);
}

.form-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.form-toggle-password {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 2;
}

.form-toggle-password:hover {
  color: var(--color-text);
}

.form-actions {
  margin-top: 0.5rem;
}

.auth-submit {
  width: 100%;
  padding: 1.1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
}

.auth-submit__loading {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.auth-submit__spinner {
  inline-size: 16px;
  block-size: 16px;
  border: 2px solid var(--color-auth-spinner-ring);
  border-top-color: var(--color-auth-spinner-edge);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  display: grid;
  gap: 1rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-auth-footer-divider);
}

.auth-footer__text {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.auth-link {
  color: var(--color-accent);
  font-weight: 600;
  transition: color 0.2s ease;
  text-decoration: none;
}

.auth-link:hover {
  color: var(--color-accent-dark);
  text-decoration: underline;
}

.auth-link--muted {
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.9rem;
}

.auth-link--muted:hover {
  color: var(--color-text);
  text-decoration: underline;
}

/* Адаптивность */
@media (max-width: 1023px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-visual {
    display: none;
  }

  .auth-form-panel {
    padding: 2rem 1.5rem;
    min-height: 100vh;
  }
}

@media (max-width: 640px) {
  .auth-form-container {
    gap: 2rem;
  }

  .auth-form {
    gap: 1.5rem;
  }

  .form-input {
    padding: 0.9rem 1rem 0.9rem 3rem;
  }

  .form-input-icon {
    left: 1rem;
  }
}
</style>
