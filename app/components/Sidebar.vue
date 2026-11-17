<script setup lang="ts">
import { IconLayoutGrid, IconSpeakerphone } from '@tabler/icons-vue'

const siteConfig = useBlogConfig()

function countWords(node: unknown): number {
  let text = ''
  const walk = (n: unknown) => {
    if (typeof n === 'string') { text += n; return }
    if (Array.isArray(n)) {
      n.forEach((v, i) => { if (i !== 0) walk(v) })
      return
    }
    if (n && typeof n === 'object') Object.values(n).forEach(walk)
  }
  walk(node)
  const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const en = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9]+/g) || []).length
  return cn + en
}

const { data: stats } = await useAsyncData('sidebar-stats', async () => {
  const posts = await queryCollection('posts').select('path', 'category', 'tags', 'body').all()
  const cats = new Set<string>()
  const tags = new Set<string>()
  let words = 0
  for (const p of posts) {
    cats.add(p.category || '随笔')
    for (const t of p.tags || []) tags.add(t)
    words += countWords(p.body)
  }
  return {
    postCount: posts.length,
    catCount: cats.size,
    tagCount: tags.size,
    words,
  }
})

const runDays = computed(() => {
  const start = new Date(siteConfig.siteStartDate).getTime()
  return Math.max(0, Math.floor((Date.now() - start) / 86400000))
})

const fmtNum = (n: number) => n.toLocaleString('zh-CN')
const fmtWords = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)}w` : fmtNum(n))

function jsonp(url: string, timeout = 8000) {
  return new Promise<unknown>((resolve, reject) => {
    const name = `__cb_${Date.now()}_${Math.floor(Math.random() * 1e4)}`
    const script = document.createElement('script')
    const done = (fn: () => void) => {
      delete (window as Record<string, unknown>)[name]
      script.remove()
      fn()
    }
    const timer = setTimeout(() => done(() => reject(new Error('timeout'))), timeout)
    ;(window as Record<string, unknown>)[name] = (data: unknown) => {
      clearTimeout(timer)
      done(() => resolve(data))
    }
    script.onerror = () => {
      clearTimeout(timer)
      done(() => reject(new Error('jsonp error')))
    }
    script.src = url.replace('__CB__', name)
    document.body.appendChild(script)
  })
}

const mounted = ref(false)
const buildTime = useRuntimeConfig().public.buildTime as string
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | null = null

const greeting = ref('')
const welcome = ref<{ place?: string, dist?: number, ip?: string } | null>(null)

function timeGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 11) return '上午好，一日之计在于晨！'
  if (h >= 11 && h < 13) return '中午好，该摸鱼吃午饭了。'
  if (h >= 13 && h < 15) return '下午好，懒懒地睡个午觉吧！'
  if (h >= 15 && h < 16) return '三点几啦，一起饮茶呀！'
  if (h >= 16 && h < 19) return '夕阳无限好！'
  if (h >= 19 && h < 24) return '晚上好，夜生活嗨起来！'
  return '夜深了，早点休息，少熬夜。'
}

const HOME = { lng: 118.59232127, lat: 32.78868157 }
const MAP_KEY = 'MDKBZ-U7H6J-FBJFY-KD2ON-BDRI5-LIB5L'

function distance(lng1: number, lat1: number, lng2: number, lat2: number) {
  const R = 6371
  const rad = (d: number) => (d * Math.PI) / 180
  const a = { x: Math.cos(rad(lat1)) * Math.cos(rad(lng1)), y: Math.cos(rad(lat1)) * Math.sin(rad(lng1)), z: Math.sin(rad(lat1)) }
  const b = { x: Math.cos(rad(lat2)) * Math.cos(rad(lng2)), y: Math.cos(rad(lat2)) * Math.sin(rad(lng2)), z: Math.sin(rad(lat2)) }
  const c = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
  return Math.round((Math.asin(c / 2) * 2 * R))
}

onMounted(async () => {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
      .requestIdleCallback(loadVercount, { timeout: 3000 })
  } else {
    setTimeout(loadVercount, 0)
  }

  mounted.value = true
  now.value = Date.now()
  ticker = setInterval(() => { now.value = Date.now() }, 60000)

  greeting.value = timeGreeting()

  try {
    const res = await jsonp(
      `https://apis.map.qq.com/ws/location/v1/ip?key=${MAP_KEY}&output=jsonp&callback=__CB__`,
    ) as { status: number, result?: { ip: string, location: { lat: number, lng: number }, ad_info: { nation: string, province: string, city: string, district: string } } }
    if (res.status === 0 && res.result) {
      const { nation, province, city, district } = res.result.ad_info
      welcome.value = {
        place: nation === '中国' ? [province, city, district].filter(Boolean).join(' ') : nation,
        dist: distance(HOME.lng, HOME.lat, res.result.location.lng, res.result.location.lat),
        ip: res.result.ip,
      }
    }
  } catch {}
})

const route = useRoute()
watch(() => route.path, () => {
  nextTick(loadVercount)
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})

