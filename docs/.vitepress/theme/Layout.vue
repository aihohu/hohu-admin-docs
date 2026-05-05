<script setup>
import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import { watch, onMounted } from 'vue';

const { Layout } = DefaultTheme;
const route = useRoute();

function updateLandingClass() {
  const isLanding = route.path === '/' || route.path === '/index.html';
  if (isLanding) {
    document.documentElement.classList.add('landing-page');
  } else {
    document.documentElement.classList.remove('landing-page');
  }
}

onMounted(updateLandingClass);
watch(() => route.path, updateLandingClass);
</script>

<template>
  <Layout />
</template>
