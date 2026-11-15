<template>
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div class="blob absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-teal-200/50 dark:bg-teal-700/20 blur-3xl"></div>
    <div class="blob-slow absolute top-1/4 -right-32 h-[30rem] w-[30rem] rounded-full bg-sky-200/50 dark:bg-sky-800/20 blur-3xl"></div>
    <div class="blob absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-emerald-200/40 dark:bg-emerald-800/15 blur-3xl"></div>
    <svg class="absolute inset-0 h-full w-full opacity-[0.5] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="rgb(13 148 136 / 0.16)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  </div>
</template>
