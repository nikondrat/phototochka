<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../utils/icons'

interface Props {
  name: string
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  class: '',
})

const icon = computed(() => getIcon(props.name))

const iconStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
  }
})
</script>

<template>
  <span
    v-if="icon"
    class="admin-icon"
    :class="props.class"
    :style="iconStyle"
    v-html="icon.svg"
  />
</template>

<style scoped>
.admin-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
}

.admin-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

