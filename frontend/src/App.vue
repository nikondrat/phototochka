<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
import HeaderNav from "./components/HeaderNav.vue";
import SiteFooter from "./components/SiteFooter.vue";

const route = useRoute();

const isAuthPage = computed(() => {
  return route.name === "login" || route.name === "register";
});

const isAdminOrPhotographerPage = computed(() => {
  const routeName = route.name as string;
  return (
    routeName === "admin" ||
    routeName?.startsWith("photographer-") ||
    routeName?.startsWith("admin-")
  );
});

const showHeaderAndFooter = computed(() => {
  return !isAuthPage.value && !isAdminOrPhotographerPage.value;
});
</script>

<template>
  <div class="app">
    <HeaderNav v-if="showHeaderAndFooter" />
    <RouterView />
    <SiteFooter v-if="showHeaderAndFooter" />
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
