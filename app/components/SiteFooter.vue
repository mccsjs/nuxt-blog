<script setup lang="ts">
const { site } = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <p>© {{ year }} {{ site.author }} · 由 Nuxt 4 与 Nuxt Content 构建</p>
    </div>
  </footer>
</template>
