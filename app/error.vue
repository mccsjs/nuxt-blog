<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="error-page">
    <p class="error-code">{{ error.statusCode }}</p>
    <h1>{{ error.statusCode === 404 ? '页面不存在' : '出了点问题' }}</h1>
    <p>{{ error.statusMessage || '请稍后再试' }}</p>
    <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>
  </div>
</template>
