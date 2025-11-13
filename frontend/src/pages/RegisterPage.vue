<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import santoriniSunset from '../assets/images/santorini-sunset.jpg'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

async function handleSubmit(e: Event) {
  e.preventDefault()
  error.value = ''
  isLoading.value = true

  // Валидация
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Пожалуйста, заполните все поля'
    isLoading.value = false
    return
  }

  if (!email.value.includes('@')) {
    error.value = 'Введите корректный email адрес'
    isLoading.value = false
    return
  }

  if (password.value.length < 8) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    isLoading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    isLoading.value = false
    return
  }

  // Имитация регистрации
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Здесь будет реальный API вызов
    // const response = await authApi.register({ name: name.value, email: email.value, password: password.value })
    
    // После успешной регистрации перенаправляем на страницу входа
    router.push('/login')
  } catch (err) {
    error.value = 'Ошибка регистрации. Попробуйте позже'
  } finally {
    isLoading.value = false
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
              «Присоединяйтесь к сообществу творческих профессионалов»
            </p>
            <p class="auth-visual__quote-author">— Начните свой путь сегодня</p>
          </div>
        </div>
        <img
          :src="santoriniSunset"
          alt="Закат на Санторини"
          class="auth-visual__image"
          loading="eager"
        />
      </div>

      <!-- Форма -->
      <div class="auth-form-panel">
        <div class="auth-form-container">
          <div class="auth-header">
            <h1 class="auth-title">Создать аккаунт</h1>
            <p class="auth-subtitle">
              Зарегистрируйтесь, чтобы начать публиковать свои работы и находить идеальные кадры
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
              <label for="name" class="form-label">Имя</label>
              <div class="form-input-wrapper">
                <svg
                  class="form-input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0 18.3333C0 14.6512 2.98477 11.6667 6.66667 11.6667H13.3333C17.0152 11.6667 20 14.6512 20 18.3333V20H0V18.3333Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-input"
                  placeholder="Ваше имя"
                  required
                  autocomplete="name"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email адрес</label>
              <div class="form-input-wrapper">
                <svg
                  class="form-input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 6.66666L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66666M3.33333 15.8333H16.6667C17.5871 15.8333 18.3333 15.0871 18.3333 14.1667V5.83333C18.3333 4.91286 17.5871 4.16666 16.6667 4.16666H3.33333C2.41286 4.16666 1.66666 4.91286 1.66666 5.83333V14.1667C1.66666 15.0871 2.41286 15.8333 3.33333 15.8333Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Пароль</label>
              <div class="form-input-wrapper">
                <svg
                  class="form-input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15.8333 9.16666H4.16666C3.24619 9.16666 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16666 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16666 15.8333 9.16666Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.83333 9.16666V5.83333C5.83333 4.72824 6.27232 3.66842 7.05372 2.88702C7.83512 2.10562 8.89494 1.66666 10 1.66666C11.1051 1.66666 12.1649 2.10562 12.9463 2.88702C13.7277 3.66842 14.1667 4.72824 14.1667 5.83333V9.16666"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Минимум 8 символов"
                  required
                  autocomplete="new-password"
                  minlength="8"
                />
                <button
                  type="button"
                  class="form-toggle-password"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                >
                  <svg
                    v-if="showPassword"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    v-else
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.71 3.16L1.29 1.75L2.98 0.05L4.39 1.46L5.7 2.77C3.94 3.49 2.5 4.62 1.5 6.05C0.5 7.48 0 9.16 0 10.05C0 10.94 0.5 12.62 1.5 14.05C2.5 15.48 3.94 16.61 5.7 17.33L4.39 18.64L2.98 20.05L1.29 18.35L2.71 16.94C1.19 15.92 0 14.35 0 12.55C0 10.75 1.19 9.18 2.71 8.16L2.71 3.16ZM17.29 8.16C18.81 9.18 20 10.75 20 12.55C20 14.35 18.81 15.92 17.29 16.94L18.71 18.35L17.02 20.05L15.61 18.64L14.3 17.33C16.06 16.61 17.5 15.48 18.5 14.05C19.5 12.62 20 10.94 20 10.05C20 9.16 19.5 7.48 18.5 6.05C17.5 4.62 16.06 3.49 14.3 2.77L15.61 1.46L17.02 0.05L18.71 1.75L17.29 3.16V8.16ZM10 6.05C11.66 6.05 13 7.39 13 9.05C13 9.62 12.89 10.16 12.7 10.66L9.34 7.3C9.84 7.11 10.38 7 10.95 7C10.95 6.39 10.66 5.84 10.25 5.43C9.84 5.02 9.29 4.73 8.68 4.73C8.07 4.73 7.52 5.02 7.11 5.43C6.7 5.84 6.41 6.39 6.41 7C6.41 7.61 6.7 8.16 7.11 8.57C7.52 8.98 8.07 9.27 8.68 9.27C9.29 9.27 9.84 8.98 10.25 8.57C10.66 8.16 10.95 7.61 10.95 7H10V6.05Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
              <div class="form-input-wrapper">
                <svg
                  class="form-input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15.8333 9.16666H4.16666C3.24619 9.16666 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16666 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16666 15.8333 9.16666Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.83333 9.16666V5.83333C5.83333 4.72824 6.27232 3.66842 7.05372 2.88702C7.83512 2.10562 8.89494 1.66666 10 1.66666C11.1051 1.66666 12.1649 2.10562 12.9463 2.88702C13.7277 3.66842 14.1667 4.72824 14.1667 5.83333V9.16666"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Повторите пароль"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="form-toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'"
                >
                  <svg
                    v-if="showConfirmPassword"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    v-else
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.71 3.16L1.29 1.75L2.98 0.05L4.39 1.46L5.7 2.77C3.94 3.49 2.5 4.62 1.5 6.05C0.5 7.48 0 9.16 0 10.05C0 10.94 0.5 12.62 1.5 14.05C2.5 15.48 3.94 16.61 5.7 17.33L4.39 18.64L2.98 20.05L1.29 18.35L2.71 16.94C1.19 15.92 0 14.35 0 12.55C0 10.75 1.19 9.18 2.71 8.16L2.71 3.16ZM17.29 8.16C18.81 9.18 20 10.75 20 12.55C20 14.35 18.81 15.92 17.29 16.94L18.71 18.35L17.02 20.05L15.61 18.64L14.3 17.33C16.06 16.61 17.5 15.48 18.5 14.05C19.5 12.62 20 10.94 20 10.05C20 9.16 19.5 7.48 18.5 6.05C17.5 4.62 16.06 3.49 14.3 2.77L15.61 1.46L17.02 0.05L18.71 1.75L17.29 3.16V8.16ZM10 6.05C11.66 6.05 13 7.39 13 9.05C13 9.62 12.89 10.16 12.7 10.66L9.34 7.3C9.84 7.11 10.38 7 10.95 7C10.95 6.39 10.66 5.84 10.25 5.43C9.84 5.02 9.29 4.73 8.68 4.73C8.07 4.73 7.52 5.02 7.11 5.43C6.7 5.84 6.41 6.39 6.41 7C6.41 7.61 6.7 8.16 7.11 8.57C7.52 8.98 8.07 9.27 8.68 9.27C9.29 9.27 9.84 8.98 10.25 8.57C10.66 8.16 10.95 7.61 10.95 7H10V6.05Z"
                      fill="currentColor"
                    />
                  </svg>
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
                  Регистрация...
                </span>
                <span v-else>Создать аккаунт</span>
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p class="auth-footer__text">
              Уже есть аккаунт?
              <RouterLink to="/login" class="auth-link">Войти</RouterLink>
            </p>
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
  background: #ffffff;
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
    rgba(16, 185, 129, 0.15) 0%,
    rgba(15, 23, 42, 0.85) 50%,
    rgba(15, 23, 42, 0.95) 100%
  );
  z-index: 1;
}

.auth-visual__content {
  position: relative;
  z-index: 2;
  padding: 3rem;
  max-width: 500px;
  color: #ffffff;
}

.auth-visual__logo {
  font-family: 'Playfair Display', 'Inter', serif;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 4rem;
  color: #ffffff;
}

.auth-visual__logo-dot {
  inline-size: 20px;
  block-size: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.6);
}

.auth-visual__quote {
  display: grid;
  gap: 1.5rem;
}

.auth-visual__quote-text {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  color: #ffffff;
}

.auth-visual__quote-author {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-style: italic;
}

/* Панель формы */
.auth-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #fafffe 30%, #ffffff 100%);
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
  font-family: 'Playfair Display', 'Inter', serif;
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
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 14px;
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
  border: 1.5px solid rgba(15, 23, 42, 0.12);
  border-radius: 14px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08);
  background: #ffffff;
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
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
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
  border-top: 1px solid rgba(15, 23, 42, 0.08);
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
