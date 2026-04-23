<template>
  <div class="app-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="app-tabs__btn"
      :class="{ 'app-tabs__btn--active': modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      <component v-if="tab.icon" :is="tab.icon" :size="18" class="mr-2" />
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: Component
}

defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.03);
  padding: 0.4rem;
  border-radius: 14px;
  margin-bottom: 1rem;
  width: fit-content;
}

.app-tabs__btn {
  background: transparent;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-tabs__btn:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.5);
}

.app-tabs__btn--active {
  color: var(--color-accent);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
