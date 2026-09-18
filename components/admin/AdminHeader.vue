<template>
  <header class="bg-[#14231C] text-white border-b border-[#243D2F] sticky top-0 z-30 shadow-[0_4px_20px_-2px_rgba(20,35,28,0.25)] pt-[env(safe-area-inset-top,0px)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
      <!-- Left: Official Logo & Staff Desk Brand Lockup -->
      <div class="flex items-center gap-2.5 min-w-0">
        <NuxtLink to="/admin" class="flex items-center gap-2.5 text-white no-underline group min-w-0">
          <div class="w-9 h-9 rounded-xl bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1">
            <img
              src="~/assets/images/pickle_logo.png"
              alt="PickleBook"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="min-w-0">
            <div class="font-display font-bold text-[15px] sm:text-[16px] leading-tight tracking-tight flex items-center gap-2">
              <span class="truncate">PickleBook</span>
              <span class="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#9ACD32]/15 text-[#9ACD32] border border-[#9ACD32]/30 shrink-0">
                Staff Desk
              </span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5 sm:mt-0">
              <span class="sm:hidden text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-[#9ACD32]/15 text-[#9ACD32] border border-[#9ACD32]/30 shrink-0">
                Staff Desk
              </span>
              <span class="text-[10.5px] sm:text-[11px] text-white/50 truncate hidden sm:block">
                Cagayan de Oro · Uptown Facility
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Center: Date Controls (Desktop & Tablet) -->
      <div class="hidden md:flex items-center gap-1 bg-[#1A2D23] px-2.5 py-1.5 rounded-2xl border border-[#2D4D3D] shadow-inner">
        <button
          type="button"
          class="w-7 h-7 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-92 transition-all cursor-pointer"
          title="Previous Day"
          @click="$emit('prev-day')"
        >
          <span class="mdi mdi-chevron-left text-[20px]"></span>
        </button>

        <div class="flex items-center gap-1.5 px-2">
          <span class="mdi mdi-calendar-blank text-[15px] text-[#9ACD32]"></span>
          <span class="text-[13px] font-bold text-white tracking-tight">
            {{ selectedDateLabel }}
          </span>
        </div>

        <button
          type="button"
          class="w-7 h-7 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-92 transition-all cursor-pointer"
          title="Next Day"
          @click="$emit('next-day')"
        >
          <span class="mdi mdi-chevron-right text-[20px]"></span>
        </button>

        <button
          v-if="!isToday"
          type="button"
          class="ml-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-[#9ACD32] text-[#14231C] hover:bg-[#A8DD3B] active:scale-92 transition-all cursor-pointer uppercase tracking-wider shadow-xs"
          @click="$emit('go-today')"
        >
          Today
        </button>
      </div>

      <!-- Right: Scan Gate Pass & Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Scan QR Pass Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0B6623] hover:bg-[#08521C] text-white font-bold text-[12px] sm:text-[13px] shadow-[0_3px_10px_rgba(11,102,35,0.3)] hover:shadow-[0_6px_16px_rgba(11,102,35,0.45)] active:scale-95 transition-all cursor-pointer group border border-[#237A3B]"
          @click="$emit('open-scanner')"
        >
          <span class="mdi mdi-qrcode-scan text-[15px] sm:text-[17px] text-[#9ACD32] group-hover:scale-110 transition-transform"></span>
          <span class="hidden sm:inline">Scan Gate Pass</span>
          <span class="sm:hidden">Scan</span>
        </button>

        <!-- Refresh Data -->
        <button
          type="button"
          class="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          title="Refresh bookings data"
          :disabled="loading"
          @click="$emit('refresh')"
        >
          <span class="mdi mdi-refresh text-[17px] sm:text-[18px]" :class="{ 'animate-spin': loading }"></span>
        </button>

        <!-- Staff Logout -->
        <button
          type="button"
          class="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 transition-all cursor-pointer flex items-center justify-center"
          title="Lock / Logout Desk"
          @click="$emit('logout')"
        >
          <span class="mdi mdi-lock-outline text-[17px] sm:text-[18px]"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Date Row -->
    <div class="md:hidden px-4 py-2.5 bg-[#0F1B15] border-t border-[#243D2F] flex items-center justify-between">
      <div class="flex items-center gap-1 bg-[#1A2D23] px-2.5 py-1.5 rounded-xl border border-[#2D4D3D]">
        <button
          type="button"
          class="w-6 h-6 rounded-lg flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-transform"
          @click="$emit('prev-day')"
        >
          <span class="mdi mdi-chevron-left text-[18px]"></span>
        </button>

        <div class="flex items-center gap-1.5 px-2 text-[12px] font-bold text-white">
          <span class="mdi mdi-calendar-blank text-[13px] text-[#9ACD32]"></span>
          <span>{{ selectedDateLabel }}</span>
        </div>

        <button
          type="button"
          class="w-6 h-6 rounded-lg flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-transform"
          @click="$emit('next-day')"
        >
          <span class="mdi mdi-chevron-right text-[18px]"></span>
        </button>
      </div>

      <button
        v-if="!isToday"
        type="button"
        class="text-[10.5px] font-bold px-3 py-1.5 rounded-xl bg-[#9ACD32] text-[#14231C] active:scale-92 transition-all uppercase tracking-wider shadow-xs"
        @click="$emit('go-today')"
      >
        Today
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  selectedDateLabel: string
  isToday: boolean
  loading?: boolean
}>()

defineEmits<{
  'prev-day': []
  'next-day': []
  'go-today': []
  'open-scanner': []
  'refresh': []
  'logout': []
}>()
</script>
