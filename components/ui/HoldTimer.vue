<template>
  <div class="flex items-center gap-2 bg-danger-bg text-danger-text px-4 py-[11px] rounded-[12px] text-[13.5px] font-semibold mb-4">
    <div class="w-[7px] h-[7px] rounded-full bg-danger-text flex-shrink-0 animate-pulse"></div>
    <span>Court held for {{ formattedTime }} more</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seconds: number
}>()

const formattedTime = computed(() => {
  const m = Math.floor(props.seconds / 60)
  const s = props.seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
})
</script>
