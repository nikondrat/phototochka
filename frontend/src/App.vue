<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNav from './components/HeaderNav.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="app">
    <HeaderNav />
    <RouterView />
    <SiteFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

:deep(main) {
  flex: 1;
}
</style>
