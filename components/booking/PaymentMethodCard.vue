<template>
  <div
    @click="$emit('select')"
    class="flex items-center gap-[14px] border-[1.5px] rounded-card p-4 mb-3 cursor-pointer transition-all"
    :class="selected
      ? 'border-ink bg-[--cream-card] shadow-[0_4px_16px_-4px_rgba(34,51,24,0.2)]'
      : 'border-[--line] bg-[--cream-card] hover:border-[--ink-soft] hover:shadow-[0_2px_10px_-4px_rgba(34,51,24,0.12)]'"
  >
    <div
      class="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-white font-bold text-[17px] flex-shrink-0"
      :class="method === 'gcash' ? 'bg-[#0072CE]' : 'bg-[#1AA45A]'"
    >
      {{ method === 'gcash' ? 'G' : 'M' }}
    </div>

    <div>
      <div class="font-semibold text-[15.5px]">{{ method === 'gcash' ? 'GCash' : 'Maya' }}</div>
      <div class="text-gray text-[13px] mt-[1px]">
        Pay securely via {{ method === 'gcash' ? 'GCash' : 'Maya' }}
      </div>
    </div>

    <div
      class="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
      :class="selected ? 'border-ink' : 'border-line'"
    >
      <div v-if="selected" class="w-2.5 h-2.5 rounded-full bg-ink"></div>
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
