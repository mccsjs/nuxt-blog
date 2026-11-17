import { siteConfig } from '#shared/site'

export const useBlogConfig = () => ({
  ...siteConfig,
  url: useRuntimeConfig().public.siteUrl,
})
