<template>
  <header class="header-bar">
    <!-- Home Header: Centered logo, search icon on right -->
    <template v-if="isHomePage">
      <!-- Left spacer to balance the right search icon -->
      <div class="w-[42px] shrink-0"></div>

      <!-- Logo centered -->
      <NuxtLink to="/" class="logo-link flex-1 flex items-center justify-center" aria-label="PickleBook Home">
        <div class="flex items-center gap-2.5">
          <img
            src="~/assets/images/pickle_logo.png"
            alt="PickleBook Icon"
            class="logo-icon"
          />
          <img
            src="~/assets/images/pickle_name.png"
            alt="PickleBook"
            class="logo-name"
          />
        </div>
      </NuxtLink>

      <!-- Right: Search icon -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/lookup"
          aria-label="Search bookings"
          class="btn-icon"
          title="Search bookings"
        >
          <span class="mdi mdi-magnify text-[19px]"></span>
        </NuxtLink>
      </div>
    </template>

    <!-- Booking Flow Subpages: Back button + Stepper -->
    <template v-else-if="isBookingFlow">
      <button
        type="button"
        @click="handleBack"
        aria-label="Go back"
        class="btn-icon"
      >
        <span class="mdi mdi-arrow-left text-[19px]"></span>
      </button>

      <div class="flex-1 px-2">
        <BookingStepper :current-step="currentBookingStep" />
      </div>

      <!-- Balanced spacer -->
      <div class="w-[42px] shrink-0"></div>
    </template>

    <!-- Other Pages (e.g. Lookup) -->
    <template v-else>
      <button
        type="button"
        @click="handleBack"
        aria-label="Go back"
        class="btn-icon"
      >
        <span class="mdi mdi-arrow-left text-[19px]"></span>
      </button>
      <NuxtLink to="/" class="logo-link mx-auto">
        <img
          src="~/assets/images/pickle_logo.png"
          alt="PickleBook icon"
          class="logo-icon"
        />
        <img
          src="~/assets/images/pickle_name.png"
          alt="PickleBook"
          class="logo-name"
        />
      </NuxtLink>
      <div class="w-[42px] shrink-0"></div>
    </template>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BookingStepper from '~/components/ui/BookingStepper.vue'

const route  = useRoute()
const router = useRouter()

const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/book'
})

const isBookingFlow = computed(() => {
  const p = route.path
  return p.startsWith('/book/') && !p.includes('/confirmed')
})

const currentBookingStep = computed(() => {
  const p = route.path
  if (p === '/' || p === '/book' || p === '/book/index') return 1  // Date & Time
  if (p.startsWith('/book/court')) return 2                          // Court
  if (p.startsWith('/book/paddles')) return 3                        // Paddles
  if (p.startsWith('/book/food')) return 4                           // Snacks
  if (p.startsWith('/book/summary')) return 5                        // Review
  if (p.startsWith('/book/details') || p.startsWith('/book/payment') || p.startsWith('/book/confirmed')) return 6
  return 1
})

function handleBack() {
  if (route.path === '/lookup') {
    if (typeof window !== 'undefined' && window.history.length > 1) {
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
  padding: 14px 20px 8px;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  max-width: 190px;
}

.logo-icon {
  height: 34px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-name {
  height: 22px;
  width: auto;
  object-fit: contain;
}
</style>
