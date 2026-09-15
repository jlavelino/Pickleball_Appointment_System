<template>
  <div
    class="paddle-card transition-all duration-200"
    :class="quantity > 0 ? 'paddle-card--active' : ''"
  >
    <!-- Top row: Gear info & thumbnail -->
    <div class="flex items-center gap-3.5">
      <!-- Paddle image container -->
      <div class="paddle-img-box shrink-0">
        <img
          src="~/assets/images/pickle_paddle.png"
          :alt="paddle.name"
          class="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      <!-- Details -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sold text-relish-dark">
            USAPA Approved
          </span>
          <span v-if="paddle.stock <= 4" class="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
            {{ paddle.stock }} left
          </span>
        </div>

        <div class="font-display font-bold text-[16px] text-ink truncate">
          {{ paddle.name }}
        </div>

        <div class="text-[12.5px] text-ink-soft font-medium mt-0.5">
          <span>₱{{ paddle.price }} / hr</span>
          <span v-if="hours && hours > 1" class="text-ink font-semibold">
            · ₱{{ (paddle.price * hours).toLocaleString() }} ({{ hours }} hrs)
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-line/60 my-3"></div>

    <!-- Bottom row: Quantity stepper & Subtotal -->
    <div class="flex items-center justify-between">
      <div class="text-[12px] font-medium text-ink-soft">
        <template v-if="quantity > 0">
          <span class="font-bold text-ink text-[13px]">₱{{ ((paddle.price * (hours || 1)) * quantity).toLocaleString() }}</span>
          <span class="text-[11.5px] text-ink-soft ml-1">subtotal</span>
        </template>
        <template v-else>
          Select quantity
        </template>
      </div>

      <!-- Stepper buttons -->
      <div class="flex items-center gap-2.5">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease quantity"
          class="stepper-btn"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        <span class="w-6 text-center font-bold text-[15px] text-ink font-mono">
          {{ quantity }}
        </span>

        <button
          type="button"
          :disabled="quantity >= paddle.stock"
          @click="$emit('step', 1)"
          aria-label="Increase quantity"
          class="stepper-btn stepper-btn--add"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaddleItem } from '~/stores/booking'

defineProps<{
  paddle: PaddleItem
  quantity: number
  hours?: number
}>()

defineEmits<{
  step: [dir: number]
}>()
</script>

<style scoped>
.paddle-card {
  background: var(--cream-card, #FDFCF5);
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px -3px rgba(34, 51, 24, 0.06);
}

.paddle-card--active {
  border-color: var(--ink, #223318);
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAF0 100%);
  box-shadow: 0 4px 14px -4px rgba(34, 51, 24, 0.14), 0 0 0 1px var(--ink, #223318);
}

.paddle-img-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #F1F0D9;
  border: 1px solid var(--line, #DDDDB8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.stepper-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1.5px solid var(--line, #DDDDB8);
  background: #FFFFFF;
  color: var(--ink, #223318);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-out;
}
.stepper-btn:hover:not(:disabled) {
  border-color: var(--ink, #223318);
  background: var(--cream, #F5F1DE);
}
.stepper-btn:active:not(:disabled) {
  transform: scale(0.94);
}
.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-btn--add {
  background: var(--ink, #223318);
  color: var(--cream, #F5F1DE);
  border-color: var(--ink, #223318);
}
.stepper-btn--add:hover:not(:disabled) {
  background: #15220F;
  border-color: #15220F;
  color: #FFFFFF;
}
</style>
