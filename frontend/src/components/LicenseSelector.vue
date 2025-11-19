<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LicenseType } from '../data/photos'

interface Props {
  licenses: LicenseType[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedLicenseId = ref(props.modelValue || props.licenses[0]?.id || '')

function selectLicense(licenseId: string) {
  selectedLicenseId.value = licenseId
  emit('update:modelValue', licenseId)
}

const selectedLicense = computed(() => {
  return props.licenses.find((l) => l.id === selectedLicenseId.value)
})

const totalPrice = computed(() => {
  return selectedLicense.value?.price || 0
})
</script>

<template>
  <div class="license-selector">
    <div class="license-selector__header">
      <h3 class="license-selector__title">Выберите лицензию</h3>
      <p class="license-selector__subtitle">
        Каждый тип лицензии определяет права использования фотографии
      </p>
    </div>

    <div class="license-selector__options">
      <label
        v-for="license in licenses"
        :key="license.id"
        :class="[
          'license-option',
          { 'license-option--selected': selectedLicenseId === license.id },
        ]"
      >
        <input
          type="radio"
          :value="license.id"
          :checked="selectedLicenseId === license.id"
          @change="selectLicense(license.id)"
          class="license-option__input"
        />
        <div class="license-option__content">
          <div class="license-option__header">
            <div class="license-option__info">
              <strong class="license-option__name">{{ license.name }}</strong>
              <span class="license-option__price">₽{{ license.price.toLocaleString() }}</span>
            </div>
            <div class="license-option__radio"></div>
          </div>
          <p class="license-option__description">{{ license.description }}</p>
        </div>
      </label>
    </div>

    <div v-if="selectedLicense" class="license-selector__summary">
      <div class="license-selector__total">
        <span class="license-selector__total-label">Итого:</span>
        <strong class="license-selector__total-price">₽{{ totalPrice.toLocaleString() }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.license-selector {
  display: grid;
  gap: 1.5rem;
}

.license-selector__header {
  display: grid;
  gap: 0.5rem;
}

.license-selector__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-text);
}

.license-selector__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.license-selector__options {
  display: grid;
  gap: 1rem;
}

.license-option {
  position: relative;
  display: block;
  cursor: pointer;
}

.license-option__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.license-option__content {
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border: 2px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  transition: all 0.2s ease;
  display: grid;
  gap: 0.75rem;
}

.license-option:hover .license-option__content {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.license-option--selected .license-option__content {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.6), #ffffff);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
}

.license-option__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.license-option__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.license-option__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.license-option__price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-accent);
}

.license-option__radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(15, 23, 42, 0.3);
  background: #ffffff;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.license-option__radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  transition: transform 0.2s ease;
}

.license-option--selected .license-option__radio {
  border-color: var(--color-accent);
}

.license-option--selected .license-option__radio::after {
  transform: translate(-50%, -50%) scale(1);
}

.license-option__description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.license-selector__summary {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(15, 23, 42, 0.12);
}

.license-selector__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.4), rgba(236, 253, 245, 0.2));
}

.license-selector__total-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.license-selector__total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .license-option__content {
    padding: 1rem 1.25rem;
  }

  .license-option__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .license-selector__total {
    padding: 0.875rem 1rem;
  }

  .license-selector__total-price {
    font-size: 1.35rem;
  }
}
</style>

