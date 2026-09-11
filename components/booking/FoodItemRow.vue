<template>
  <div class="flex items-center gap-[14px] py-[14px] border-b border-line last:border-none">
    <!-- Warm swatch with cutlery SVG -->
    <div class="w-12 h-12 rounded-[12px] bg-sold flex-shrink-0 flex items-center justify-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 2v7a1.2 1.2 0 002.4 0V2M9.2 2v7M11.4 2v7a3 3 0 01-3 3v10" stroke="#C97A1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 2c-1.8 0-2.6 2-2.6 4.5S15.2 12 17 12v10" stroke="#C97A1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-[15.5px] truncate text-ink">{{ food.name }}</div>
      <div class="text-gray text-[13.5px] mt-[1px]">
        ₱{{ food.price }}
      </div>
    </div>

    <!-- Stepper -->
    <div class="flex items-center gap-3 flex-shrink-0">
      <button
        type="button"
        :disabled="quantity <= 0"
        @click="$emit('step', -1)"
        aria-label="Decrease"
        class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"
      >
        −
      </button>
      <div class="w-4 text-center font-semibold text-[15px] text-ink">{{ quantity }}</div>
      <button
        type="button"
        :disabled="quantity >= 20"
        @click="$emit('step', 1)"
        aria-label="Increase"
        class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FoodItem } from '~/stores/booking'

defineProps<{
  food: FoodItem
  quantity: number
}>()

defineEmits<{
  step: [dir: number]
}>()
</script>
