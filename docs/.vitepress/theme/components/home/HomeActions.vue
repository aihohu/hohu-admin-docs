<script setup lang="ts">
import type { HomeContent } from '../../composables/home';
import { trackAction } from '../../composables/analytics';

defineProps<{ copy: Pick<HomeContent['hero'], 'demo' | 'develop'> }>();
</script>

<template>
  <div class="home-actions">
    <a class="home-button" href="https://show.hohu.org" @click="trackAction('demo')">{{ copy.demo }}</a>
    <a class="home-button secondary" href="#start" @click="trackAction('get_started')">{{ copy.develop }}</a>
  </div>
</template>
