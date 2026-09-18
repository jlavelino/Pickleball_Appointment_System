<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <!-- Page header -->
      <div class="mb-1">
        <h1 class="page-title">Your booking</h1>
        <p class="page-subtitle">
          Review everything before proceeding to player details
        </p>
      </div>

      <!-- Hold Timer -->
      <HoldTimer :seconds="store.holdSeconds" />

      <!-- Court Hero Card (Dark Forest Green) -->
      <div class="court-hero mb-4">
        <!-- Decorative glow -->
        <div class="court-hero__glow" aria-hidden="true"></div>

        <div class="relative">
          <!-- Pill badge -->
          <div class="flex items-center gap-2 mb-3">
            <span class="court-reserved-badge">
              <span class="court-reserved-badge__dot"></span>
              Court Reserved
            </span>
          </div>

          <!-- Court name -->
          <div class="court-hero__name">
            {{ store.courtNamesLabel || store.selectedCourt?.name || 'Court' }}
          </div>

          <!-- Slot & date -->
          <div class="court-hero__details">
            <span class="mdi mdi-clock-outline text-[14px] text-[#9ACD32] shrink-0"></span>
            <span>{{ store.slotRangeLabel }} · {{ store.dateLabel }}</span>
          </div>

          <!-- Multi-court badges -->
          <div v-if="store.courtIds.length > 1" class="flex flex-wrap gap-1.5 mt-3">
            <span
              v-for="c in store.selectedCourts"
              :key="c.id"
              class="court-badge"
            >
              {{ c.name }} · ₱{{ c.price }}/hr
            </span>
          </div>
        </div>
      </div>

      <!-- Order Breakdown Card -->
      <div class="order-card mb-4">
        <div class="order-card__header">
          <span class="order-card__label">Order Breakdown</span>
        </div>

        <!-- Court rental -->
        <div class="order-row border-b border-[#DCE6D8]/60">
          <div>
            <div class="order-row__name">Court rental</div>
            <div class="order-row__desc">
              {{ store.courtIds.length > 0 ? store.courtIds.length : 1 }}
              {{ (store.courtIds.length > 1) ? 'courts' : 'court' }} ×
              {{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}
            </div>
          </div>
          <div class="order-row__price">₱{{ store.courtTotal.toLocaleString() }}</div>
        </div>

        <!-- Paddles if any -->
        <div v-if="store.paddleCount > 0" class="order-row border-b border-[#DCE6D8]/60">
          <div>
            <div class="order-row__name">{{ mainPaddleLine.main }}</div>
            <div class="order-row__desc">
              <span v-if="mainPaddleLine.sub">{{ mainPaddleLine.sub }} · </span>
              <span>{{ store.slotHours }} {{ store.slotHours === 1 ? 'hour' : 'hours' }}</span>
            </div>
          </div>
          <div class="order-row__price">₱{{ store.paddleTotal.toLocaleString() }}</div>
        </div>

        <!-- Food if any -->
        <div v-if="store.foodCount > 0" class="order-row border-b border-[#DCE6D8]/60">
          <div>
            <div class="order-row__name">{{ mainFoodLine.main }}</div>
            <div v-if="mainFoodLine.sub" class="order-row__desc">{{ mainFoodLine.sub }}</div>
          </div>
          <div class="order-row__price">₱{{ store.foodTotal.toLocaleString() }}</div>
        </div>

        <!-- Grand total -->
        <div class="order-total-row">
          <div class="order-total-row__label">Total</div>
          <div class="order-total-row__amount">₱{{ store.grandTotal.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Benefits checklist -->
      <div class="benefits-list mb-2">
        <div class="benefit-item">
          <div class="benefit-item__check">✓</div>
          <span>No hidden fees — price is final</span>
        </div>
        <div class="benefit-item">
          <div class="benefit-item__check">✓</div>
          <span>Court instantly confirmed after payment</span>
        </div>
        <div class="benefit-item">
          <div class="benefit-item__check">✓</div>
          <span>Digital match pass issued immediately</span>
        </div>
      </div>
    </div>

    <BottomCTA
      label="Proceed to Player Details"
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

<style scoped>
/* ── Page Header ──────────────────────────────── */
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
  margin: 6px 0 16px;
  line-height: 1.5;
}

/* ── Court Hero ───────────────────────────────── */
.court-hero {
  position: relative;
  background: #14231C;
  border-radius: 22px;
  padding: 20px;
  overflow: hidden;
  border: 1px solid rgba(154, 205, 50, 0.15);
  box-shadow: 0 8px 28px -6px rgba(20, 35, 28, 0.35);
}

.court-hero__glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(154, 205, 50, 0.12);
  filter: blur(32px);
  pointer-events: none;
}

.court-reserved-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E8F4D8;
  color: #0B6623;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: 'Inter', sans-serif;
}

.court-reserved-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0B6623;
  flex-shrink: 0;
}

.court-hero__name {
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  margin-bottom: 6px;
}

.court-hero__details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.80);
}

.court-badge {
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-family: 'Inter', sans-serif;
}

/* ── Order Card ──────────────────────────────── */
.order-card {
  background: #FFFFFF;
  border: 1.5px solid #DCE6D8;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px -2px rgba(20, 35, 28, 0.05);
}

.order-card__header {
  padding: 12px 18px;
  border-bottom: 1px solid #DCE6D8;
  background: #FAF9F1;
}

.order-card__label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #66756D;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px;
}

.order-row__name {
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #14231C;
}

.order-row__desc {
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  color: #66756D;
  margin-top: 2px;
}

.order-row__price {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0B6623;
  flex-shrink: 0;
}

/* ── Total Row ───────────────────────────────── */
.order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #F6FAF2;
}

.order-total-row__label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #14231C;
}

.order-total-row__amount {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: #0B6623;
  line-height: 1;
}

/* ── Benefits List ───────────────────────────── */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 2px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  color: #66756D;
}

.benefit-item__check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #E8F4D8;
  color: #0B6623;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
