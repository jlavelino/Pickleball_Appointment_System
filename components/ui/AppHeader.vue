<template>
  <header class="flex items-center justify-between px-[22px] pt-[22px] pb-[6px]">
    <button
      type="button"
      @click="handleBack"
      aria-label="Back"
      class="w-[34px] h-[34px] rounded-full border border-line bg-white flex items-center justify-center cursor-pointer text-base text-ink transition-opacity shadow-sm"
      :class="canGoBack ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      ←
    </button>

    <NuxtLink to="/" class="font-display font-bold text-[21px] tracking-[0.5px] flex items-center gap-1.5 text-ink">
      <!-- Pickleball Ball SVG -->
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
        <path d="M6 24C6 14 14 6 24 6C32 6 36 12 34 20C32 29 22 36 12 34C7 33 5 29 6 24Z" fill="#96C33E" stroke="#38591A" stroke-width="2"/>
        <circle cx="15.5" cy="20.5" r="1.5" fill="#38591A"/>
        <circle cx="22" cy="15.5" r="1.5" fill="#38591A"/>
        <circle cx="19.5" cy="25.5" r="1.5" fill="#38591A"/>
        <circle cx="27" cy="21.5" r="1.5" fill="#38591A"/>
      </svg>
      <span>DI<span class="text-relish-dark">N</span>K</span>
    </NuxtLink>

    <!-- Avatar with Pickleball Hole Ring -->
    <div class="w-[32px] h-[32px] rounded-full bg-ink flex items-center justify-center flex-none">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#96C33E" stroke-width="1.4"/>
        <circle cx="5.6" cy="6" r="0.9" fill="#96C33E"/>
        <circle cx="9.8" cy="5" r="0.9" fill="#96C33E"/>
        <circle cx="8.6" cy="9.2" r="0.9" fill="#96C33E"/>
        <circle cx="5.8" cy="10.4" r="0.9" fill="#96C33E"/>
      </svg>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const canGoBack = computed(() => {
  const path = route.path
  return path !== '/' && path !== '/book' && !path.includes('/confirmed')
})

function handleBack() {
  router.back()
}
</script>
