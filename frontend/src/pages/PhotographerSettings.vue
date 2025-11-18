<script setup lang="ts">
import { ref } from "vue";
import PhotographerLayout from "../components/PhotographerLayout.vue";
import creativePortrait from "../assets/images/creative-portrait-1.jpg";

const name = ref("Марина Колосова");
const email = ref("marina@example.com");
const specialty = ref("Портреты и lifestyle");
const bio = ref(
  "Профессиональный фотограф с 10-летним опытом. Специализируюсь на портретной и lifestyle фотографии."
);
const website = ref("https://marinakolosova.com");
const socialInstagram = ref("@marinakolosova");
const socialVk = ref("marinakolosova");
const avatarUrl = ref(creativePortrait);
const isSaving = ref(false);
const saveSuccess = ref(false);

const notifications = ref({
  newDownload: true,
  newComment: true,
  weeklyReport: false,
  marketing: false,
});

const privacy = ref({
  showEmail: false,
  showStats: true,
  allowMessages: true,
});

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function handleSave(e: Event) {
  e.preventDefault();
  isSaving.value = true;
  saveSuccess.value = false;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err) {
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <PhotographerLayout>
    <div class="settings-page">
      <form @submit="handleSave" class="settings-form">
        <!-- Профиль -->
        <section class="settings-section">
          <h2 class="settings-section__title">Профиль</h2>
          <div class="settings-section__content">
            <div class="avatar-upload">
              <div class="avatar-upload__preview">
                <img :src="avatarUrl" alt="Avatar" />
              </div>
              <div class="avatar-upload__controls">
                <label for="avatar-input" class="btn btn--ghost">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 3L15 7M13 1H16C16.5304 1 17.0391 1.21071 17.4142 1.58579C17.7893 1.96086 18 2.46957 18 3V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H5M11 1L1 11V17H7L17 7V3"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Изменить фото
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  class="avatar-input"
                  @change="handleAvatarChange"
                />
                <p class="avatar-upload__hint">JPG, PNG до 5 МБ</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="name" class="form-label">Имя</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="specialty" class="form-label">Специализация</label>
                <input
                  id="specialty"
                  v-model="specialty"
                  type="text"
                  class="form-input"
                  placeholder="Например: Портреты и lifestyle"
                />
              </div>

              <div class="form-group form-group--full">
                <label for="bio" class="form-label">О себе</label>
                <textarea
                  id="bio"
                  v-model="bio"
                  class="form-input form-input--textarea"
                  rows="4"
                  placeholder="Расскажите о себе..."
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Контакты -->
        <section class="settings-section">
          <h2 class="settings-section__title">Контакты и соцсети</h2>
          <div class="settings-section__content">
            <div class="form-grid">
              <div class="form-group">
                <label for="website" class="form-label">Веб-сайт</label>
                <input
                  id="website"
                  v-model="website"
                  type="url"
                  class="form-input"
                  placeholder="https://example.com"
                />
              </div>

              <div class="form-group">
                <label for="socialInstagram" class="form-label"
                  >Instagram</label
                >
                <input
                  id="socialInstagram"
                  v-model="socialInstagram"
                  type="text"
                  class="form-input"
                  placeholder="@username"
                />
              </div>

              <div class="form-group">
                <label for="socialVk" class="form-label">ВКонтакте</label>
                <input
                  id="socialVk"
                  v-model="socialVk"
                  type="text"
                  class="form-input"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Уведомления -->
        <section class="settings-section">
          <h2 class="settings-section__title">Уведомления</h2>
          <div class="settings-section__content">
            <div class="settings-toggle-list">
              <label class="settings-toggle">
                <input
                  v-model="notifications.newDownload"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label">Новые скачивания</span>
                  <span class="settings-toggle__hint"
                    >Получать уведомления о каждом скачивании</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>

              <label class="settings-toggle">
                <input
                  v-model="notifications.newComment"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label">Новые комментарии</span>
                  <span class="settings-toggle__hint"
                    >Уведомления о комментариях к вашим фотографиям</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>

              <label class="settings-toggle">
                <input
                  v-model="notifications.weeklyReport"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label">Еженедельный отчёт</span>
                  <span class="settings-toggle__hint"
                    >Сводка статистики раз в неделю</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>

              <label class="settings-toggle">
                <input
                  v-model="notifications.marketing"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label"
                    >Маркетинговые рассылки</span
                  >
                  <span class="settings-toggle__hint"
                    >Новости платформы и советы по продвижению</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>
            </div>
          </div>
        </section>

        <!-- Приватность -->
        <section class="settings-section">
          <h2 class="settings-section__title">Приватность</h2>
          <div class="settings-section__content">
            <div class="settings-toggle-list">
              <label class="settings-toggle">
                <input
                  v-model="privacy.showEmail"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label">Показывать email</span>
                  <span class="settings-toggle__hint"
                    >Отображать email в публичном профиле</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>

              <label class="settings-toggle">
                <input
                  v-model="privacy.showStats"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label"
                    >Показывать статистику</span
                  >
                  <span class="settings-toggle__hint"
                    >Публичная статистика просмотров и скачиваний</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>

              <label class="settings-toggle">
                <input
                  v-model="privacy.allowMessages"
                  type="checkbox"
                  class="settings-toggle__input"
                />
                <div class="settings-toggle__content">
                  <span class="settings-toggle__label"
                    >Разрешить сообщения</span
                  >
                  <span class="settings-toggle__hint"
                    >Пользователи могут отправлять вам сообщения</span
                  >
                </div>
                <div class="settings-toggle__switch" />
              </label>
            </div>
          </div>
        </section>

        <!-- Действия -->
        <div class="settings-actions">
          <div v-if="saveSuccess" class="settings-success">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.667 5L7.5 14.167L3.333 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Настройки сохранены</span>
          </div>
          <button type="submit" class="btn btn--primary" :disabled="isSaving">
            <span v-if="isSaving">
              <span class="spinner" />
              Сохранение...
            </span>
            <span v-else>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  </PhotographerLayout>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-page__title {
  margin: 0 0 0.5rem;
  font-family: "Playfair Display", "Inter", serif;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
}

.settings-page__subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1rem;
}

.settings-form {
  max-width: 900px;
}

.settings-section {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
}

.settings-section__title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.settings-section__content {
  display: grid;
  gap: 2rem;
}

.avatar-upload {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.avatar-upload__preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.avatar-upload__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload__controls {
  display: grid;
  gap: 0.5rem;
  flex: 1;
}

.avatar-input {
  display: none;
}

.avatar-upload__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 0.85rem 1.1rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input--textarea {
  resize: vertical;
  min-height: 100px;
}

.settings-toggle-list {
  display: grid;
  gap: 1.5rem;
}

.settings-toggle {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.settings-toggle:hover {
  background: var(--color-surface);
}

.settings-toggle__input {
  display: none;
}

.settings-toggle__content {
  flex: 1;
  display: grid;
  gap: 0.25rem;
}

.settings-toggle__label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
}

.settings-toggle__hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.settings-toggle__switch {
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.2);
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.settings-toggle__switch::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
}

.settings-toggle__input:checked
  + .settings-toggle__content
  + .settings-toggle__switch {
  background: var(--color-accent);
}

.settings-toggle__input:checked
  + .settings-toggle__content
  + .settings-toggle__switch::after {
  transform: translateX(20px);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
}

.settings-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.9rem;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
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

@media (max-width: 768px) {
  .settings-section {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .avatar-upload {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .settings-actions {
    flex-direction: column;
  }

  .settings-actions .btn {
    width: 100%;
  }
}
</style>
