<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { auth } from '../utils/auth'
import { apiFetch } from '../api/http'
import { 
  User as UserIcon, 
  Mail, 
  Settings, 
  Image as ImageIcon, 
  Heart, 
  LogOut,
  ShieldCheck,
  Calendar,
  Eye,
  Download,
  Globe,
  Instagram,
  AlignLeft
} from 'lucide-vue-next'
import AuthorAvatar from '../components/common/AuthorAvatar.vue'
import AppCard from '../components/common/AppCard.vue'
import StatCard from '../components/common/StatCard.vue'
import AppTabs from '../components/common/AppTabs.vue'
import AppEmptyState from '../components/common/AppEmptyState.vue'
import PhotoGrid from '../components/PhotoGrid.vue'

const router = useRouter()
const { t, locale } = useI18n()
const user = ref<any>(null)
const userPhotos = ref<any[]>([])
const favoritePhotos = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('stats')
const message = ref<{ text: string, type: 'success' | 'error' } | null>(null)

const form = ref({
  displayName: '',
  email: '',
  bio: '',
  website: '',
  instagram: ''
})

const tabs = computed(() => {
  const base = [
    { id: 'stats', label: t('profile.stats'), icon: ShieldCheck },
    { id: 'settings', label: t('profile.settings'), icon: Settings },
  ]
  if (user.value?.role === 'author') {
    base.unshift({ id: 'photos', label: t('profile.myWorks'), icon: ImageIcon })
  } else {
    base.unshift({ id: 'favorites', label: t('profile.favorites'), icon: Heart })
  }
  return base
})

const registrationDate = computed(() => {
  if (!user.value?.dateJoined) return t('common.loading')
  const date = new Date(user.value.dateJoined)
  if (isNaN(date.getTime())) return user.value.dateJoined
  return date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'long',
    year: 'numeric'
  })
})

onMounted(async () => {
  let currentUser = auth.getCurrentUser()
  
  if (!currentUser) {
    if (auth.isAuthenticated()) {
      try {
        currentUser = await auth.fetchMe()
      } catch (e) {
        auth.logout()
        loading.value = false
        router.push('/login')
        return
      }
    } else {
      loading.value = false
      router.push('/login')
      return
    }
  }
  
  try {
    const isAuthor = currentUser.role === 'author'
    const [me, photos] = await Promise.all([
      // Use the currentUser we already have or fetch it if needed
      // Actually fetchMe() is good to get latest data like totalViews/totalDownloads
      auth.fetchMe(),
      isAuthor 
        ? apiFetch<any>('/author/photos/')
        : Promise.resolve([])
    ])
    
    user.value = me
    userPhotos.value = photos

    // Загрузка избранного из localStorage
    const savedFavs = localStorage.getItem('ft_favorites')
    if (savedFavs) {
      const ids = JSON.parse(savedFavs)
      if (ids.length > 0) {
        try {
          // Загружаем детали избранных фото
          const favsResponse = await apiFetch<any>(`/photos/?ids=${ids.join(',')}`)
          favoritePhotos.value = favsResponse.results || favsResponse
        } catch (e) {
          console.error('Failed to fetch favorite photos', e)
        }
      }
    }
    
    form.value = {
      displayName: user.value.displayName || '',
      email: user.value.email || '',
      bio: user.value.bio || '',
      website: user.value.website || '',
      instagram: user.value.instagram || ''
    }
    
    // Если есть фото, по умолчанию открываем вкладку с ними
    if (user.value.role === 'author' && photos.length > 0) {
      activeTab.value = 'photos'
    }
  } catch (error) {
    console.error('Failed to fetch profile data', error)
  } finally {
    loading.value = false
  }
})

