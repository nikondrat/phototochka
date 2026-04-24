<template>
  <main class="page blog-post-page">
    <article v-if="post" class="container py-12">
      <div class="blog-post-header mb-12">
        <RouterLink to="/blog" class="btn btn--ghost mb-8">← {{ $t('common.back') }}</RouterLink>
        <h1 class="blog-post-title mb-6">{{ post.title }}</h1>
        <div class="blog-post-meta flex items-center gap-4 text-muted">
          <div class="author-info flex items-center gap-2">
            <img v-if="post.author.avatar" :src="post.author.avatar" class="w-8 h-8 rounded-full" />
            <span>{{ post.author.displayName }}</span>
          </div>
          <span>•</span>
          <time>{{ new Date(post.createdAt).toLocaleDateString() }}</time>
        </div>
      </div>
      
      <div v-if="post.coverImage" class="blog-post-cover mb-12">
        <img :src="post.coverImage" :alt="post.title" class="w-full rounded-3xl" />
      </div>
      
      <div class="blog-post-content prose max-w-none" v-html="renderedContent"></div>
    </article>
    
    <div v-else-if="loading" class="container py-24 text-center">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-muted">{{ $t('common.loading') }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogPost, type BlogPost } from '../services/blogService'
import { marked } from 'marked'

const route = useRoute()
const post = ref<BlogPost | null>(null)
const loading = ref(true)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked(post.value.content)
})

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    post.value = await getBlogPost(slug)
  } catch (error) {
    console.error('Failed to fetch blog post', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.blog-post-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
}

.blog-post-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text);
}

.blog-post-content :deep(h2) {
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.blog-post-content :deep(p) {
  margin-bottom: 1.5rem;
}

.blog-post-content :deep(img) {
  border-radius: 20px;
  margin: 2rem 0;
}
</style>
