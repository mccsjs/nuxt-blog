<script setup lang="ts">
const site = useSiteConfig()
const blog = useBlogConfig()
const route = useRoute()

const wideLayout = computed(() => /^\/posts\/[^/]+$/.test(route.path))

useSchemaOrg([
  {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: blog.name,
    description: blog.description,
    inLanguage: 'zh-CN',
  },
  {
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: blog.author,
    url: `${site.url}/`,
    image: `${site.url}${blog.avatar}`,
    sameAs: blog.socials.filter(s => /^https?:\/\//.test(s.url)).map(s => s.url),
  },
])
</script>

<template>
  <div class="relative min-h-screen flex flex-col">
    <SiteBackground />
    <Header />
    <main
      class="relative z-10 flex-1 w-full mx-auto px-4 sm:px-6 pt-24 pb-16"
      :class="wideLayout ? 'max-w-[1200px]' : 'max-w-6xl'"
    >
      <Breadcrumb />
      <NuxtPage />
    </main>
    <Footer />
    <FloatingBar />
  </div>
</template>
