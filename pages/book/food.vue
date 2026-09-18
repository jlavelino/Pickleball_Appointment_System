<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Page header -->
      <div class="mb-5">
        <h1 class="page-title">Pre-order snacks &amp; drinks</h1>
        <p class="page-subtitle">
          Chilled and delivered court-side prior to your
          <strong class="text-[#14231C]">{{ store.selectedSlot?.label || 'game' }}</strong> match.
        </p>
      </div>

      <!-- Info banner -->
      <div class="info-banner mb-5">
        <div class="info-banner__icon">
          <span class="mdi mdi-snowflake text-[18px] text-[#0B6623]"></span>
        </div>
        <p class="info-banner__text">
          Items will be kept on ice and ready at your reserved court bench upon arrival.
        </p>
      </div>

      <!-- Food groups listing -->
      <template v-for="g in store.foodGroups" :key="g.label">
        <!-- Category header -->
        <div class="category-header">
          <span class="category-header__label">{{ g.label }}</span>
          <div class="category-header__line"></div>
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

/* ── Category Header ─────────────────────────── */
.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 12px;
}

.category-header__label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #66756D;
  white-space: nowrap;
}

.category-header__line {
  height: 1px;
  background: #DCE6D8;
  flex: 1;
}
</style>
