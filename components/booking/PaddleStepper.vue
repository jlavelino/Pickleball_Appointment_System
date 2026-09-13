<template>
  <div class="flex items-center gap-[14px] py-[14px] border-b border-line last:border-none">
    <!-- Paddle image thumbnail -->
    <div class="w-12 h-12 rounded-[14px] bg-[#F1F0D9] border border-[var(--line)] flex-shrink-0 flex items-center justify-center overflow-hidden p-0.5 shadow-xs">
      <img
        src="~/assets/images/pickle_paddle.png"
        :alt="paddle.name"
        class="w-full h-full object-contain"
      />
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
