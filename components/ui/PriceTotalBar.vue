<template>
  <Transition name="price-bar">
    <div v-if="show" class="price-bar">
      <div class="price-bar__left">
        <span class="price-bar__label">Running total</span>
        <span class="price-bar__breakdown">{{ breakdownText }}</span>
      </div>
      <div class="price-bar__right">
        <span class="price-bar__currency">₱</span>
        <span class="price-bar__amount">{{ store.grandTotal.toLocaleString() }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'

const props = defineProps<{
  show?: boolean
}>()

const store = useBookingStore()

const breakdownText = computed(() => {
  const parts: string[] = []

  // Court(s)
  const courtCount = store.courtIds.length > 0 ? store.courtIds.length : (store.courtId !== null ? 1 : 0)
  const hours = store.slotHours
  if (courtCount > 0 && hours > 0) {
    parts.push(`${courtCount} court${courtCount > 1 ? 's' : ''} × ${hours} hr${hours > 1 ? 's' : ''}`)
  }

  // Paddles
  if (store.paddleCount > 0) {
    parts.push(`${store.paddleCount} paddle${store.paddleCount > 1 ? 's' : ''}`)
  }

  // Food
  if (store.foodCount > 0) {
    parts.push(`${store.foodCount} food item${store.foodCount > 1 ? 's' : ''}`)
  }

  return parts.length ? parts.join(' · ') : 'Select courts & times'
})
</script>

<style scoped>
.price-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--ink);
  border-radius: 14px;
  padding: 10px 16px;
  margin-bottom: 10px;
  gap: 12px;
  box-shadow: 0 4px 18px -4px rgba(34, 51, 24, 0.35);
}

.price-bar__left {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.price-bar__label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(245, 241, 222, 0.55);
}

.price-bar__breakdown {
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(245, 241, 222, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-bar__right {
  display: flex;
  align-items: baseline;
  gap: 1px;
  flex-shrink: 0;
}

.price-bar__currency {
  font-size: 14px;
  font-weight: 700;
  color: #96C33E;
}

.price-bar__amount {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--cream);
  line-height: 1;
}

/* ── Transition ── */
.price-bar-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.price-bar-leave-active {
  transition: all 0.18s ease-in;
}
.price-bar-enter-from,
.price-bar-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
