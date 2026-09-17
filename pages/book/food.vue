<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Step tracker pill -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-card border border-line text-[11.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
        <span>Step 3 of 4 · Refreshments</span>
      </div>

      <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
        Pre-order snacks & drinks
      </h1>
      <p class="text-ink-soft text-[14px] m-0 mb-4 leading-relaxed">
        Chilled and delivered court-side prior to your {{ store.selectedSlot?.label || 'game' }} match.
      </p>

      <!-- Facility delivery pill banner -->
      <div class="p-3 rounded-2xl bg-cream-card border border-line flex items-center gap-3 mb-4 shadow-xs">
        <div class="w-8 h-8 rounded-xl bg-sold flex items-center justify-center text-relish-dark shrink-0">
          <span class="mdi mdi-snowflake text-[16px]"></span>
        </div>
        <div class="text-[12.5px] text-ink-soft leading-snug">
          Items will be kept on ice and ready at your reserved court bench upon arrival.
        </div>
      </div>

      <!-- Food groups listing -->
      <template v-for="g in store.foodGroups" :key="g.label">
        <div class="flex items-center gap-2 mt-4 mb-2.5">
          <span class="text-[11.5px] font-bold tracking-wider uppercase text-ink-soft">
            {{ g.label }}
          </span>
          <div class="h-px bg-line/60 flex-1"></div>
        </div>

        <FoodItemRow
          v-for="f in g.items"
          :key="f.id"
          :food="f"
          :quantity="store.foodQty[f.id] || 0"
          @step="(dir: number) => store.setFoodQty(f.id, dir)"
        />
      </template>
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
import FoodItemRow from '~/components/booking/FoodItemRow.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'
import PriceTotalBar from '~/components/ui/PriceTotalBar.vue'

useHead({ title: 'Pre-order food — PickleBook' })

const store = useBookingStore()
if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

onMounted(() => {
  store.fetchCatalogs()
})

const continueLabel = computed(() => {
  if (store.foodCount > 0) {
    return `Review order (${store.foodCount} item${store.foodCount > 1 ? 's' : ''})`
  }
  return 'Skip refreshments · Continue'
})

function goNext() {
  store.startHold()
  navigateTo('/book/summary')
}
</script>
