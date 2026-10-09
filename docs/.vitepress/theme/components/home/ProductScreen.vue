<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
const props = defineProps<{
  src: string;
  darkSrc: string;
  alt: string;
  caption: string;
  imageLink: string;
  eager?: boolean;
}>();
const { isDark } = useData();
const image = computed(() => (isDark.value ? props.darkSrc : props.src));
</script>

<template>
  <figure class="product-screen">
    <a class="screen-image" :href="image" target="_blank" rel="noopener" :aria-label="imageLink">
      <img
        :src="image"
        :alt="alt"
        width="1050"
        height="864"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        decoding="async"
      />
    </a>
    <figcaption class="screen-caption">
      {{ caption }}
      <a :href="image" target="_blank" rel="noopener">{{ imageLink }}</a>
    </figcaption>
  </figure>
</template>

<style scoped>
.product-screen {
  min-width: 0;
}
.screen-image {
  display: block;
  background: var(--home-bg);
  border: 1px solid var(--home-line);
  border-radius: 10px;
  overflow: hidden;
}
.screen-image img {
  display: block;
  width: 100%;
  height: auto;
}
.screen-caption {
  display: flex;
  gap: 8px 18px;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 1.7;
  padding-top: 14px;
}
.screen-caption a {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
