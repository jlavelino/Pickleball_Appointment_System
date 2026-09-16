<template>
  <header class="header-bar">

    <!-- Back button -->
    <button
      type="button"
      @click="handleBack"
      aria-label="Go back"
      class="back-btn"
      :class="canGoBack ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <span class="mdi mdi-arrow-left text-[18px] back-icon"></span>
    </button>

    <!-- Logo & Wordmark — centered -->
    <NuxtLink to="/" class="logo-link">
      <img
        src="~/assets/images/pickle_logo.png"
        alt="PickleBook icon"
        class="logo-icon"
        style="height:32px;width:auto;display:block;max-width:none;"
      />
      <img
        src="~/assets/images/pickle_name.png"
        alt="PickleBook"
        class="logo-name"
        style="height:22px;width:auto;display:block;max-width:none;"
      />
    </NuxtLink>

    <!-- Check booking link (right side) — only visible on the home page -->
    <NuxtLink
      to="/lookup"
      aria-label="Check booking"
      class="lookup-btn"
      :class="isHomePage ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <span class="mdi mdi-magnify text-[17px]"></span>
    </NuxtLink>

  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route  = useRoute()
const router = useRouter()

const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/book'
})

const canGoBack = computed(() => {
  const path = route.path
  return path !== '/' && path !== '/book' && !path.includes('/confirmed')
})

function handleBack() {
  if (route.path === '/lookup') {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
    return
  }
  router.back()
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 6px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon {
  height: 32px;
  width: auto;
  object-fit: contain;
  flex: none;
}

.logo-name {
  height: 20px;
  width: auto;
  object-fit: contain;
}

.lookup-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--cream-card);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  text-decoration: none;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(34, 51, 24, 0.08);
}
.lookup-btn:hover {
  background: var(--sold);
  border-color: rgba(34, 51, 24, 0.25);
  color: var(--relish-dark);
  box-shadow: 0 2px 6px rgba(34, 51, 24, 0.12);
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--cream-card);
  color: var(--ink);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(34, 51, 24, 0.08);
  flex: none;
  padding: 0;
}

.back-icon {
  transform: translateX(-0.5px);
  transition: transform 0.15s ease;
}

.back-btn:hover {
  background: var(--sold);
  border-color: rgba(34, 51, 24, 0.25);
  color: var(--relish-dark);
  box-shadow: 0 2px 6px rgba(34, 51, 24, 0.12);
}

.back-btn:hover .back-icon {
  transform: translateX(-2px);
}

.back-btn:active {
  transform: scale(0.92);
}
</style>
