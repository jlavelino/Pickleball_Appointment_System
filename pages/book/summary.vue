<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Your booking
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-4 leading-[1.4]">
        Everything in one checkout
      </p>

      <HoldTimer :seconds="store.holdSeconds" />

      <!-- Court Card -->
      <div class="bg-[--cream-card] border border-[--line] rounded-card p-[18px] mb-4 shadow-[0_2px_12px_-4px_rgba(34,51,24,0.1)]">
        <div class="font-display font-semibold text-[19px]">{{ store.courtNamesLabel || store.selectedCourt?.name }}</div>
        <div class="text-ink-soft text-[14px] mt-0.5">
          {{ store.dateLabel }} · {{ store.slotRangeLabel }}
        </div>
        <!-- Court individual badges if multiple courts chosen -->
        <div v-if="store.courtIds.length > 1" class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            v-for="c in store.selectedCourts"
            :key="c.id"
            class="px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-[var(--cream)] text-[var(--ink)] border border-[var(--line)]"
          >
            {{ c.name }} · ₱{{ c.price }}/hr
          </span>
        </div>
      </div>

      <!-- Line items breakdown -->
      <div class="bg-[--cream-card] border border-[--line] rounded-card p-[18px] mb-4 shadow-[0_2px_12px_-4px_rgba(34,51,24,0.1)]">
        <!-- Court rental -->
        <div class="flex justify-between items-start py-3 border-b border-line">
          <div>
            <div class="text-[15px] font-medium">Court rental</div>
            <div class="text-gray text-[13px] mt-0.5">
              {{ store.courtIds.length > 0 ? store.courtIds.length : 1 }} {{ (store.courtIds.length > 1) ? 'courts' : 'court' }} × {{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}
            </div>
          </div>
          <div class="font-semibold text-[15px]">₱{{ store.courtTotal }}</div>
        </div>

        <!-- Paddles if any -->
        <div v-if="store.paddleCount > 0" class="flex justify-between items-start py-3 border-b border-line">
          <div>
            <div class="text-[15px] font-medium">{{ mainPaddleLine.main }}</div>
            <div class="text-gray text-[13px] mt-0.5">
              <span v-if="mainPaddleLine.sub">{{ mainPaddleLine.sub }} · </span>
              <span>{{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}</span>
            </div>
          </div>
          <div class="font-semibold text-[15px]">₱{{ store.paddleTotal }}</div>
        </div>

        <!-- Food if any -->
        <div v-if="store.foodCount > 0" class="flex justify-between items-start py-3 border-b border-line">
          <div>
            <div class="text-[15px] font-medium">{{ mainFoodLine.main }}</div>
            <div v-if="mainFoodLine.sub" class="text-gray text-[13px] mt-0.5">{{ mainFoodLine.sub }}</div>
          </div>
          <div class="font-semibold text-[15px]">₱{{ store.foodTotal }}</div>
        </div>

        <!-- Grand total -->
        <div class="flex justify-between items-center pt-3.5 mt-0.5 font-display">
          <div class="font-semibold text-[17px]">Total</div>
          <div class="font-bold text-[22px]">₱{{ store.grandTotal }}</div>
        </div>
      </div>
    </div>

    <BottomCTA
      label="Proceed to payment"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useBookingStore, PADDLES, ALL_FOOD } from '~/stores/booking'
import HoldTimer from '~/components/ui/HoldTimer.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'Your booking — PickleBook' })

const store = useBookingStore()
if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    store.decrementHold()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const mainPaddleLine = computed(() => {
  const active = PADDLES.filter(p => store.paddleQty[p.id] > 0)
    .sort((a, b) => (b.price * store.paddleQty[b.id]) - (a.price * store.paddleQty[a.id]))
  if (!active.length) return { main: '', sub: '' }
  const main = `${store.paddleQty[active[0].id]} × ${active[0].name}`
  const sub = active.slice(1).map(p => `${store.paddleQty[p.id]} × ${p.name}`).join(', ')
  return { main, sub }
})

const mainFoodLine = computed(() => {
  const active = ALL_FOOD.filter(f => store.foodQty[f.id] > 0)
    .sort((a, b) => (b.price * store.foodQty[b.id]) - (a.price * store.foodQty[a.id]))
  if (!active.length) return { main: '', sub: '' }
  const main = `${store.foodQty[active[0].id]} × ${active[0].name}`
  const sub = active.slice(1).map(f => `${store.foodQty[f.id]} × ${f.name}`).join(', ')
  return { main, sub }
})

function goNext() {
  navigateTo('/book/details')
}
</script>
