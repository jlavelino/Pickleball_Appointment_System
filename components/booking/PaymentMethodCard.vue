<template>
  <div
    @click="$emit('select')"
    role="radio"
    :aria-checked="selected"
    class="relative flex items-center gap-[14px] border-[1.5px] rounded-[18px] p-4 mb-3 cursor-pointer transition-all duration-150 overflow-hidden group select-none"
    :class="selected
      ? 'border-ink bg-white shadow-[0_4px_18px_-4px_rgba(34,51,24,0.22)]'
      : 'border-line bg-cream-card hover:border-ink/40 hover:shadow-[0_2px_12px_-4px_rgba(34,51,24,0.10)]'"
  >
    <!-- Subtle selected background sheen -->
    <div
      v-if="selected"
      class="absolute inset-0 bg-gradient-to-r from-lime/5 via-transparent to-transparent pointer-events-none"
    ></div>

    <!-- Payment Method Logo -->
    <div
      class="relative w-[48px] h-[48px] rounded-[13px] flex items-center justify-center flex-shrink-0 shadow-sm"
      :class="method === 'gcash'
        ? 'bg-[#0072CE]'
        : 'bg-[#1AA45A]'"
    >
      <!-- GCash G / Maya M stylized letter -->
      <span class="text-white font-extrabold text-[22px] tracking-tight select-none">
        {{ method === 'gcash' ? 'G' : 'M' }}
      </span>
      <!-- Shine overlay -->
      <div class="absolute inset-0 rounded-[13px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
    </div>

    <!-- Method Info -->
    <div class="flex-1 min-w-0">
      <div class="font-bold text-[15.5px] text-ink">
        {{ method === 'gcash' ? 'GCash' : 'Maya' }}
      </div>
      <div class="text-[12.5px] text-ink-soft mt-0.5 flex items-center gap-1">
        <span class="mdi mdi-shield-check text-[12px] text-lime-text flex-shrink-0"></span>
        <span>Secure · Instant confirmation</span>
      </div>
    </div>

    <!-- Check Badge -->
    <div
      class="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150"
      :class="selected
        ? 'border-ink bg-ink'
        : 'border-line bg-transparent group-hover:border-ink/40'"
    >
      <span v-if="selected" class="mdi mdi-check text-[13px]" style="color:#F5F1DE"></span>
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
