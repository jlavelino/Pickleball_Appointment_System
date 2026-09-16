<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <div class="mt-1.5 mb-5">
        <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-1">
          Your booking
        </h1>
        <p class="text-ink-soft text-[14px] m-0 leading-[1.4]">
          Review everything before proceeding to payment
        </p>
      </div>

      <!-- Hold Timer -->
      <HoldTimer :seconds="store.holdSeconds" />

      <!-- Court Hero Card -->
      <div class="relative bg-gradient-to-br from-[#1E3314] via-[#2A481B] to-[#1E3314] rounded-2xl p-[18px] mb-4 shadow-[0_6px_20px_-6px_rgba(34,51,24,0.4)] overflow-hidden">
        <!-- Background subtle texture -->
        <div class="absolute top-0 right-0 w-24 h-24 rounded-full bg-lime/10 -translate-y-1/2 translate-x-1/2 blur-xl pointer-events-none"></div>

        <div class="relative">
          <!-- Court Tag -->
          <div class="flex items-center gap-2 mb-2.5">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime/20 border border-lime/30 text-lime text-[11px] font-bold tracking-wide uppercase">
              <span class="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"></span>
              Court Reserved
            </span>
          </div>

          <div class="font-display font-bold text-[22px] text-white leading-tight mb-0.5">
            {{ store.courtNamesLabel || store.selectedCourt?.name || 'Court' }}
          </div>

          <div class="text-white/70 text-[14px] flex items-center gap-1.5">
            <span class="mdi mdi-clock-outline text-[13px] text-white/70 flex-shrink-0"></span>
            {{ store.slotRangeLabel }} · {{ store.dateLabel }}
          </div>

          <!-- Multi-court badges -->
          <div v-if="store.courtIds.length > 1" class="flex flex-wrap gap-1.5 mt-3">
            <span
              v-for="c in store.selectedCourts"
              :key="c.id"
              class="px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-white/15 text-white/90 border border-white/20"
            >
              {{ c.name }} · ₱{{ c.price }}/hr
            </span>
          </div>
        </div>
      </div>

      <!-- Line items breakdown -->
      <div class="bg-cream-card border border-line rounded-card shadow-[0_2px_12px_-4px_rgba(34,51,24,0.08)] overflow-hidden mb-4">
        <div class="px-[18px] py-3 border-b border-line bg-cream/40">
          <span class="text-[11px] font-bold tracking-wider uppercase text-ink-soft">Order breakdown</span>
        </div>

        <!-- Court rental -->
        <div class="flex justify-between items-start px-[18px] py-3.5 border-b border-line/60">
          <div>
            <div class="text-[14.5px] font-medium text-ink">Court rental</div>
            <div class="text-gray text-[12.5px] mt-0.5">
              {{ store.courtIds.length > 0 ? store.courtIds.length : 1 }} {{ (store.courtIds.length > 1) ? 'courts' : 'court' }} × {{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}
            </div>
          </div>
          <div class="font-semibold text-[15px] text-ink">₱{{ store.courtTotal.toLocaleString() }}</div>
        </div>

        <!-- Paddles if any -->
        <div v-if="store.paddleCount > 0" class="flex justify-between items-start px-[18px] py-3.5 border-b border-line/60">
          <div>
            <div class="text-[14.5px] font-medium text-ink">{{ mainPaddleLine.main }}</div>
            <div class="text-gray text-[12.5px] mt-0.5">
              <span v-if="mainPaddleLine.sub">{{ mainPaddleLine.sub }} · </span>
              <span>{{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}</span>
            </div>
          </div>
          <div class="font-semibold text-[15px] text-ink">₱{{ store.paddleTotal.toLocaleString() }}</div>
        </div>

        <!-- Food if any -->
        <div v-if="store.foodCount > 0" class="flex justify-between items-start px-[18px] py-3.5 border-b border-line/60">
          <div>
            <div class="text-[14.5px] font-medium text-ink">{{ mainFoodLine.main }}</div>
            <div v-if="mainFoodLine.sub" class="text-gray text-[12.5px] mt-0.5">{{ mainFoodLine.sub }}</div>
          </div>
          <div class="font-semibold text-[15px] text-ink">₱{{ store.foodTotal.toLocaleString() }}</div>
        </div>

        <!-- Grand total -->
        <div class="flex justify-between items-center px-[18px] py-4 bg-cream/30">
          <div class="font-semibold text-[16px] text-ink font-display">Total</div>
          <div class="font-bold text-[24px] text-ink font-display">₱{{ store.grandTotal.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Summary Checklist -->
      <div class="flex flex-col gap-1.5 mb-1">
        <div class="flex items-center gap-2 text-[12.5px] text-ink-soft">
          <div class="w-4 h-4 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</div>
          <span>No hidden fees — price is final</span>
        </div>
        <div class="flex items-center gap-2 text-[12.5px] text-ink-soft">
          <div class="w-4 h-4 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</div>
          <span>Court instantly confirmed after payment</span>
        </div>
        <div class="flex items-center gap-2 text-[12.5px] text-ink-soft">
          <div class="w-4 h-4 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</div>
          <span>Digital match pass sent immediately</span>
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
import { useBookingStore, type PaddleItem, type FoodItem } from '~/stores/booking'
import HoldTimer from '~/components/ui/HoldTimer.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

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
  const active = store.paddles.filter((p: PaddleItem) => (store.paddleQty[p.id] || 0) > 0)
    .sort((a: PaddleItem, b: PaddleItem) => (b.price * (store.paddleQty[b.id] || 0)) - (a.price * (store.paddleQty[a.id] || 0)))
  if (!active.length) return { main: '', sub: '' }
  const main = `${store.paddleQty[active[0].id]} × ${active[0].name}`
  const sub = active.slice(1).map((p: PaddleItem) => `${store.paddleQty[p.id]} × ${p.name}`).join(', ')
  return { main, sub }
})

const mainFoodLine = computed(() => {
  const active = store.allFood.filter((f: FoodItem) => (store.foodQty[f.id] || 0) > 0)
    .sort((a: FoodItem, b: FoodItem) => (b.price * (store.foodQty[b.id] || 0)) - (a.price * (store.foodQty[a.id] || 0)))
  if (!active.length) return { main: '', sub: '' }
  const main = `${store.foodQty[active[0].id]} × ${active[0].name}`
  const sub = active.slice(1).map((f: FoodItem) => `${store.foodQty[f.id]} × ${f.name}`).join(', ')
  return { main, sub }
})

function goNext() {
  navigateTo('/book/details')
}
</script>
