<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Pre-order food
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">
        Ready by your {{ store.selectedSlot?.label || '8:00 AM' }} session
      </p>

      <template v-for="g in store.foodGroups" :key="g.label">
        <div class="text-[12.5px] tracking-[0.04em] uppercase text-gray font-bold mt-[18px] mb-1 first:mt-0">
          {{ g.label }}
        </div>
        <FoodItemRow
          v-for="f in g.items"
          :key="f.id"
          :food="f"
          :quantity="store.foodQty[f.id] || 0"
          @step="(dir) => store.setFoodQty(f.id, dir)"
        />
      </template>
    </div>

    <BottomCTA
      :label="store.foodCount > 0 ? 'Review order' : 'Add food, or skip'"
      @click="goNext"
    >
      <template #above>
        <PriceTotalBar :show="true" />
      </template>
    </BottomCTA>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import FoodItemRow from '~/components/booking/FoodItemRow.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'
import PriceTotalBar from '~/components/ui/PriceTotalBar.vue'

useHead({ title: 'Pre-order food — PickleBook' })

const store = useBookingStore()
if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}


function goNext() {
  store.startHold()
  navigateTo('/book/summary')
}
</script>
