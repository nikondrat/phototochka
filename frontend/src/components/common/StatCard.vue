<template>
  <div class="stat-card">
    <div class="stat-card__icon">
      <slot name="icon" />
    </div>
    <div class="stat-card__content">
      <span class="stat-card__value">{{ value }}</span>
      <span class="stat-card__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
}

.stat-card__icon {
  color: var(--color-accent);
  margin-bottom: 1.25rem;
  background: #f8fafc;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.03);
}

.stat-card:hover .stat-card__icon {
  transform: scale(1.1) rotate(5deg);
  background: var(--color-accent);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.stat-card__value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

.stat-card__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
}
</style>
