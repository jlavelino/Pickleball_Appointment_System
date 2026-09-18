<template>
  <div
    class="paddle-card transition-all duration-200"
    :class="[
      quantity > 0 ? 'paddle-card--active' : '',
      isOutOfStock ? 'paddle-card--out-of-stock' : ''
    ]"
  >
    <!-- Top row: image + name/stock/price -->
    <div class="flex items-center gap-3.5">
      <!-- Paddle image in soft-green container -->
      <div class="paddle-img-box shrink-0" :class="{ 'opacity-50 grayscale': isOutOfStock }">
        <img
          :src="paddleImage"
          :alt="paddle.name"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Name, stock badge, price -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-0.5">
          <span
            class="font-sans font-bold text-[15.5px] leading-snug"
            :class="isOutOfStock ? 'text-[#8A938D]' : 'text-[#14231C]'"
          >
            {{ paddle.name }}
          </span>
          <!-- Stock badge -->
          <span
            v-if="paddle.stock <= 0"
            class="stock-badge stock-badge--out"
          >
            Out of Stock
          </span>
          <span
            v-else-if="paddle.stock <= 2"
            class="stock-badge stock-badge--low"
          >
            ● {{ paddle.stock }} left
          </span>
          <span
            v-else-if="paddle.stock <= 4"
            class="stock-badge stock-badge--low"
          >
            ● {{ paddle.stock }} left
          </span>
        </div>

        <!-- Price line -->
        <div class="text-[13px] text-[#66756D] font-medium">
          <span class="font-bold text-[#0B6623]">₱{{ paddle.price.toLocaleString() }}</span>
          <span class="text-[#66756D]"> / hr</span>
          <span v-if="hours && hours > 1" class="text-[#14231C] font-semibold">
            · ₱{{ (paddle.price * hours).toLocaleString() }} ({{ hours }} hrs)
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-[#DCE6D8] my-3"></div>

    <!-- Bottom row: subtotal + stepper or unavailable -->
    <div class="flex items-center justify-between">
      <!-- Left: subtotal or status text -->
      <div class="text-[12.5px] font-medium">
        <template v-if="isOutOfStock">
          <span class="text-[#8A938D]">Currently unavailable</span>
        </template>
        <template v-else-if="quantity > 0">
          <span class="font-bold text-[#14231C] text-[13.5px]">
            ₱{{ ((paddle.price * (hours || 1)) * quantity).toLocaleString() }}
          </span>
          <span class="text-[12px] text-[#66756D] ml-1">subtotal</span>
        </template>
        <template v-else>
          <span class="text-[#66756D]">Select quantity</span>
        </template>
      </div>

      <!-- Right: stepper or unavailable badge -->
      <div v-if="isOutOfStock" class="shrink-0">
        <span class="unavailable-badge">Unavailable</span>
      </div>
      <div v-else class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease quantity"
          class="stepper-btn"
          :class="quantity <= 0 ? 'stepper-btn--disabled' : ''"
        >
          <span class="mdi mdi-minus text-[14px]"></span>
        </button>

        <span class="w-7 text-center font-bold text-[15px] text-[#14231C]">
          {{ quantity }}
        </span>

        <button
          type="button"
          :disabled="quantity >= paddle.stock"
          @click="$emit('step', 1)"
          aria-label="Increase quantity"
          class="stepper-btn stepper-btn--add"
          :class="quantity >= paddle.stock ? 'stepper-btn--disabled' : ''"
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
import paddleStandardImg from '~/assets/images/paddle_standard-removebg-preview.png'
import paddlePremiumImg from '~/assets/images/paddle_premium-removebg-preview.png'
import paddleProImg from '~/assets/images/paddle_pro-removebg-preview.png'

const props = defineProps<{
  paddle: PaddleItem
  quantity: number
  hours?: number
}>()

const isOutOfStock = computed(() => props.paddle.stock <= 0)

const paddleImage = computed(() => {
  const name = (props.paddle.name || '').toLowerCase()
  if (name.includes('pro')) return paddleProImg
  if (name.includes('premium')) return paddlePremiumImg
  return paddleStandardImg
})

defineEmits<{
  step: [dir: number]
}>()
</script>

<style scoped>
.paddle-card {
  background: #FFFFFF;
  border: 1.5px solid #DCE6D8;
  border-radius: 20px;
  padding: 16px 18px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px -2px rgba(20, 35, 28, 0.05);
  transition: all 0.18s ease;
}

.paddle-card--active {
  border: 2px solid #0B6623 !important;
  background: #F6FAF2 !important;
  box-shadow: 0 4px 16px -3px rgba(11, 102, 35, 0.14) !important;
}

.paddle-card--out-of-stock {
  opacity: 0.6;
  background: #FAF9F1;
  cursor: default;
}

.paddle-img-box {
  width: 62px;
  height: 62px;
  border-radius: 14px;
  background: #E8F4D8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid #DCE6D8;
  overflow: hidden;
}

/* ── Stock Badges ─────────────────────────────── */
.stock-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  line-height: 1;
  white-space: nowrap;
}
.stock-badge--out {
  background: #FDE8E8;
  color: #D94A4A;
  border: 1px solid #FDB8B4;
}
.stock-badge--low {
  background: #FEF3D6;
  color: #D98216;
  border: 1px solid #FEE199;
}

/* ── Unavailable badge ────────────────────────── */
.unavailable-badge {
  font-size: 11.5px;
  font-weight: 700;
  color: #D94A4A;
  background: #FDE8E8;
  border: 1px solid #FDB8B4;
  padding: 4px 12px;
  border-radius: 12px;
}

/* ── Stepper Buttons ──────────────────────────── */
.stepper-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #DCE6D8;
  background: #FFFFFF;
  color: #14231C;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
  flex-shrink: 0;
}
.stepper-btn:hover:not(.stepper-btn--disabled) {
  background: #E8F4D8;
  border-color: #0B6623;
  color: #0B6623;
}
.stepper-btn:active:not(.stepper-btn--disabled) {
  transform: scale(0.90);
}
.stepper-btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stepper-btn--add {
  background: #0B6623;
  border-color: #0B6623;
  color: #FFFFFF;
}
.stepper-btn--add:hover:not(.stepper-btn--disabled) {
  background: #08521C;
  border-color: #08521C;
  color: #FFFFFF;
}
</style>
