<script setup lang="ts">
import { IconArrowNarrowUp, IconList, IconMessageCircle, IconMoonStars, IconSunLow } from '@tabler/icons-vue'

const route = useRoute()
const { isDark, toggle } = useTheme()

const tocLinks = useState<{ id?: string, text?: string, depth?: number }[]>('post-toc', () => [])
const tocOpen = ref(false)
const scrolled = ref(false)
const mounted = ref(false)

const isPost = computed(() => route.path.startsWith('/posts/'))
const showToc = computed(() => isPost.value && tocLinks.value.length > 0)
const showComment = computed(() => isPost.value || route.path === '/link')

const btnClass = 'pointer-events-auto flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-slate-300/50 bg-white/85 text-slate-600 shadow-[0_2px_12px_rgb(0_0_0/0.06)] transition sm:backdrop-blur-md duration-300 hover:-translate-y-px hover:scale-105 hover:border-slate-400/60 hover:bg-white hover:text-slate-800 dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-slate-800/90 dark:hover:text-white sm:h-[42px] sm:w-[42px]'

function onScroll() {
  scrolled.value = window.scrollY > 200
}

onMounted(() => {
  mounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(() => route.path, () => {
  tocOpen.value = false
})

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toComment() {
  const el = document.querySelector('.twikoo-host') || document.querySelector('[id*="comment"]')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function toAnchor(id?: string) {
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  tocOpen.value = false
}
</script>

<template>
  <div class="pointer-events-none fixed bottom-7 right-4 z-40 flex flex-col gap-2.5 sm:bottom-10 sm:right-6">
    <button :class="btnClass" title="切换主题" aria-label="切换主题" @click="toggle">
      <IconSunLow v-if="mounted && isDark" class="h-[18px] w-[18px]" :stroke="1.8" />
      <IconMoonStars v-else class="h-[18px] w-[18px]" :stroke="1.8" />
    </button>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 scale-90 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-2 scale-90 opacity-0"
    >
      <button
        v-show="mounted && showToc"
        :class="[btnClass, 'xl:hidden']"
        :tabindex="mounted && showToc ? 0 : -1"
        title="目录"
        aria-label="目录"
        @click="tocOpen = !tocOpen"
      >
        <IconList class="h-[18px] w-[18px]" :stroke="1.8" />
      </button>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 scale-90 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-2 scale-90 opacity-0"
    >
      <button
        v-show="mounted && showComment"
        :class="btnClass"
        :tabindex="mounted && showComment ? 0 : -1"
        title="查看评论"
        aria-label="查看评论"
        @click="toComment"
      >
        <IconMessageCircle class="h-[18px] w-[18px]" :stroke="1.8" />
      </button>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 scale-90 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-2 scale-90 opacity-0"
    >
      <button
        v-show="mounted && scrolled"
        :class="btnClass"
        :tabindex="mounted && scrolled ? 0 : -1"
        title="回到顶部"
        aria-label="回到顶部"
        @click="toTop"
      >
        <IconArrowNarrowUp class="h-[18px] w-[18px]" :stroke="1.8" />
      </button>
    </Transition>
  </div>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-x-3 scale-95 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="translate-x-3 scale-95 opacity-0"
    >
      <div v-if="tocOpen" class="fixed inset-0 z-40" @click="tocOpen = false" />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-x-3 scale-95 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="translate-x-3 scale-95 opacity-0"
    >
      <div
        v-if="tocOpen"
        class="fixed bottom-8 right-16 z-40 flex max-h-[320px] w-[260px] flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95 sm:right-[4.5rem]"
      >
        <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
          <span class="text-[13px] font-bold text-slate-700 dark:text-slate-200">目录</span>
          <button
            class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭目录"
            @click="tocOpen = false"
          >
            <Icon name="close" class="h-3.5 w-3.5" />
          </button>
        </div>
        <ul class="flex-1 overflow-y-auto p-2">
          <li v-for="item in tocLinks" :key="item.id">
            <button
              class="block w-full truncate rounded-md px-2 py-1 text-left text-[13px] leading-relaxed text-slate-500 transition hover:bg-teal-50 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-900/30 dark:hover:text-teal-300"
              :class="item.depth && item.depth > 2 ? 'pl-6' : ''"
              @click="toAnchor(item.id)"
            >
              {{ item.text }}
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>
