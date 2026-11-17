<script setup lang="ts">
const siteConfig = useSiteConfig()

useSeoMeta({ title: `关于 - ${siteConfig.name}`, description: `关于 ${siteConfig.author}` })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-8 text-center">
      <NuxtImg
        :src="siteConfig.avatar"
        alt="头像"
        width="96"
        height="96"
        format="webp"
        class="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-soft-lg dark:border-slate-800"
      />
      <h1 class="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">关于我</h1>
    </section>

    <div class="fade-up rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
      <div class="prose prose-slate max-w-none dark:prose-invert">
        <h2>站长简介</h2>
        <p>
          你好，这里是 {{ siteConfig.author }}。{{ siteConfig.description }}
        </p>
        <p>
          博客基于 Nuxt 4 + Nuxt Content + Tailwind CSS 4 搭建，运行在纯静态架构上：
          文章用 Markdown 维护、构建期自动生成页面，评论区由 Twikoo 提供服务。
        </p>

        <h2>联系方式</h2>
        <p>
          交换友链或者随便聊聊，欢迎通过<NuxtLink to="/contact">联系页</NuxtLink>找到我
          （邮箱与社交平台均可用）。我一般会在 1~3 天内回复。
        </p>
        <ul>
          <li v-for="social in siteConfig.socials" :key="social.name">
            <a
              :href="social.url"
              :target="social.url.startsWith('mailto:') ? undefined : '_blank'"
              :rel="social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
            >{{ social.name }}</a>
          </li>
        </ul>

        <h2>声明</h2>
        <p>
          本站所有原创文章如无特殊说明均采用知识共享署名-非商业性使用-相同方式共享 4.0
          国际许可协议（CC BY-NC-SA 4.0），转载时请注明出处与原文链接。
          关于数据处理方式，请参阅<NuxtLink to="/privacy">隐私声明</NuxtLink>。
        </p>
      </div>
    </div>
  </div>
</template>
