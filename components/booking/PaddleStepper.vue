<template>
  <div class="flex items-center gap-[14px] py-[14px] border-b border-line last:border-none">
    <!-- Lime-soft swatch with paddle SVG -->
    <div class="w-12 h-12 rounded-[12px] bg-lime-soft flex-shrink-0 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="17" rx="15" ry="15" fill="#3F6019"/>
        <rect x="20" y="29" width="8" height="15" rx="3.5" fill="#3F6019"/>
        <circle cx="18" cy="12" r="1.6" fill="#EAF1CE"/>
        <circle cx="29" cy="14" r="1.6" fill="#EAF1CE"/>
        <circle cx="23" cy="21" r="1.6" fill="#EAF1CE"/>
      </svg>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-[15.5px] truncate text-ink">{{ paddle.name }}</div>
      <div class="text-gray text-[13.5px] mt-[1px]">
        ₱{{ paddle.price }} / session · {{ paddle.stock }} available
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
        :disabled="quantity >= paddle.stock"
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
import type { PaddleItem } from '~/stores/booking'

defineProps<{
  paddle: PaddleItem
  quantity: number
}>()

defineEmits<{
  step: [dir: number]
}>()
</script>
