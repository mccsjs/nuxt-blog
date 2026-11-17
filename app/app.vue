<template>
  <div class="relative min-h-screen flex flex-col">
    <SiteBackground />
    <Header />
    <main class="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <NuxtPage />
    </main>
    <Footer />
    <FloatingBar />
  </div>
</template>
