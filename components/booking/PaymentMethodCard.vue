<template>
  <div
    @click="$emit('select')"
    role="radio"
    :aria-checked="selected"
    class="relative flex items-center gap-3.5 border rounded-2xl p-4 mb-3 cursor-pointer transition-all duration-150 overflow-hidden group select-none"
    :class="selected
      ? 'border-[#0B6623] bg-[#F6FAF2] border-2 shadow-subtle'
      : 'border-[#DCE6D8] bg-white hover:border-[#0B6623]/50 shadow-subtle'"
  >
    <!-- Payment Method Logo -->
    <div
      class="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
      :class="method === 'gcash'
        ? 'bg-[#0072CE]'
        : 'bg-[#1AA45A]'"
    >
      <span class="text-white font-extrabold text-[22px] tracking-tight select-none">
        {{ method === 'gcash' ? 'G' : 'M' }}
      </span>
      <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
    </div>

    <!-- Method Info -->
    <div class="flex-1 min-w-0">
      <div class="font-bold text-[16px] text-[#14231C]">
        {{ method === 'gcash' ? 'GCash' : 'Maya' }}
      </div>
      <div class="text-[12.5px] text-[#66756D] mt-0.5 flex items-center gap-1">
        <span class="mdi mdi-shield-check text-[13px] text-[#0B6623] shrink-0"></span>
        <span>Secure · Instant confirmation</span>
      </div>
    </div>

    <!-- Check Badge -->
    <div
      class="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150"
      :class="selected
        ? 'border-[#0B6623] bg-[#0B6623]'
        : 'border-[#DCE6D8] bg-white group-hover:border-[#0B6623]'"
    >
      <span v-if="selected" class="mdi mdi-check text-[14px] text-white"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  method: 'gcash' | 'maya'
  selected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>
