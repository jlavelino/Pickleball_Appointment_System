<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Page header -->
      <div class="mb-5">
        <h1 class="page-title">Rent paddles</h1>
        <p class="page-subtitle">
          Tournament-grade composite paddles provided on-site.
          Skip if you have your own gear.
        </p>
      </div>

      <!-- Trust info banner -->
      <div class="info-banner mb-5">
        <div class="info-banner__icon">
          <span class="mdi mdi-shield-check-outline text-[18px] text-[#0B6623]"></span>
        </div>
        <p class="info-banner__text">
          Paddles are sanitized and inspected before every match session.
        </p>
      </div>

      <!-- Paddle list -->
      <div class="flex flex-col">
        <PaddleStepper
          v-for="p in store.paddles"
          :key="p.id"
          :paddle="p"
          :quantity="store.paddleQty[p.id] || 0"
          :hours="store.slotHours"
          @step="(dir: number) => store.setPaddleQty(p.id, dir)"
        />
      </div>
    </div>

    <BottomCTA
      :label="continueLabel"
      @click="goNext"
    >
      <template #above>
        <PriceTotalBar :show="true" />
      </template>
    </BottomCTA>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBookingStore } from '~/stores/booking'
import PaddleStepper from '~/components/booking/PaddleStepper.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'
import PriceTotalBar from '~/components/ui/PriceTotalBar.vue'

useHead({ title: 'Paddle rental — PickleBook' })

const store = useBookingStore()
if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

onMounted(async () => {
  await Promise.all([
    store.fetchCatalogs(),
    store.fetchAvailability(),
  ])
})

const continueLabel = computed(() => {
  if (store.paddleCount > 0) {
    return `Continue (${store.paddleCount} paddle${store.paddleCount > 1 ? 's' : ''} added)`
  }
  return 'Skip paddles · Continue'
})

function goNext() {
  navigateTo('/book/food')
}
</script>

<style scoped>
.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: 30px;
  font-weight: 700;
  color: #14231C;
  margin: 0;
  line-height: 1.15;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #66756D;
  margin: 6px 0 0;
  line-height: 1.5;
}

/* ── Info Banner ──────────────────────────────── */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #FFFFFF;
  border: 1px solid #DCE6D8;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px -2px rgba(20, 35, 28, 0.04);
}

.info-banner__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #E8F4D8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-banner__text {
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  color: #66756D;
  line-height: 1.45;
  margin: 0;
  padding-top: 6px;
}
</style>
