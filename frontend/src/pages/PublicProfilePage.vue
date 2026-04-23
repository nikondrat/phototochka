<template>
  <div class="profile-page">
    <div v-if="loading" class="container py-24 text-center">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-muted">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="author" class="container py-12">
      <!-- Hero Section -->
      <div class="profile-hero">
        <div class="profile-hero__content">
          <AuthorAvatar 
            :src="author.avatar" 
            :name="author.displayName || author.username" 
            size="xl" 
          />
          <div class="profile-hero__info">
            <h1 class="profile-hero__name">{{ author.displayName || author.username }}</h1>
            <p class="profile-hero__subtitle text-muted mb-4">{{ author.bio }}</p>
            <div class="profile-hero__meta mb-4">
              <span class="profile-badge profile-badge--author">
                {{ $t('profile.role_author') }}
              </span>
              <span class="profile-hero__date">
                <Calendar :size="14" class="inline mr-1" />
                {{ $t('profile.registeredSince') }} {{ registrationDate }}
              </span>
            </div>
            
            <div v-if="author.website || author.instagram" class="profile-hero__socials flex gap-4">
              <a v-if="author.website" :href="author.website" target="_blank" class="social-link" title="Веб-сайт">
                <Globe :size="18" />
              </a>
              <a v-if="author.instagram" :href="`https://instagram.com/${author.instagram.replace('@', '')}`" target="_blank" class="social-link" title="Instagram">
                <Instagram :size="18" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-layout">
        <div class="w-full space-y-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ $t('profile.myWorks') }}</h2>
            <span class="text-muted">{{ photos.length }} {{ $t('catalog.photos') }}</span>
          </div>
          <PhotoGrid v-if="photos.length > 0" :photos="photos" />
          <AppEmptyState 
            v-else-if="!loading"
            :title="$t('profile.noWorks')" 
            :description="$t('profile.noWorksDesc')"
          >
            <template #icon><ImageIcon :size="48" /></template>
          </AppEmptyState>
        </div>
      </div>
    </div>
    
    <div v-else class="container py-24 text-center">
      <h2 class="text-2xl font-bold mb-4">{{ $t('common.error') }}</h2>
      <p class="text-muted mb-8">Автор не найден</p>
      <RouterLink to="/catalog" class="btn btn--primary">{{ $t('profile.goToCatalog') }}</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { apiFetch } from '../api/http'
import { 
  Calendar,
  Globe,
  Instagram,
  Image as ImageIcon
} from 'lucide-vue-next'
import AuthorAvatar from '../components/common/AuthorAvatar.vue'
import PhotoGrid from '../components/PhotoGrid.vue'
import AppEmptyState from '../components/common/AppEmptyState.vue'

const route = useRoute()
const { locale } = useI18n()
const author = ref<any>(null)
const photos = ref<any[]>([])
const loading = ref(true)

const registrationDate = computed(() => {
  if (!author.value?.dateJoined) return ''
  const date = new Date(author.value.dateJoined)
  if (isNaN(date.getTime())) return author.value.dateJoined
  return date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'long',
    year: 'numeric'
  })
})

// Отслеживание изменения параметров в роуте
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      loadAuthorData()
    }
  },
  { immediate: true }
)

async function loadAuthorData() {
  const username = route.params.username as string
  loading.value = true
  try {
    const data = await apiFetch<any>(`/auth/authors/${username}/`)
    author.value = data
    // Load author's photos
    const photosData = await apiFetch<any>(`/photos/?author=${data.username}`)
    photos.value = photosData.results || photosData || []
  } catch (error) {
    console.error('Failed to fetch author data', error)
    author.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
})
</script>

<style scoped>
.profile-page {
  background: var(--color-surface-sunken);
  min-height: calc(100vh - var(--header-height));
}

.profile-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 3.5rem;
  border-radius: 32px;
  border: 1px solid rgba(15, 23, 42, 0.05);
  margin-bottom: 3rem;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 20px 25px -5px rgba(0, 0, 0, 0.03);
}

.profile-hero__content {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.profile-hero__avatar {
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: var(--color-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
  border: 4px solid #ffffff;
}

.profile-hero__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-hero__name {
  font-family: 'Playfair Display', serif;
  font-size: 2.75rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.profile-hero__meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.profile-badge {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.45rem 1.1rem;
  border-radius: 12px;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.profile-badge--author {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent);
}

.profile-hero__date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.profile-hero__bio {
  font-size: 0.95rem;
  line-height: 1.6;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(15, 23, 42, 0.05);
  color: var(--color-text-muted);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--color-accent);
  color: #ffffff;
  transform: translateY(-2px);
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .profile-hero {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .profile-hero__content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
