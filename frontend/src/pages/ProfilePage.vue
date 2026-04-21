<template>
  <div class="profile-page">
    <div class="container py-12">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Мой профиль</h1>
        
        <div v-if="user" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-50">
            <div class="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-3xl font-bold overflow-hidden">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.displayName" class="w-full h-full object-cover" />
              <span v-else>{{ user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() }}</span>
            </div>
            <div>
              <h2 class="text-2xl font-semibold">{{ user.displayName || user.username }}</h2>
              <p class="text-gray-500">{{ user.email }}</p>
              <div class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                {{ user.role }}
              </div>
            </div>
          </div>

          <form @submit.prevent="handleUpdate" class="space-y-6">
            <div v-if="message" :class="`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`">
              {{ message.text }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Имя для отображения</label>
              <input 
                v-model="form.displayName" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Как вас называть?"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div class="pt-4 flex items-center justify-between">
              <button 
                type="submit" 
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center"
              >
                <span v-if="loading" class="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                Сохранить изменения
              </button>
              
              <button 
                @click="handleLogout" 
                type="button"
                class="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Выйти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, type User } from '../utils/auth'
import { apiFetch } from '../api/http'

const router = useRouter()
const user = ref<any>(null)
const loading = ref(false)
const message = ref<{ text: string, type: 'success' | 'error' } | null>(null)

const form = ref({
  displayName: '',
  email: ''
})

onMounted(async () => {
  const currentUser = auth.getCurrentUser()
  if (!currentUser) {
    router.push('/login')
    return
  }
  
  try {
    user.value = await auth.fetchMe()
    form.value.displayName = user.value.displayName || ''
    form.value.email = user.value.email || ''
  } catch (error) {
    console.error('Failed to fetch user profile', error)
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
    message.value = { text: 'Профиль успешно обновлен', type: 'success' }
  } catch (error: any) {
    message.value = { text: error.message || 'Ошибка при обновлении профиля', type: 'error' }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>
