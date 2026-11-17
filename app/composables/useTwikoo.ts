const SDK_URL = 'https://s4.zstatic.net/npm/twikoo@2.0.17/dist/twikoo.min.js'

type TwikooInstance = {
  init: (options: { envId: string, el: HTMLElement, path?: string, lang?: string }) => void
}

declare global {
  interface Window {
    twikoo?: TwikooInstance
  }
}

let loader: Promise<void> | null = null

function patchEmotionFetch() {
  const original = window.fetch.bind(window)
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.includes('mccsjs.cn/owo.json')) {
      return original('/owo.json', init)
    }
    return original(input, init)
  }
}

function loadSdk() {
  if (loader) return loader
  if (import.meta.server) return Promise.resolve()

  patchEmotionFetch()

  loader = new Promise((resolve, reject) => {
    if (window.twikoo) return resolve()
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loader = null
      reject(new Error('Twikoo SDK 加载失败'))
    }
    document.head.appendChild(script)
  })
  return loader
}

export function useTwikoo(path: Ref<string>) {
  const envId = useRuntimeConfig().public.twikooEnvId as string
  const container = ref<HTMLElement | null>(null)
  const status = ref<'idle' | 'loading' | 'ready' | 'unconfigured' | 'error'>(
    envId ? 'idle' : 'unconfigured',
  )

  let seq = 0

  async function render() {
    if (!envId) {
      status.value = 'unconfigured'
      return
    }
    const current = ++seq
    status.value = 'loading'
    try {
      await loadSdk()
      if (current !== seq || !container.value) return
      if (!window.twikoo) throw new Error('Twikoo SDK 不可用')
      container.value.replaceChildren()
      window.twikoo.init({
        envId,
        el: container.value,
        path: path.value,
        lang: 'zh-CN',
      })
      status.value = 'ready'
    } catch {
      if (current === seq) status.value = 'error'
    }
  }

  return { container, status, render }
}
