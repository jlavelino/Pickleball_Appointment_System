<template>
  <div class="text-center pt-[6px]">
    <!-- Mascot Character with Badge -->
    <div class="relative w-[120px] h-[120px] mx-auto mb-[14px]">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M35 60 L15 35" stroke="#38591A" stroke-width="6" stroke-linecap="round"/>
        <path d="M85 60 L105 35" stroke="#38591A" stroke-width="6" stroke-linecap="round"/>
        <circle cx="13" cy="32" r="6" fill="#4C7A22"/>
        <circle cx="107" cy="32" r="6" fill="#4C7A22"/>
        <path d="M20 70 C15 40 35 15 60 15 C90 15 105 35 100 65 C95 95 70 108 45 102 C25 97 22 88 20 70Z" fill="#96C33E" stroke="#38591A" stroke-width="3"/>
        <circle cx="45" cy="55" r="2.4" fill="#38591A"/>
        <circle cx="60" cy="45" r="2.4" fill="#38591A"/>
        <circle cx="70" cy="60" r="2.4" fill="#38591A"/>
        <circle cx="55" cy="72" r="2.4" fill="#38591A"/>
        <circle cx="75" cy="78" r="2.4" fill="#38591A"/>
        <rect x="38" y="48" width="16" height="10" rx="4" fill="#223318"/>
        <rect x="58" y="46" width="16" height="10" rx="4" fill="#223318"/>
        <line x1="54" y1="51" x2="58" y2="49" stroke="#223318" stroke-width="2"/>
        <path d="M44 78 Q58 90 72 76" stroke="#223318" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="absolute -right-0.5 bottom-0.5 w-[30px] h-[30px] rounded-full bg-lime border-[3px] border-cream flex items-center justify-center text-[14px] text-ink font-bold shadow-xs">
        ✓
      </div>
    </div>

    <!-- QR Box -->
    <div class="bg-white border border-line rounded-[18px] p-[22px] inline-block mb-[18px] shadow-sm">
      <div class="grid grid-cols-9 grid-rows-9 gap-1 w-[122px] h-[122px]">
        <div
          v-for="(on, i) in qrCells"
          :key="i"
          class="rounded-[2px]"
          :class="on ? 'bg-ink' : 'bg-transparent'"
        ></div>
      </div>
    </div>

    <div class="text-gray text-[13px] tracking-[0.02em] mb-1 font-mono">{{ bookingRef }}</div>
    <div class="font-display font-semibold text-[22px] mb-0.5 text-ink">{{ courtName }}</div>
    <div class="text-ink-soft text-[14.5px] mb-[22px]">{{ slotRange }} · {{ dateLabel }}</div>

    <!-- Check rows card -->
    <div class="bg-white border border-line rounded-card p-[18px] text-left mb-4 shadow-xs">
      <div class="flex justify-between items-center py-[13px] px-1 border-b border-line">
        <div class="flex items-center gap-2.5">
          <div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            ✓
          </div>
          <div class="font-semibold text-[14.5px]">Payment</div>
        </div>
        <div class="text-ink-soft text-[14px]">Paid · {{ payMethod === 'gcash' ? 'GCash' : 'Maya' }}</div>
      </div>

      <div class="flex justify-between items-center py-[13px] px-1 border-b border-line">
        <div class="flex items-center gap-2.5">
          <div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            ✓
          </div>
          <div class="font-semibold text-[14.5px]">Court</div>
        </div>
        <div class="text-ink-soft text-[14px]">Reserved</div>
      </div>

      <div class="flex justify-between items-center py-[13px] px-1 border-b border-line">
        <div class="flex items-center gap-2.5">
          <div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            ✓
          </div>
          <div class="font-semibold text-[14.5px]">Paddles</div>
        </div>
        <div class="text-ink-soft text-[14px]">{{ paddleCount > 0 ? `${paddleCount} held` : 'None' }}</div>
      </div>

      <div class="flex justify-between items-center py-[13px] px-1">
        <div class="flex items-center gap-2.5">
          <div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            ✓
          </div>
          <div class="font-semibold text-[14.5px]">Food</div>
        </div>
        <div class="text-ink-soft text-[14px]">{{ foodCount > 0 ? `${foodCount} items, preparing` : 'No food ordered' }}</div>
      </div>
    </div>

    <button
      type="button"
      @click="$emit('restart')"
      class="w-full flex items-center justify-center gap-2.5 py-4 px-6 mt-5 rounded-2xl bg-[var(--ink)] text-[var(--cream)] font-bold text-[15px] shadow-[0_4px_16px_-4px_rgba(34,51,24,0.4)] hover:bg-[#2e4a1a] hover:shadow-[0_6px_22px_-4px_rgba(34,51,24,0.5)] active:scale-[0.98] transition-all cursor-pointer group"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform group-hover:scale-110 duration-150"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span>Book another court</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bookingRef: string
  courtName: string
  slotRange: string
  dateLabel: string
  payMethod: 'gcash' | 'maya'
  paddleCount: number
  foodCount: number
}>()

defineEmits<{
  restart: []
}>()

const qrCells = computed(() => {
  let seed = 0
  for (let i = 0; i < props.bookingRef.length; i++) {
    seed = (seed * 31 + props.bookingRef.charCodeAt(i)) >>> 0
  }
  function rnd() {
    seed = (seed * 1103515245 + 12345) >>> 0
    return (seed >>> 8) % 100
  }
  const cells: boolean[] = []
  for (let i = 0; i < 81; i++) {
    cells.push(rnd() < 45)
  }
  return cells
})
</script>