const updatedText = computed(() => {
  if (!mounted.value) return '刚刚'
  const ts = new Date(buildTime).getTime()
  if (!Number.isFinite(ts)) return '—'
  const diff = Math.max(0, now.value - ts)
  const min = 60000, hour = 3600000, day = 86400000
  if (diff < min) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / min)}分钟前`
  if (diff < day * 30) return `${Math.floor(diff / day)}天前`
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const infoRows = computed(() => [
  { label: '文章数目', value: fmtNum(stats.value?.postCount || 0) },
  { label: '运行时间', value: `${fmtNum(runDays.value)} 天` },
  { label: '本站总字数', value: fmtWords(stats.value?.words || 0) },
  { label: '本站访客数', html: '<span id="busuanzi_value_site_uv">—</span>' },
  { label: '本站总浏览量', html: '<span id="busuanzi_value_site_pv">—</span>' },
  { label: '最后更新', value: updatedText.value },
])

useHead({
  link: [{ rel: 'preconnect', href: 'https://vercount.one', crossorigin: '' }],
})

function loadVercount() {
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://events.vercount.one/js'
  s.onload = () => s.remove()
  document.head.appendChild(s)
}

const cardClass = 'overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80'
const barClass = 'h-1 w-full bg-gradient-to-r from-teal-500 to-teal-400/45'
const titleClass = 'mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200'
</script>

<template>
  <aside class="space-y-5">
    <!-- 资料卡 -->
    <section :class="cardClass">
      <div :class="barClass"></div>
      <div class="p-5 text-center">
        <NuxtLink to="/about" class="group relative mx-auto block h-[110px] w-[110px]" aria-label="关于我">
          <NuxtImg
            :src="siteConfig.avatar"
            :alt="siteConfig.author"
            width="220"
            height="220"
            format="webp"
            loading="lazy"
            class="h-[110px] w-[110px] rounded-full object-cover transition duration-300 group-hover:scale-105 group-hover:rotate-3"
          />
        </NuxtLink>
        <h3 class="mt-3 text-lg font-bold text-slate-800 dark:text-slate-100">{{ siteConfig.author }}</h3>
        <!-- 标语暂留空，启用时把 v-if="false" 去掉即可 -->
        <p v-if="false" class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ siteConfig.slogan }}</p>

        <div class="mt-4 flex items-center justify-around">
          <NuxtLink to="/posts" class="group flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition">
            <span class="text-lg font-bold tabular-nums text-slate-800 transition group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-300">{{ stats?.postCount || 0 }}</span>
            <span class="text-xs text-slate-400 transition group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-300">文章</span>
          </NuxtLink>
          <NuxtLink to="/tags" class="group flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition">
            <span class="text-lg font-bold tabular-nums text-slate-800 transition group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-300">{{ stats?.tagCount || 0 }}</span>
            <span class="text-xs text-slate-400 transition group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-300">标签</span>
          </NuxtLink>
          <NuxtLink to="/categories" class="group flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition">
            <span class="text-lg font-bold tabular-nums text-slate-800 transition group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-300">{{ stats?.catCount || 0 }}</span>
            <span class="text-xs text-slate-400 transition group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-300">分类</span>
          </NuxtLink>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            v-for="social in siteConfig.socials"
            :key="social.name"
            :href="social.url"
            :target="social.url.startsWith('mailto:') ? undefined : '_blank'"
            :rel="social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
            :aria-label="social.name"
            :title="social.name"
            class="inline-flex items-center justify-center text-slate-400 transition hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-300"
          >
            <Icon :name="social.icon" size="h-7 w-7" />
          </a>
        </div>
      </div>
    </section>

    <!-- 公告卡 -->
    <section :class="cardClass">
      <div :class="barClass"></div>
      <div class="p-5">
        <h4 :class="titleClass">
          <IconSpeakerphone :size="18" :stroke="1.8" class="text-rose-500" />
          公告
        </h4>
        <p class="mb-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {{ siteConfig.description }}
        </p>
        <div class="break-words rounded-[18px] p-2 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <template v-if="welcome">
            <div class="mb-1 font-semibold">🎉 欢迎 🎉</div>
            <p>
              欢迎来自
              <span class="font-semibold text-teal-600 dark:text-teal-400">{{ welcome.place }}</span>
              的小伙伴，{{ greeting }}您现在距离站长约
              <span class="font-semibold text-teal-600 dark:text-teal-400">{{ welcome.dist }}</span>
              公里，当前 IP 为
              <span class="cursor-pointer break-all font-semibold text-teal-600 blur-[5px] transition hover:blur-none dark:text-teal-400">{{ welcome.ip }}</span>
            </p>
          </template>
          <template v-else-if="greeting">
            <div class="mb-1 font-semibold">🎉 欢迎 🎉</div>
            <p>{{ greeting }}</p>
          </template>
          <span v-else class="text-slate-400 dark:text-slate-500">正在获取信息…</span>
        </div>
      </div>
    </section>

    <!-- 网站信息卡 -->
    <section :class="cardClass">
      <div :class="barClass"></div>
      <div class="p-5">
        <h4 :class="titleClass">
          <IconLayoutGrid :size="18" :stroke="1.8" class="text-teal-500" />
          网站信息
        </h4>
        <ul class="space-y-3 text-sm">
          <li v-for="row in infoRows" :key="row.label" class="flex items-center justify-between gap-3">
            <span class="text-slate-400 dark:text-slate-500">{{ row.label }}</span>
            <span v-if="row.html" class="font-semibold tabular-nums text-slate-700 dark:text-slate-200" v-html="row.html" />
            <span v-else class="font-semibold tabular-nums text-slate-700 dark:text-slate-200">{{ row.value }}</span>
          </li>
        </ul>
      </div>
    </section>
  </aside>
</template>
