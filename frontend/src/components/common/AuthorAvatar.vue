<script setup lang="ts">
import { computed } from 'vue'
import { User } from 'lucide-vue-next'

interface Props {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  badge?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name.charAt(0).toUpperCase()
})

const sizeClass = computed(() => `author-avatar--${props.size}`)
</script>

<template>
  <div class="author-avatar" :class="[sizeClass, { 'author-avatar--has-badge': badge }]">
    <div class="author-avatar__inner">
      <img v-if="src" :src="src" :alt="name || 'Avatar'" loading="lazy" />
      <div v-else class="author-avatar__fallback">
        <span>{{ initials }}</span>
      </div>
    </div>
    <span v-if="badge" class="author-avatar__badge">{{ badge }}</span>
  </div>
</template>

<style scoped>
.author-avatar {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.author-avatar__inner {
  width: var(--avatar-size, 48px);
  height: var(--avatar-size, 48px);
  border-radius: calc(var(--avatar-size, 48px) * 0.35);
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent), #0f172a);
  color: #ffffff;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  font-size: calc(var(--avatar-size, 48px) * 0.4);
}

.author-avatar__badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--color-accent);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
  text-transform: uppercase;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sizes */
.author-avatar--sm { --avatar-size: 32px; }
.author-avatar--md { --avatar-size: 48px; }
.author-avatar--lg { --avatar-size: 80px; }
.author-avatar--xl { --avatar-size: 120px; }

/* Effects */
.author-avatar:hover .author-avatar__inner {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2);
}

.author-avatar--lg .author-avatar__inner {
  border-width: 3px;
  border-radius: 28px;
}

.author-avatar--xl .author-avatar__inner {
  border-width: 4px;
  border-radius: 36px;
}
</style>
