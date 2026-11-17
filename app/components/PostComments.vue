<script setup lang="ts">
const route = useRoute()
const { container, status, render } = useTwikoo(toRef(route, 'path'))

onMounted(render)
watch(() => route.path, render)
</script>

<template>
  <section class="mt-6">
    <div class="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8 dark:border-slate-700/70 dark:bg-slate-900/80">
      <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        <Icon name="comment" class="h-4 w-4 text-teal-500" />
        评论
      </h2>

      <p v-if="status === 'unconfigured'" class="text-sm text-slate-400 dark:text-slate-500">
        评论功能尚未开放。
      </p>
      <p v-else-if="status === 'error'" class="text-sm text-slate-400 dark:text-slate-500">
        评论加载失败，
        <button class="text-teal-600 underline decoration-dashed underline-offset-4 hover:decoration-solid dark:text-teal-300" @click="render">
          重新加载
        </button>
      </p>
      <p v-else-if="status !== 'ready'" class="text-sm text-slate-400 dark:text-slate-500">评论加载中…</p>

      <div ref="container" class="twikoo-host min-h-24" :class="{ 'hidden': status !== 'ready' }" />
    </div>
  </section>
</template>

<style scoped>
.twikoo-host :deep(.tk-comments-title) {
  border: 0;
  padding: 0;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-slate-700);
}
.dark .twikoo-host :deep(.tk-comments-title) {
  color: var(--color-slate-200);
}

.twikoo-host :deep(.tk-comment) {
  border-top: 1px solid var(--color-slate-100);
  padding: 1.1rem 0;
}
.dark .twikoo-host :deep(.tk-comment) {
  border-top-color: var(--color-slate-800);
}

.twikoo-host :deep(.tk-avatar) {
  border-radius: 0.75rem;
}

.twikoo-host :deep(.tk-nick) {
  color: var(--color-primary-600);
  font-size: 1.0625rem;
}
.dark .twikoo-host :deep(.tk-nick) {
  color: var(--color-primary-300);
}

.twikoo-host :deep(.tk-time) {
  color: var(--color-slate-400);
  font-size: 0.84375rem;
}

.twikoo-host :deep(.tk-content) {
  color: var(--color-slate-600);
  font-size: 1rem;
}
.dark .twikoo-host :deep(.tk-content) {
  color: var(--color-slate-300);
}

.twikoo-host :deep(.tk-content a) {
  color: var(--color-primary-600);
  text-decoration: underline;
  text-decoration-color: var(--color-primary-300);
  text-underline-offset: 3px;
}
.dark .twikoo-host :deep(.tk-content a) {
  color: var(--color-primary-300);
  text-decoration-color: var(--color-primary-700);
}

.twikoo-host :deep(.tk-replies) {
  border-left: 2px solid var(--color-slate-100);
  padding-left: 1rem;
}
.dark .twikoo-host :deep(.tk-replies) {
  border-left-color: var(--color-slate-800);
}

.twikoo-host :deep(.tk-input) {
  border: 1px solid var(--color-slate-200);
  border-radius: 0.75rem;
  overflow: hidden;
  background: transparent;
}
.dark .twikoo-host :deep(.tk-input) {
  border-color: var(--color-slate-700);
}
.twikoo-host :deep(.tk-input:focus-within) {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgb(45 212 191 / 0.12);
}

.twikoo-host :deep(.tk-input__prepend) {
  border-bottom: 1px solid var(--color-slate-100);
  background: transparent;
}
.dark .twikoo-host :deep(.tk-input__prepend) {
  border-bottom-color: var(--color-slate-800);
}

.twikoo-host :deep(.tk-input__inner),
.twikoo-host :deep(.tk-textarea__inner) {
  background: transparent;
  color: var(--color-slate-700);
}
.dark .twikoo-host :deep(.tk-input__inner),
.dark .twikoo-host :deep(.tk-textarea__inner) {
  color: var(--color-slate-200);
}
.twikoo-host :deep(.tk-input__inner::placeholder),
.twikoo-host :deep(.tk-textarea__inner::placeholder) {
  color: var(--color-slate-400);
}

.twikoo-host :deep(.tk-button) {
  border-radius: 9999px;
  border-color: var(--color-slate-200);
  background: transparent;
  color: var(--color-slate-600);
  transition: all 0.2s ease;
}
.dark .twikoo-host :deep(.tk-button) {
  border-color: var(--color-slate-700);
  color: var(--color-slate-300);
}
.twikoo-host :deep(.tk-button:hover) {
  border-color: var(--color-primary-400);
  color: var(--color-primary-600);
}

.twikoo-host :deep(.tk-button--primary) {
  border-color: transparent;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-sky-soft));
  color: #fff;
}
.twikoo-host :deep(.tk-button--primary:hover) {
  border-color: transparent;
  color: #fff;
  filter: brightness(1.05);
}
.twikoo-host :deep(.tk-button.is-disabled) {
  opacity: 0.5;
}

.twikoo-host :deep(.tk-preview) {
  border-radius: 0.75rem;
}

/* 点赞/点踩数字在窄屏下不与图标分离 */
.twikoo-host :deep(.tk-action) {
  flex-shrink: 0;
}
.twikoo-host :deep(.tk-action-link) {
  white-space: nowrap;
  flex-shrink: 0;
  gap: 0.15rem;
}
.twikoo-host :deep(.tk-action-count) {
  flex-shrink: 0;
}
</style>
