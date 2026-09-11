<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Need paddles?
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">
        Optional — skip if you're bringing your own
      </p>

      <PaddleStepper
        v-for="p in PADDLES"
        :key="p.id"
        :paddle="p"
        :quantity="store.paddleQty[p.id] || 0"
        @step="(dir) => store.setPaddleQty(p.id, dir)"
      />
    </div>

    <BottomCTA
      :label="store.paddleCount > 0 ? 'Continue' : 'Skip paddles'"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { useBookingStore, PADDLES } from '~/stores/booking'
import PaddleStepper from '~/components/booking/PaddleStepper.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'Paddle rental — DINK' })

const store = useBookingStore()
if (store.courtId === null) {
  navigateTo('/book/court')
}

function goNext() {
  navigateTo('/book/food')
}
</script>
