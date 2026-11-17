<script setup lang="ts">
const siteConfig = useBlogConfig()
const { data: links } = await useAsyncData('footer-links', () =>
  queryCollection('links').all(),
)

const startYear = new Date(siteConfig.siteStartDate).getFullYear()
const year = ref(new Date().getFullYear())
const uptime = ref('')

const motto = {
  title: '格言🧬',
  text: '你看，他们曾如此骄傲的活过，贯彻始终 — 以生命奏响了文明的颂歌。这是被称作英桀的人们的故事，是十三位逐火者未竟的旅途',
  cta: '前往见证十三英桀的终末',
  href: 'https://www.bilibili.com/video/BV1fY4y1F7GL',
}

const guessLinks = [
  { label: '我的朋友', to: '/link' },
  { label: '留点什么', to: '/link' },
  { label: '关于作者', to: '/about' },
  { label: '联系站长', to: '/contact' },
  { label: '隐私声明', to: '/privacy' },
  { label: '文章归档', to: '/archive' },
  { label: '文章分类', to: '/categories' },
  { label: '文章标签', to: '/tags' },
]

const recommended = computed(() =>
  (links.value || [])
    .filter(l => (l.recommended || '').toLowerCase() === 'true')
    .map(l => ({ name: l.name, url: l.url, avatar: l.avatar || l.screenshot || '' })),
)

const badges = [
  { title: '博客框架为 Nuxt', href: 'https://nuxt.com', img: '/badges/nuxt.svg' },
  { title: '本站已备案', href: 'https://beian.miit.gov.cn/', img: '/badges/beian.svg' },
  { title: '本站已公安网站备案', href: 'https://beian.mps.gov.cn/#/query/webSearch?code=32083002000282', img: '/badges/blue.svg' },
  { title: '本站已加入萌ICP，萌ICP备20230187号', href: 'https://icp.gov.moe/?keyword=20230187', img: '/badges/moe.svg' },
]

const copyrightRange = computed(() =>
  startYear < year.value ? `${startYear} - ${year.value}` : String(year.value),
)

let timer: ReturnType<typeof setInterval> | undefined

function updateUptime() {
  const diff = Date.now() - new Date(siteConfig.siteStartDate).getTime()
  if (diff <= 0) return
  const totalDays = Math.floor(diff / 86400000)
  const years = Math.floor(totalDays / 365)
  const days = totalDays % 365
  const pad = (n: number) => String(n).padStart(2, '0')
  const hours = pad(Math.floor((diff % 86400000) / 3600000))
  const minutes = pad(Math.floor((diff % 3600000) / 60000))
  const seconds = pad(Math.floor((diff % 60000) / 1000))
  const prefix = years > 0 ? `${years}年${days}天` : `${totalDays}天`
  uptime.value = `本站居然运行了${prefix}${hours}小时${minutes}分${seconds}秒`
}

onMounted(() => {
  year.value = new Date().getFullYear()
  updateUptime()
  timer = setInterval(updateUptime, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <footer class="relative z-10 mt-auto border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/50">
    <div class="mx-auto max-w-6xl px-4 pt-6 pb-1 sm:px-6">
      <div class="mb-3 flex flex-col text-left md:flex-row">
        <div class="flex flex-col px-3 py-2 md:flex-[2]">
          <div class="flex flex-col sm:flex-row">
            <div class="flex flex-col sm:mr-2 sm:flex-[1.4]">
              <p class="px-3 text-[0.8rem] font-bold text-slate-600 dark:text-slate-300">{{ motto.title }}</p>
              <div class="mt-2 w-full rounded-2xl px-4 py-3.5 sm:w-[85%]">
                <p class="text-[0.82rem] leading-[1.7] text-slate-500 dark:text-slate-400">{{ motto.text }}</p>
                <div class="mt-3">
                  <a
                    :href="motto.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block rounded-2xl bg-gradient-to-r from-amber-200/80 to-orange-200/70 py-1 text-center text-base font-semibold leading-6 text-amber-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:from-amber-300/90 hover:to-orange-300/80 hover:shadow-md dark:from-yellow-800/55 dark:to-yellow-800/30 dark:text-yellow-200/80 dark:hover:from-yellow-700/70 dark:hover:to-yellow-800/45"
                  >
                    {{ motto.cta }}
                  </a>
                </div>
              </div>
            </div>
            <div class="mt-6 flex flex-1 flex-col sm:mt-0">
              <p class="px-3 text-[0.8rem] font-bold text-slate-600 dark:text-slate-300">猜你想看💡</p>
              <ul class="m-0 mt-2 list-none p-0">
                <li v-for="(pair, i) in [guessLinks.slice(0, 2), guessLinks.slice(2, 4), guessLinks.slice(4, 6)]" :key="i" class="flex">
                  <NuxtLink
                    v-for="item in pair"
                    :key="item.label"
                    :to="item.to"
                    class="flex-1 whitespace-nowrap rounded-xl px-2 py-1 text-base text-slate-500 transition hover:translate-x-0.5 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300"
                  >
                    {{ item.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col px-3 py-2 md:mt-0 md:flex-1">
          <p class="text-[0.8rem] font-bold text-slate-600 dark:text-slate-300">推荐友链⌛</p>
          <div class="mt-3 flex flex-wrap gap-2.5">
            <a
              v-for="friend in recommended"
              :key="friend.name"
              :href="friend.url"
              :title="friend.name"
              target="_blank"
              rel="noopener noreferrer"
              class="relative block aspect-square w-[calc(20%-8px)] shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-800/70"
            >
              <img
                v-if="friend.avatar"
                :src="friend.avatar"
                :alt="friend.name"
                loading="lazy"
                class="h-full w-full object-cover"
              />
              <span v-if="friend.avatar" class="pointer-events-none absolute inset-0 dark:bg-black/10"></span>
              <span v-else class="flex h-full w-full items-center justify-center text-xl font-bold text-amber-600">{{ friend.name.slice(0, 1) }}</span>
            </a>
            <span
              title="广告位招租"
              class="block aspect-square w-[calc(20%-8px)] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src="/ggwzz.webp" alt="广告位招租" loading="lazy" class="h-full w-full object-cover" />
            </span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-base font-semibold text-slate-600 dark:text-slate-300">©{{ copyrightRange }} {{ siteConfig.name }}</p>
        <p v-if="uptime" class="mt-1.5 text-[0.82rem] font-bold tracking-wide text-slate-500 dark:text-slate-400">
          {{ uptime }}<span class="ml-0.5 inline-block animate-pulse">❤️</span>
        </p>
      </div>

      <div class="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <a v-for="badge in badges" :key="badge.title" :href="badge.href" target="_blank" rel="noopener noreferrer" :title="badge.title" class="inline-block transition-transform hover:scale-105">
          <img :src="badge.img" :alt="badge.title" loading="lazy" class="h-5 w-auto rounded" />
        </a>
      </div>
    </div>
  </footer>
</template>
