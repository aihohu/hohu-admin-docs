<script setup lang="ts">
import { useHomeContent } from '../composables/useHomeContent';
import { useHomeTheme } from '../composables/useHomeTheme';
import HomeNav from './home/HomeNav.vue';
import HomeHero from './home/HomeHero.vue';
import HomeJourney from './home/HomeJourney.vue';
import HomeWorkflow from './home/HomeWorkflow.vue';
import HomePlatform from './home/HomePlatform.vue';
import HomeStart from './home/HomeStart.vue';
import HomeFooter from './home/HomeFooter.vue';
import HomeFaq from './home/HomeFaq.vue';
import HomeClosing from './home/HomeClosing.vue';
import './home/home.css';

const { locale, copy } = useHomeContent();
useHomeTheme();
</script>

<template>
  <div class="hohu-home">
    <a class="home-skip" href="#main-content">{{ copy.nav.skip }}</a>
    <HomeNav :copy="copy.nav" :locale="locale" />
    <main id="main-content" tabindex="-1">
      <HomeHero :copy="copy.hero" />
      <HomeJourney :copy="copy.journey" :locale="locale" />
      <HomeWorkflow :copy="copy.workflow" :locale="locale" />
      <HomePlatform :copy="copy.platform" :locale="locale" />
      <HomeStart :copy="copy.start" :locale="locale" />
      <HomeFaq :copy="copy.footer" />
      <HomeClosing :copy="copy.closing" :actions="copy.hero" />
    </main>
    <HomeFooter :copy="copy.footer" :locale="locale" />
  </div>
</template>
