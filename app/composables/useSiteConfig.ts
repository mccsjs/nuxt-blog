import { siteConfig } from '#shared/site'

export const useSiteConfig = () => ({
  ...siteConfig,
  url: useRuntimeConfig().public.siteUrl,
})
