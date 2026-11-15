<script setup lang="ts">
const { site, nav } = useAppConfig()
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="brand">{{ site.name }}</NuxtLink>
      <nav class="site-nav" aria-label="主导航">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
