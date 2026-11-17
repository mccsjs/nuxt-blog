type FancyboxApi = {
  bind: (container: HTMLElement, selector: string, options?: Record<string, unknown>) => void
  unbind: (container: HTMLElement, selector?: string) => void
  close: () => void
}

let modulePromise: Promise<FancyboxApi> | null = null

async function loadFancybox() {
  if (!modulePromise) {
    modulePromise = (async () => {
      const [{ Fancybox }] = await Promise.all([
        import('@fancyapps/ui'),
        import('@fancyapps/ui/dist/fancybox/fancybox.css'),
      ])
      return Fancybox as unknown as FancyboxApi
    })()
  }
  return modulePromise
}

function decorateImages(container: HTMLElement) {
  for (const img of container.querySelectorAll('img')) {
    if (img.closest('[data-fancybox]')) continue
    const src = img.getAttribute('src')
    if (!src) continue

    const caption = img.getAttribute('alt') || ''
    const anchor = img.closest('a')

    if (anchor) {
      anchor.setAttribute('data-fancybox', 'gallery')
      anchor.setAttribute('href', src)
      anchor.setAttribute('data-caption', caption)
    } else {
      img.setAttribute('data-fancybox', 'gallery')
      img.setAttribute('data-src', src)
      img.setAttribute('data-caption', caption)
      img.classList.add('cursor-zoom-in')
    }
  }
}

export function useFancybox(container: Ref<HTMLElement | null>, dep?: () => unknown) {
  let bound: HTMLElement | null = null
  let seq = 0

  async function setup() {
    if (import.meta.server) return
    const el = container.value
    if (!el) return

    const current = ++seq
    const Fancybox = await loadFancybox()
    if (current !== seq || !container.value) return

    decorateImages(el)
    Fancybox.bind(el, '[data-fancybox]', {
      Carousel: { infinite: false },
      Images: { Panzoom: { maxScale: 4 } },
    })
    bound = el
  }

  async function teardown() {
    if (!bound || !modulePromise) return
    const Fancybox = await modulePromise
    Fancybox.unbind(bound, '[data-fancybox]')
    Fancybox.close()
    bound = null
  }

  async function refresh() {
    await teardown()
    await nextTick()
    await setup()
  }

  onMounted(setup)
  onBeforeUnmount(teardown)

  if (dep) {
    watch(dep, refresh)
  }

  return { refresh }
}
