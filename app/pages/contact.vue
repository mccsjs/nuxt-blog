<script setup lang="ts">
const siteConfig = useSiteConfig()

const email = siteConfig.socials.find(s => s.url.startsWith('mailto:'))
const emailAddr = email?.url.replace('mailto:', '') || ''
const httpSocials = siteConfig.socials.filter(s => /^https?:\/\//.test(s.url))

useSeoMeta({ title: `联系 - ${siteConfig.name}`, description: '联系站长 — 邮箱与社交平台' })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">联系</h1>
      <p class="mt-3 text-slate-500 dark:text-slate-400">想交流、交换友链或聊聊技术？欢迎来找我</p>
    </section>

    <div class="fade-up rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
      <div class="prose prose-slate max-w-none dark:prose-invert">
        <h2>邮箱</h2>
        <p>
          最可靠的联系方式是电子邮件：<a v-if="emailAddr" :href="`mailto:${emailAddr}`">{{ emailAddr }}</a><template v-else>见页脚联系方式</template>。
          无论是友链申请、技术交流还是文章勘误，都欢迎来信。我一般会在 1~3 天内回复，邮件请尽量说明来意，方便我第一时间处理。
        </p>

        <h2>社交平台</h2>
        <p>也可以在这些平台找到我（部分平台回复可能不及时）：</p>
        <ul>
          <li v-for="s in httpSocials" :key="s.name">
            <a
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
            >{{ s.name }}</a> — {{ s.url }}
          </li>
        </ul>

        <h2>关于友链</h2>
        <p>
          想和本站交换友链？请先按<NuxtLink to="/link">友链页</NuxtLink>的要求添加本站链接，再通过邮箱告知我。
          我会在看到后尽快添加。
        </p>

        <h2>其它</h2>
        <p>
          文章讨论请在对应文章页的评论区进行。需要了解本站的数据处理方式，请查看<NuxtLink to="/privacy">隐私声明</NuxtLink>。
        </p>
      </div>
    </div>
  </div>
</template>
