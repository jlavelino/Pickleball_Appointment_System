<template>
  <header class="header-bar">

    <!-- Back button -->
    <button
      type="button"
      @click="handleBack"
      aria-label="Back"
      class="back-btn"
      :class="canGoBack ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      ←
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

    <!-- Spacer to balance back button -->
    <div class="back-spacer" aria-hidden="true"></div>

  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route  = useRoute()
const router = useRouter()

const canGoBack = computed(() => {
  const path = route.path
  return path !== '/' && path !== '/book' && !path.includes('/confirmed')
})

function handleBack() {
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

.back-spacer {
  width: 34px;
  height: 34px;
  flex: none;
}

.back-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s;
  box-shadow: none;
  flex: none;
}
.back-btn:hover {
  background: var(--ink);
  color: var(--cream);
}
</style>
