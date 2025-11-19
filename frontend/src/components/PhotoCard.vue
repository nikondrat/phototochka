<script setup lang="ts">
import AdminIcon from './admin/AdminIcon.vue'

interface Photo {
  id: string
  title: string
  category: string
  imageUrl: string
  tags?: string[]
  views?: number
  downloads?: number
  earnings?: number
  status?: 'published' | 'pending' | 'draft'
  uploadedAt?: string
}

interface Props {
  photo: Photo
  showActions?: boolean
  showStats?: boolean
  showStatus?: boolean
  variant?: 'default' | 'compact' | 'category' | 'collection'
}

withDefaults(defineProps<Props>(), {
  showActions: false,
  showStats: false,
  showStatus: false,
  variant: 'default',
})

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    published: 'Опубликовано',
    pending: 'На модерации',
    draft: 'Черновик',
  }
  return labels[status] || status
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    published: 'photo-card__status--published',
    pending: 'photo-card__status--pending',
    draft: 'photo-card__status--draft',
  }
  return classes[status] || ''
}
</script>

<template>
  <div :class="['photo-card', `photo-card--${variant}`]">
    <div class="photo-card__image">
      <img :src="photo.imageUrl" :alt="photo.title" />
      <div v-if="showStatus && photo.status" class="photo-card__status-badge">
        <span :class="['photo-card__status', getStatusClass(photo.status)]">
          {{ getStatusLabel(photo.status) }}
        </span>
      </div>
      <div v-if="showActions" class="photo-card__overlay">
        <button
          class="photo-card__action-btn"
          @click="emit('edit', photo.id)"
          aria-label="Редактировать"
        >
          <AdminIcon name="edit" :size="18" />
        </button>
        <button
          class="photo-card__action-btn photo-card__action-btn--danger"
          @click="emit('delete', photo.id)"
          aria-label="Удалить"
        >
          <AdminIcon name="delete" :size="18" />
        </button>
      </div>
    </div>
    <div class="photo-card__body">
      <h3 class="photo-card__title">{{ photo.title }}</h3>
      <p v-if="variant !== 'category' && photo.category" class="photo-card__category">{{ photo.category }}</p>
      <div v-if="showStats && (photo.views !== undefined || photo.downloads !== undefined || photo.earnings !== undefined)" class="photo-card__stats">
        <div v-if="photo.views !== undefined" class="photo-card__stat">
          <AdminIcon name="view" :size="16" />
          <span>{{ photo.views }}</span>
        </div>
        <div v-if="photo.downloads !== undefined" class="photo-card__stat">
          <AdminIcon name="view" :size="16" />
          <span>{{ photo.downloads }}</span>
        </div>
        <div v-if="photo.earnings !== undefined" class="photo-card__stat">
          <AdminIcon name="money" :size="16" />
          <span>₽{{ photo.earnings.toLocaleString() }}</span>
        </div>
      </div>
      <div v-if="photo.tags && photo.tags.length > 0" class="photo-card__tags">
        <span v-for="tag in photo.tags" :key="tag" class="photo-card__tag">{{ tag }}</span>
      </div>
      <p v-if="variant !== 'category' && photo.uploadedAt" class="photo-card__date" :class="{ 'photo-card__date--collection': variant === 'collection' }">
        <template v-if="variant === 'collection'">{{ photo.uploadedAt }}</template>
        <template v-else>Загружено {{ photo.uploadedAt }}</template>
      </p>
      <span v-if="variant === 'collection'" class="photo-card__link">Открыть подборку →</span>
    </div>
  </div>
</template>

<style scoped>
.photo-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.photo-card__image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.photo-card--compact .photo-card__image {
  aspect-ratio: 4 / 3;
}

.photo-card--category {
  min-height: auto;
}

.photo-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-card:hover .photo-card__image img {
  transform: scale(1.05);
}

.photo-card__status-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 2;
}

.photo-card__status {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.photo-card__status--published {
  color: var(--color-accent);
}

.photo-card__status--pending {
  color: #f59e0b;
}

.photo-card__status--draft {
  color: var(--color-text-muted);
}

.photo-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.photo-card:hover .photo-card__overlay {
  opacity: 1;
}

.photo-card__action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.photo-card__action-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
}

.photo-card__action-btn--danger {
  color: #ef4444;
}

.photo-card__action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.photo-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-height: 200px;
}

.photo-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.photo-card__category {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.photo-card__stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.photo-card__stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.photo-card__stat :deep(.admin-icon) {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.photo-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.photo-card__tag {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 500;
}

.photo-card__date {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.photo-card__date--collection {
  margin-bottom: 0.5rem;
}

.photo-card__link {
  font-weight: 600;
  color: var(--color-accent);
  margin-top: auto;
  display: inline-block;
}

@media (max-width: 768px) {
  .photo-card__overlay {
    opacity: 1;
  }
}
</style>

