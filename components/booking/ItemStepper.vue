<template>
  <div class="flex items-center gap-3 py-3 border-b border-line last:border-none">
    <!-- Thumb -->
    <div
      class="w-11 h-11 rounded-xl flex-none"
      :class="variant === 'food'
        ? 'bg-gradient-to-br from-[#F3C57A] to-[#F7E0B4]'
        : 'bg-gradient-to-br from-lime to-[#E8EFBE]'"
    />
    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="text-[13px] font-bold truncate">{{ item.name }}</div>
      <div class="text-[11.5px] text-slate">
        ₱{{ item.price }}<template v-if="item.availableLabel"> · {{ item.availableLabel }}</template>
      </div>
    </div>
    <!-- Stepper -->
    <div class="flex items-center gap-2.5 flex-none">
      <button
        type="button"
        :disabled="quantity <= 0"
        @click="$emit('update:quantity', quantity - 1)"
        class="w-6 h-6 rounded-full border-[1.5px] border-line bg-white text-[13px] font-bold text-navy disabled:opacity-30 hover:border-navy transition-colors"
      >&minus;</button>
      <span class="text-[13px] font-bold min-w-[14px] text-center">{{ quantity }}</span>
      <button
        type="button"
        :disabled="max !== undefined && quantity >= max"
        @click="$emit('update:quantity', quantity + 1)"
        class="w-6 h-6 rounded-full border-[1.5px] border-line bg-white text-[13px] font-bold text-navy disabled:opacity-30 hover:border-navy transition-colors"
      >+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: { name: string; price: number; availableLabel?: string }
  quantity: number
  max?: number
  variant?: 'paddle' | 'food'
}>()
defineEmits<{ 'update:quantity': [q: number] }>()
</script>
