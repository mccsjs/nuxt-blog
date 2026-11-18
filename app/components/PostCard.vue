<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    path: string
    description?: string
    date?: string
    category?: string
    tags?: string[]
    image?: string
    horizontal?: boolean
  }>(),
  { horizontal: false },
)

const gradient = computed(() => gradientFor(props.path))
</script>

<template>
  <NuxtLink
    :to="path"
    class="group relative flex overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-soft transition sm:backdrop-blur duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg dark:border-slate-700/70 dark:bg-slate-900/80"
    :class="horizontal ? 'flex-col sm:flex-row' : 'flex-col'"
  >
    <!-- 封面 / 渐变头图 -->
    <div class="relative shrink-0 overflow-hidden" :class="horizontal ? 'h-44 sm:h-auto sm:w-52' : 'h-36'">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="title"
        width="640"
        height="360"
        densities="1x"
        format="webp"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br transition duration-500 group-hover:scale-105" :class="gradient">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 text-teal-600 shadow-sm dark:bg-white/10 dark:text-teal-300">
          <Icon name="posts" class="h-5 w-5" />
        </span>
      </div>
      <div class="pointer-events-none absolute inset-0 dark:bg-black/10"></div>
      <span
        v-if="category"
        class="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-teal-700 shadow-sm dark:bg-slate-900/80 dark:text-teal-300"
      >
        {{ category }}
      </span>
    </div>

    <!-- 内容 -->
    <div class="flex flex-1 flex-col p-5">
      <h3 class="font-bold text-slate-800 transition group-hover:text-teal-600 dark:text-slate-300 dark:group-hover:text-teal-300" :class="horizontal ? 'text-base sm:text-lg' : 'text-lg'">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {{ description }}
      </p>
      <div class="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400 dark:text-slate-500">
        <span class="flex items-center gap-1.5">
          <Icon name="calendar" class="h-3.5 w-3.5" />
          {{ date }}
        </span>
        <span v-if="tags?.length" class="flex max-w-[60%] flex-wrap justify-end gap-1.5">
          <span v-for="tag in tags.slice(0, 3)" :key="tag" class="rounded-full bg-teal-50 px-2 py-0.5 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
            # {{ tag }}
          </span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
