<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Step tracker pill -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-card border border-line text-[11.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
        <span>Step 2 of 4 · Gear Rental</span>
      </div>

      <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
        Rent paddles
      </h1>
      <p class="text-ink-soft text-[14px] m-0 mb-4 leading-relaxed">
        Tournament-grade composite paddles provided on-site. Skip if you have your own gear.
      </p>

      <!-- Trust info pill banner -->
      <div class="p-3 rounded-2xl bg-cream-card border border-line flex items-center gap-3 mb-4 shadow-xs">
        <div class="w-8 h-8 rounded-xl bg-sold flex items-center justify-center text-relish-dark shrink-0">
          <span class="mdi mdi-shield-check-outline text-[16px]"></span>
        </div>
        <div class="text-[12.5px] text-ink-soft leading-snug">
          Paddles are sanitized and inspected before every match session.
        </div>
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
  return 'Skip paddles · Bring own'
})

function goNext() {
  navigateTo('/book/food')
}
</script>
