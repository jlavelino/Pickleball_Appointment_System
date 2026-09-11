<template>
  <div class="min-h-screen flex justify-center py-8 px-3 font-sans text-ink">
    <div class="app-shell flex flex-col">
      <AppHeader />
      <main class="flex-1 px-[22px] pt-[14px] pb-0 overflow-y-auto">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/ui/AppHeader.vue'

useHead({
  title: 'DINK — Book a court',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ],
})
</script>