const handleUpdate = async () => {
  loading.value = true
  message.value = null
  
  try {
    const updated = await apiFetch<any>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(form.value)
    })
    user.value = updated
    localStorage.setItem('fototochka_user', JSON.stringify(updated))
    message.value = { text: t('profile.successUpdate'), type: 'success' }
  } catch (error: any) {
    message.value = { text: error.message || t('profile.errorUpdate'), type: 'error' }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="profile-page">
    <div v-if="loading && !user" class="container py-24 text-center">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-muted">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="user" class="container py-12">
      <!-- Hero Section -->
      <div class="profile-hero">
        <div class="profile-hero__content">
          <AuthorAvatar 
            :src="user.avatar" 
            :name="user.displayName || user.username" 
            size="xl" 
          />
          <div class="profile-hero__info">
            <h1 class="profile-hero__name">{{ user.displayName || user.username }}</h1>
            <p class="profile-hero__subtitle text-muted mb-4">{{ $t('profile.subtitle') }}</p>
            <div class="profile-hero__meta mb-4">
              <span class="profile-badge" :class="`profile-badge--${user.role}`">
                {{ $t('profile.role_' + user.role) }}
              </span>
              <span class="profile-hero__date">
                <Calendar :size="14" class="inline mr-1" />
                {{ $t('profile.registeredSince') }} {{ registrationDate }}
              </span>
            </div>
            
            <p v-if="user.bio" class="profile-hero__bio max-w-lg text-muted mb-4">
              {{ user.bio }}
            </p>

            <div v-if="user.website || user.instagram" class="profile-hero__socials flex gap-4">
              <a v-if="user.website" :href="user.website" target="_blank" class="social-link" title="Веб-сайт">
                <Globe :size="18" />
              </a>
              <a v-if="user.instagram" :href="`https://instagram.com/${user.instagram.replace('@', '')}`" target="_blank" class="social-link" title="Instagram">
                <Instagram :size="18" />
              </a>
            </div>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn--ghost btn--danger">
          <LogOut :size="18" />
          {{ $t('common.logout') }}
        </button>
      </div>

      <!-- Main Layout -->
      <div class="profile-layout">
        <AppTabs v-model="activeTab" :tabs="tabs" />

        <div class="profile-content">
          <!-- Stats Tab -->
          <div v-if="activeTab === 'stats'" class="grid-stats">
            <AppCard v-if="user.role === 'author'">
              <StatCard :value="userPhotos.length" :label="$t('profile.myWorks')">
                <template #icon><ImageIcon :size="24" /></template>
              </StatCard>
            </AppCard>
            <AppCard v-if="user.role === 'author'">
              <StatCard :value="user.totalViews || 0" :label="$t('profile.totalViews')">
                <template #icon><Eye :size="24" /></template>
              </StatCard>
            </AppCard>
            <AppCard v-if="user.role === 'author'">
              <StatCard :value="user.totalDownloads || 0" :label="$t('profile.totalDownloads')">
                <template #icon><Download :size="24" /></template>
              </StatCard>
            </AppCard>
            <AppCard>
              <StatCard :value="0" :label="user.role === 'author' ? $t('profile.earned') : $t('profile.bought')">
                <template #icon><ShieldCheck :size="24" /></template>
              </StatCard>
            </AppCard>
          </div>

          <!-- Photos Tab (Authors) -->
          <div v-else-if="activeTab === 'photos'" class="w-full space-y-6">
            <div v-if="userPhotos.length > 0">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">{{ $t('profile.myWorks') }}</h2>
                <RouterLink to="/photographer/photos/upload" class="btn btn--primary">{{ $t('profile.uploadNew') }}</RouterLink>
              </div>
              <PhotoGrid :photos="userPhotos" />
            </div>
            <AppEmptyState 
              v-else
              :title="$t('profile.noWorks')" 
              :description="$t('profile.noWorksDesc')"
            >
              <template #icon><ImageIcon :size="48" /></template>
              <template #actions>
                <RouterLink to="/photographer/photos/upload" class="btn btn--primary">{{ $t('profile.uploadFirst') }}</RouterLink>
              </template>
            </AppEmptyState>
          </div>

          <!-- Favorites Tab -->
          <div v-else-if="activeTab === 'favorites'" class="w-full space-y-6">
            <div v-if="favoritePhotos.length > 0">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">{{ $t('profile.favorites') }}</h2>
              </div>
              <PhotoGrid :photos="favoritePhotos" />
            </div>
            <AppEmptyState 
              v-else
              :title="$t('profile.noFavorites')" 
              :description="$t('profile.noFavoritesDesc')"
            >
              <template #icon><Heart :size="48" /></template>
              <template #actions>
                <RouterLink to="/catalog" class="btn btn--primary">{{ $t('profile.goToCatalog') }}</RouterLink>
              </template>
            </AppEmptyState>
          </div>

          <!-- Settings Tab -->
          <div v-else-if="activeTab === 'settings'" class="profile-settings">
            <AppCard class="profile-settings__card">
              <div class="profile-settings__header mb-12">
                <h2 class="profile-settings__title">{{ $t('profile.settings') }}</h2>
                <p class="profile-settings__subtitle">{{ $t('profile.subtitle') }}</p>
              </div>

              <form @submit.prevent="handleUpdate" class="profile-settings__form">
                <div v-if="message" :class="`p-4 rounded-xl text-sm mb-8 flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`">
                  <component :is="message.type === 'success' ? ShieldCheck : Eye" :size="20" class="mr-3 shrink-0" />
                  {{ message.text }}
                </div>

                <div class="settings-section mb-10">
                  <h3 class="settings-section__title mb-6">{{ $t('auth.welcomeBack').split(' ')[0] }} {{ $t('profile.settings').toLowerCase() }}</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">{{ $t('profile.displayName') }}</label>
                      <div class="form-input-wrapper">
                        <UserIcon class="form-input-icon" :size="18" />
                        <input v-model="form.displayName" type="text" class="form-input" :placeholder="$t('profile.displayName')" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">{{ $t('profile.email') }}</label>
                      <div class="form-input-wrapper">
                        <Mail class="form-input-icon" :size="18" />
                        <input v-model="form.email" type="email" class="form-input" />
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group mt-8">
                    <label class="form-label">{{ $t('profile.bio') }}</label>
                    <div class="form-input-wrapper">
                      <AlignLeft class="form-input-icon" style="top: 1.15rem" :size="18" />
                      <textarea v-model="form.bio" class="form-input" rows="4" :placeholder="$t('profile.bio')"></textarea>
                    </div>
                  </div>
                </div>

                <div class="settings-section mb-10 pt-10 border-t border-gray-50">
                  <h3 class="settings-section__title mb-6">{{ $t('profile.website') }} & {{ $t('profile.instagram') }}</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">{{ $t('profile.website') }}</label>
                      <div class="form-input-wrapper">
                        <Globe class="form-input-icon" :size="18" />
                        <input v-model="form.website" type="url" class="form-input" placeholder="https://example.com" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">{{ $t('profile.instagram') }}</label>
                      <div class="form-input-wrapper">
                        <Instagram class="form-input-icon" :size="18" />
                        <input v-model="form.instagram" type="text" class="form-input" placeholder="@username" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-8 border-t border-gray-100 flex justify-end mt-4">
                  <button type="submit" :disabled="loading" class="btn btn--primary profile-save-btn">
                    <span v-if="loading" class="spinner spinner--white mr-2"></span>
                    <Settings v-else :size="18" class="mr-2" />
                    {{ $t('profile.saveChanges') }}
                  </button>
                </div>
              </form>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

.profile-badge--buyer {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
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

.grid-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.profile-settings {
  max-width: 800px;
  width: 100%;
}

.profile-settings__card {
  padding: 4rem;
}

.profile-settings__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.profile-settings__subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.8;
}

.settings-section__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 3rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 
    0 4px 12px rgba(16, 185, 129, 0.2),
    0 2px 4px rgba(16, 185, 129, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
}

.profile-save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(16, 185, 129, 0.2),
    0 4px 8px rgba(16, 185, 129, 0.1);
}

.profile-save-btn:active {
  transform: translateY(0);
}

/* Формы и поля ввода */
.form-group {
  display: grid;
  gap: 0.75rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input-icon {
  position: absolute;
  left: 1.25rem;
  color: var(--color-text-muted);
  opacity: 0.6;
  pointer-events: none;
  z-index: 1;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1.25rem 0.9rem 3.5rem;
  border: 1.5px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  font-size: 1rem;
  font-family: inherit;
  background: #f1f5f9;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text);
  resize: none;
}

.form-input:hover {
  background: #e2e8f0;
  border-color: rgba(15, 23, 42, 0.1);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  background: #ffffff;
}

.form-input:focus + .form-input-icon {
  color: var(--color-accent);
  opacity: 1;
}

.form-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.4;
}

.btn--danger {
  color: var(--color-danger);
}

.btn--danger:hover {
  background: rgba(239, 68, 68, 0.05);
}

.w-full { width: 100%; }
.inline { display: inline-block; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.text-muted { color: var(--color-text-muted); }
.text-center { text-align: center; }

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner--white {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  
  .profile-hero__meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

