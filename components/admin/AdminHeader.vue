<template>
  <header class="bg-[#1E3314] text-white border-b border-[#2D4D1E] sticky top-0 z-30 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <!-- Left: Logo & Branding -->
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink to="/admin" class="flex items-center gap-2 text-white no-underline group">
          <div class="w-9 h-9 rounded-xl bg-lime flex items-center justify-center text-ink font-display font-extrabold text-[18px] shadow-sm">
            D
          </div>
          <div class="min-w-0">
            <div class="font-display font-bold text-[16px] leading-tight tracking-tight flex items-center gap-1.5">
              <span>DINK</span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-lime/20 text-lime border border-lime/30">
                Staff Desk
              </span>
            </div>
            <div class="text-[11px] text-white/60 truncate">Cagayan de Oro · Uptown</div>
          </div>
        </NuxtLink>
      </div>

      <!-- Center: Date Controls (Desktop / Tablet) -->
      <div class="hidden md:flex items-center gap-1.5 bg-black/25 px-2 py-1 rounded-xl border border-white/10">
        <button
          type="button"
          class="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Previous Day"
          @click="$emit('prev-day')"
        >
          <span class="mdi mdi-chevron-left text-[20px]"></span>
        </button>

        <span class="text-[13px] font-semibold px-2 text-lime tracking-tight">
          {{ selectedDateLabel }}
        </span>

        <button
          type="button"
          class="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Next Day"
          @click="$emit('next-day')"
        >
          <span class="mdi mdi-chevron-right text-[20px]"></span>
        </button>

        <button
          v-if="!isToday"
          type="button"
          class="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-lime text-ink hover:opacity-90 transition-opacity cursor-pointer uppercase tracking-wider"
          @click="$emit('go-today')"
        >
          Today
        </button>
      </div>

      <!-- Right: Scan Gate Pass & Actions -->
      <div class="flex items-center gap-2">
        <!-- Scan QR Pass Button -->
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lime text-ink font-bold text-[13px] shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer group"
          @click="$emit('open-scanner')"
        >
          <span class="mdi mdi-qrcode-scan text-[18px] group-hover:scale-110 transition-transform"></span>
          <span class="hidden sm:inline">Scan Gate Pass</span>
          <span class="sm:hidden">Scan</span>
        </button>

        <!-- Refresh Data -->
        <button
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Refresh bookings"
          :disabled="loading"
          @click="$emit('refresh')"
        >
          <span class="mdi mdi-refresh text-[18px]" :class="{ 'animate-spin': loading }"></span>
        </button>

        <!-- Staff Logout -->
        <button
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 transition-colors cursor-pointer"
          title="Lock / Logout"
          @click="$emit('logout')"
        >
          <span class="mdi mdi-lock-outline text-[18px]"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Date Row -->
    <div class="md:hidden px-4 py-2 bg-black/30 border-t border-white/5 flex items-center justify-between text-[12.5px]">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="p-1 text-white/70 hover:text-white"
          @click="$emit('prev-day')"
        >
          <span class="mdi mdi-chevron-left text-[18px]"></span>
        </button>
        <span class="font-semibold text-lime">{{ selectedDateLabel }}</span>
        <button
          type="button"
          class="p-1 text-white/70 hover:text-white"
          @click="$emit('next-day')"
        >
          <span class="mdi mdi-chevron-right text-[18px]"></span>
        </button>
      </div>
      <button
        v-if="!isToday"
        type="button"
        class="text-[11px] font-bold px-2 py-0.5 rounded bg-lime text-ink"
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
