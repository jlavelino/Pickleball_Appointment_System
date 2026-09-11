<template>
  <div>
    <div class="text-[12.5px] tracking-[0.03em] text-gray font-semibold mb-2.5">
      {{ store.fullDateLabel.toUpperCase() }} · AVAILABLE TIMES
    </div>

    <div
      v-for="(s, idx) in store.slots"
      :key="s.label"
      @click="s.open > 0 ? store.setSlot(idx) : null"
      class="slot-row"
      :class="[
        store.slotIndex === idx
          ? 'slot-row--selected'
          : s.open === 0
            ? 'slot-row--disabled'
            : ''
      ]"
    >
      <span class="text-[15.5px] font-medium">{{ s.label }}</span>
      <span
        class="text-[14px]"
        :class="store.slotIndex === idx ? 'text-[#C8D9B0]' : 'text-gray'"
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
