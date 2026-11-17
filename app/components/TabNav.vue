<script setup lang="ts">
const route = useRoute()

const tabs = [
  { label: '文章', to: '/posts' },
  { label: '归档', to: '/archive' },
  { label: '分类', to: '/categories' },
  { label: '标签', to: '/tags' },
]

const navRef = ref<HTMLElement | null>(null)
const border = ref({ left: '0px', top: '0px', width: '0px', height: '0px', opacity: 0 })

const activeTo = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return tabs.find(t => path === t.to || path.startsWith(`${t.to}/`))?.to ?? null
})

function positionTo(el: HTMLElement) {
  const nav = navRef.value
  if (!nav) return
  const r = el.getBoundingClientRect()
  const n = nav.getBoundingClientRect()
  if (!r.width) return
  border.value = {
    left: `${r.left - n.left}px`,
    top: `${r.top - n.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    opacity: 1,
  }
}

function onItemEnter(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement | null
  if (el) positionTo(el)
}
function onLeave() {
  const el = navRef.value?.querySelector('a.active') as HTMLElement | null
  if (el) positionTo(el)
  else border.value = { ...border.value, opacity: 0 }
}

function reposition() {
  const el = navRef.value?.querySelector('a.active') as HTMLElement | null
  if (el) positionTo(el)
  else border.value = { ...border.value, opacity: 0 }
}

watch(activeTo, () => nextTick(reposition))

onMounted(() => {
  reposition()
  document.fonts?.ready.then(reposition)
  window.addEventListener('resize', reposition)
})
onBeforeUnmount(() => window.removeEventListener('resize', reposition))
</script>

<template>
  <nav ref="navRef" class="tab-nav" @mouseleave="onLeave">
    <div class="tab-nav-border" :style="border" aria-hidden="true"></div>
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab-item"
      :class="{ active: activeTo === tab.to }"
      @mouseenter="onItemEnter"
    >
      {{ tab.label }}
    </NuxtLink>
  </nav>
</template>

<style>
.tab-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: fit-content;
  margin: 0 auto 2rem;
  padding: 5px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.72);
  border: 1px solid rgb(0 0 0 / 0.06);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.04);
}
.dark .tab-nav {
  background: rgb(15 23 42 / 0.72);
  border-color: rgb(255 255 255 / 0.06);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
}
.tab-nav-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 9999px;
  border: 1.5px solid rgb(30 41 59 / 0.75);
  background: transparent;
  pointer-events: none;
  z-index: 0;
  transition: left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s;
}
.dark .tab-nav-border {
  border-color: rgb(203 213 225 / 0.7);
}
.tab-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(51 65 85);
  transition: color 0.15s ease;
}
.dark .tab-item {
  color: rgb(148 163 184);
}
.tab-item:hover {
  color: rgb(15 23 42);
}
.dark .tab-item:hover {
  color: rgb(241 245 249);
}
.tab-item.active {
  font-weight: 600;
  color: rgb(15 23 42);
}
.dark .tab-item.active {
  color: rgb(226 232 240);
}
</style>
