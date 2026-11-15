---
title: Vue 3 组合式 API 的实用小技巧
description: 五个让组合式 API 写起来更顺手的小技巧：响应式解构、副作用清理、封装可复用逻辑。
date: 2026-08-05
tags: [Vue, TypeScript]
category: 前端开发
---

组合式 API 用久了会积累一些心得，这篇分享五个我自己最常用的小技巧。

## 1. 响应式解构：toRefs

解构 `reactive` 对象会丢失响应性，用 `toRefs` 保住它：

```ts
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: '清风' })
const { count, name } = toRefs(state)

count.value++ // 依然响应式
```

## 2. 副作用记得清理

`watch`、`onMounted` 里注册的事件监听要成对清理，否则组件卸载后内存泄漏：

```ts
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
```

## 3. 把状态封装成 Composable

把「主题切换」这类逻辑抽成 `useTheme`，组件里只关心 UI：

```ts
export const useTheme = () => {
  const isDark = useState('theme-dark', () => false)
  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }
  return { isDark, toggle }
}
```

## 4. computed 比手动 watch 更简洁

派生数据优先用 `computed`，而不是 `watch` + 手动赋值：

```ts
// ✗ 啰嗦
const fullName = ref('')
watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})

// ✓ 简洁且自动追踪
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

## 5. defineModel 简化双向绑定

Vue 3.4 之后，子组件的双向绑定不用再写 `emit('update:modelValue')`：

```vue
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

---

这些技巧都很小，但组合起来能让代码清爽很多。如果你也有私藏技巧，欢迎交流。
