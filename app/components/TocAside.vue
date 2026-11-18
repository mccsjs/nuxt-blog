<script setup lang="ts">
const props = defineProps<{ links?: { id?: string; depth?: number; text?: string }[] }>()

const items = computed(() =>
  (props.links || [])
    .filter((item) => item.id && item.text)
    .map((item) => ({ id: item.id!, text: item.text!, depth: item.depth ?? 2 })),
)

const activeId = ref('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
  )
  nextTick(() => {
    for (const item of items.value) {
      const el = document.getElementById(item.id)
      if (el) observer!.observe(el)
    }
  })
})

watch(items, () => {
  observer?.disconnect()
  nextTick(() => {
    for (const item of items.value) {
      const el = document.getElementById(item.id)
      if (el) observer?.observe(el)
    }
  })
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <nav v-if="items.length" class="sticky top-28 hidden max-h-[calc(100vh-9rem)] overflow-y-auto lg:block" aria-label="文章目录">
    <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        <Icon name="archive" class="h-4 w-4 text-teal-500" />
        目录
      </h3>
      <ul class="space-y-1 border-l-2 border-slate-100 dark:border-slate-800">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="block rounded-r-lg border-l-2 py-1.5 text-xs leading-relaxed transition"
            :class="[
              item.depth >= 3 ? 'pl-7' : 'pl-4',
              activeId === item.id
                ? 'border-teal-400 font-semibold text-teal-600 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-300',
            ]"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
