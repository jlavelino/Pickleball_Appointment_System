<template>
  <div
    class="paddle-card transition-all duration-200"
    :class="[
      quantity > 0 ? 'paddle-card--active' : '',
      isOutOfStock ? 'paddle-card--out-of-stock' : ''
    ]"
  >
    <!-- Top row: image + name/price + stock badge -->
    <div class="flex items-center gap-3.5">
      <!-- Paddle image -->
      <div class="paddle-img-box shrink-0" :class="{ 'opacity-60 grayscale': isOutOfStock }">
        <img
          src="~/assets/images/pickle_paddle.png"
          :alt="paddle.name"
          class="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      <!-- Name, price & stock -->
      <div class="flex-1 min-w-0">
        <!-- Name row with stock pill inline -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-display font-bold text-[16px] text-ink leading-snug" :class="{ 'text-ink-soft/70': isOutOfStock }">
            {{ paddle.name }}
          </span>
          <span
            v-if="paddle.stock <= 4"
            class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none shrink-0"
            :class="isOutOfStock ? 'text-amber-900 bg-amber-100 border border-amber-300 uppercase tracking-wider font-extrabold' : 'text-amber-700 bg-amber-100 border border-amber-200'"
          >
            {{ isOutOfStock ? 'Out of Stock' : `${paddle.stock} left` }}
          </span>
        </div>

        <!-- Price sub-line -->
        <div class="text-[12.5px] text-ink-soft font-medium mt-0.5" :class="{ 'text-ink-soft/60': isOutOfStock }">
          ₱{{ paddle.price }} / hr
          <span v-if="hours && hours > 1" class="text-ink font-semibold">
            · ₱{{ (paddle.price * hours).toLocaleString() }} ({{ hours }} hrs)
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-line/60 my-3"></div>

    <!-- Bottom row: subtotal + stepper -->
    <div class="flex items-center justify-between">
      <div class="text-[12px] font-medium text-ink-soft">
        <template v-if="isOutOfStock">
          <span class="text-ink-soft/70 text-[12px]">Currently unavailable</span>
        </template>
        <template v-else-if="quantity > 0">
          <span class="font-bold text-ink text-[13px]">₱{{ ((paddle.price * (hours || 1)) * quantity).toLocaleString() }}</span>
          <span class="text-[11.5px] text-ink-soft ml-1">subtotal</span>
        </template>
        <template v-else>
          <span class="text-ink-soft text-[12px]">Select quantity</span>
        </template>
      </div>

      <!-- Stepper buttons or Out of Stock indicator -->
      <div v-if="isOutOfStock" class="shrink-0">
        <span class="text-[11.5px] font-bold text-amber-900/80 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
          Unavailable
        </span>
      </div>
      <div v-else class="flex items-center gap-2.5">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease quantity"
          class="stepper-btn"
        >
          <span class="mdi mdi-minus text-[14px]"></span>
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
          <span class="mdi mdi-plus text-[14px]"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaddleItem } from '~/stores/booking'

const props = defineProps<{
  paddle: PaddleItem
  quantity: number
  hours?: number
}>()

const isOutOfStock = computed(() => props.paddle.stock <= 0)

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

.paddle-card--out-of-stock {
  opacity: 0.65;
  background: #FAF8F5;
  border-color: #E8E5DA;
  cursor: not-allowed;
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
