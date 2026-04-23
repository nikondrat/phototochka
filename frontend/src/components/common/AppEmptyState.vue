<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon" />
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__description">{{ description }}</p>
    <div class="empty-state__actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  border: 1px dashed var(--color-border);
  margin: 2rem 0;
}

.empty-state__icon {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.empty-state__description {
  color: var(--color-text-muted);
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.empty-state__actions {
  display: flex;
  gap: 1rem;
}
</style>
