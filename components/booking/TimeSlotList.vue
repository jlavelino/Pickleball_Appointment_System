<template>
  <div>
    <div class="text-[12.5px] tracking-[0.03em] text-gray font-semibold mb-2.5">
      {{ store.fullDateLabel.toUpperCase() }} · AVAILABLE TIMES
    </div>

    <div
      v-for="(s, idx) in store.slots"
      :key="s.label"
      @click="s.open > 0 ? store.setSlot(idx) : null"
      class="flex items-center justify-between p-[16px_18px] rounded-[14px] border mb-2.5 transition-all"
      :class="[
        store.slotIndex === idx
          ? 'bg-ink text-white border-ink'
          : s.open === 0
            ? 'opacity-45 cursor-not-allowed bg-white border-line'
            : 'cursor-pointer bg-white border-line hover:border-ink/50'
      ]"
    >
      <span class="text-[15.5px] font-medium">{{ s.label }}</span>
      <span
        class="text-[14px]"
        :class="store.slotIndex === idx ? 'text-[#D9DCE8]' : 'text-gray'"
      >
        {{ s.open === 0 ? 'Full' : `${s.open} ${s.open === 1 ? 'court open' : 'courts open'}` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'

const store = useBookingStore()
</script>
