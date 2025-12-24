<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import PhotographerLayout from "../components/PhotographerLayout.vue";

const router = useRouter();

const title = ref("");
const category = ref("");
const tags = ref("");
const price = ref("");
const description = ref("");
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);
const error = ref("");

const categories = [
  "Природа",
  "Животные",
  "Люди",
  "Город",
  "Еда и напитки",
  "Технологии",
  "Абстракции",
  "Ландшафты",
  "Лайфстайл",
];

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removeFile() {
  selectedFile.value = null;
  previewUrl.value = null;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = "";

  if (!title.value || !category.value || !selectedFile.value) {
    error.value = "Заполните все обязательные поля";
    return;
  }

  isUploading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/photographer/photos");
  } catch (err) {
    error.value = "Ошибка при загрузке фотографии. Попробуйте позже.";
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <PhotographerLayout>
    <div class="upload-page">
      <div class="upload-page__header">
        <RouterLink to="/photographer/photos" class="btn btn--ghost">
          ← Назад к фотографиям
        </RouterLink>
      </div>

      <form @submit="handleSubmit" class="upload-form">
        <div v-if="error" class="upload-error" role="alert">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

        <div class="upload-form__grid">
          <!-- Загрузка файла -->
          <div class="upload-section">
            <h2 class="upload-section__title">Фотография</h2>
            <div v-if="!previewUrl" class="upload-area">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                class="upload-input"
                @change="handleFileSelect"
              />
              <label for="file-input" class="upload-label">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="upload-label__text"
                  >Перетащите файл сюда или нажмите для выбора</span
                >
                <span class="upload-label__hint">JPG, PNG до 10 МБ</span>
              </label>
            </div>
            <div v-else class="upload-preview">
              <img :src="previewUrl" alt="Preview" />
              <button
                type="button"
                class="upload-preview__remove"
                @click="removeFile"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <p class="upload-preview__filename">{{ selectedFile?.name }}</p>
            </div>
          </div>

          <!-- Информация о фотографии -->
          <div class="upload-section">
            <h2 class="upload-section__title">Информация</h2>
            <div class="form-group">
              <label for="title" class="form-label">
                Название <span class="form-label__required">*</span>
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                class="form-input"
                placeholder="Введите название фотографии"
                required
              />
            </div>

            <div class="form-group">
              <label for="category" class="form-label">
                Категория <span class="form-label__required">*</span>
              </label>
              <select
                id="category"
                v-model="category"
                class="form-input"
                required
              >
                <option value="">Выберите категорию</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="tags" class="form-label">Теги</label>
              <input
                id="tags"
                v-model="tags"
                type="text"
                class="form-input"
                placeholder="тег1, тег2, тег3"
              />
              <p class="form-hint">Разделяйте теги запятыми</p>
            </div>

            <div class="form-group">
              <label for="price" class="form-label">Цена (₽)</label>
              <input
                id="price"
                v-model="price"
                type="number"
                class="form-input"
                placeholder="300"
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Описание</label>
              <textarea
                id="description"
                v-model="description"
                class="form-input form-input--textarea"
                rows="4"
                placeholder="Расскажите о фотографии..."
              />
            </div>
          </div>
        </div>

        <div class="upload-form__actions">
          <button
            type="button"
            class="btn btn--ghost"
            @click="router.push('/photographer/photos')"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            :disabled="isUploading || !selectedFile"
          >
            <span v-if="isUploading">
              <span class="spinner" />
              Загрузка...
            </span>
            <span v-else>Загрузить фотографию</span>
          </button>
        </div>
      </form>
    </div>
  </PhotographerLayout>
</template>

<style scoped>
.upload-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-page__header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

.upload-form {
  max-width: 1000px;
}

.upload-error {
  padding: 1rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: var(--color-danger);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.upload-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.upload-section {
  display: grid;
  gap: 1.5rem;
}

.upload-section__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.upload-area {
  position: relative;
}

.upload-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  border: 2px dashed rgba(15, 23, 42, 0.2);
  border-radius: 16px;
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-label:hover {
  border-color: var(--color-accent);
  background: rgba(16, 185, 129, 0.05);
}

.upload-label svg {
  color: var(--color-accent);
}

.upload-label__text {
  font-weight: 600;
  color: var(--color-text);
}

.upload-label__hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.upload-preview {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.upload-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.upload-preview__remove {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: var(--color-danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.upload-preview__remove:hover {
  background: #ffffff;
}

.upload-preview__filename {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 0.85rem;
  margin: 0;
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

.form-label__required {
  color: var(--color-danger);
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

.form-hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.upload-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
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
  .upload-page__header {
    flex-direction: column;
  }

  .upload-form__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .upload-form__actions {
    flex-direction: column-reverse;
  }

  .upload-form__actions .btn {
    width: 100%;
  }
}
</style>
