<script setup lang="ts">
const typed = ref('')
const source = ref('')

const TYPING_SPEED = 80
const DELETING_SPEED = 40
const PAUSE_AFTER_TYPE = 2500
const PAUSE_BEFORE_START = 600

let timer: ReturnType<typeof setTimeout> | null = null
let gen = 0

interface Hitokoto {
  hitokoto?: string
  from?: string
}

async function fetchHitokoto(): Promise<{ main: string, source: string }> {
  try {
    const res = await fetch('https://v1.hitokoto.cn')
    const data = (await res.json()) as Hitokoto
    return {
      main: data.hitokoto || '活在珍贵的人间',
      source: data.from ? `——出自 ${data.from}` : '',
    }
  } catch {
    const fallback = [
      { main: '活在珍贵的人间', source: '' },
      { main: '探索技术的边界', source: '' },
      { main: '记录生活的点滴', source: '' },
    ]
    return fallback[Math.floor(Math.random() * 3)]!
  }
}

onMounted(() => {
  const myGen = ++gen

  const tick = (phase: 'tm' | 'ts' | 'paused' | 'deleting', mainText: string, sourceText: string, dm: string, ds: string) => {
    if (gen !== myGen) return
    if (phase === 'tm') {
      if (dm.length < mainText.length) {
        dm = mainText.slice(0, dm.length + 1)
        typed.value = dm
        source.value = ds
        timer = setTimeout(() => tick('tm', mainText, sourceText, dm, ds), TYPING_SPEED)
      } else if (sourceText) {
        timer = setTimeout(() => tick('ts', mainText, sourceText, dm, ds), 400)
      } else {
        timer = setTimeout(() => tick('paused', mainText, sourceText, dm, ds), PAUSE_AFTER_TYPE)
      }
    } else if (phase === 'ts') {
      if (ds.length < sourceText.length) {
        ds = sourceText.slice(0, ds.length + 1)
        typed.value = dm
        source.value = ds
        timer = setTimeout(() => tick('ts', mainText, sourceText, dm, ds), TYPING_SPEED)
      } else {
        timer = setTimeout(() => tick('paused', mainText, sourceText, dm, ds), PAUSE_AFTER_TYPE)
      }
    } else if (phase === 'paused') {
      timer = setTimeout(() => tick('deleting', mainText, sourceText, dm, ds), 0)
    } else if (ds.length > 0) {
      ds = ds.slice(0, -1)
      typed.value = dm
      source.value = ds
      timer = setTimeout(() => tick('deleting', mainText, sourceText, dm, ds), DELETING_SPEED)
    } else if (dm.length > 0) {
      dm = dm.slice(0, -1)
      typed.value = dm
      source.value = ds
      timer = setTimeout(() => tick('deleting', mainText, sourceText, dm, ds), DELETING_SPEED)
    } else {
      timer = setTimeout(() => tick('tm', mainText, sourceText, '', ''), PAUSE_BEFORE_START)
    }
  }

  async function loop() {
    if (gen !== myGen) return
    const { main, source: src } = await fetchHitokoto()
    if (gen !== myGen) return
    timer = setTimeout(() => tick('tm', main, src, '', ''), PAUSE_BEFORE_START)
  }

  loop()
})

onBeforeUnmount(() => {
  gen++
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <p class="mt-3 max-w-xl text-slate-500 dark:text-slate-400">
    <span>{{ typed }}</span><span v-if="!source" class="ml-0.5 cursor-blink text-teal-400">|</span><span class="block min-h-[1.5em]" :class="source ? '' : 'invisible'"><span class="text-sm">{{ source }}</span><span v-if="source" class="ml-0.5 cursor-blink text-teal-400">|</span></span>
  </p>
</template>

<style scoped>
.cursor-blink {
  animation: hitokoto-blink 1s step-end infinite;
}
@keyframes hitokoto-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
