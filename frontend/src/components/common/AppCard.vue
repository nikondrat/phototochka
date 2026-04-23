<template>
  <div class="app-card" :class="{ 'app-card--hover': hover }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hover?: boolean
}>()
</script>

<style scoped>
.app-card {
  background: var(--color-surface-card, #ffffff);
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.05);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 10px 20px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.app-card--hover:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.05),
    0 10px 10px -5px rgba(0, 0, 0, 0.02);
}
</style>
