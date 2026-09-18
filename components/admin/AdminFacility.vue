<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <!-- Card 1: Court Operational Status -->
    <div class="bg-white rounded-[20px] sm:rounded-[28px] border border-[#DCE6D8] shadow-subtle p-4 sm:p-7">
      <div class="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3.5 sm:pb-4 border-b border-[#DCE6D8]">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center border border-[#DCE6D8] shrink-0">
          <span class="mdi mdi-court text-[17px] sm:text-[19px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] sm:text-[18px] text-[#14231C] m-0">Court Maintenance Controls</h3>
          <p class="text-[11.5px] sm:text-[12.5px] text-[#66756D] m-0 mt-0.5">Toggle live court availability for public reservations</p>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="court in courts"
          :key="court.id"
          class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          :class="court.status === 'active'
            ? 'bg-[#FAF9F1]/60 border-[#DCE6D8]'
            : 'bg-[#FDE8E8]/40 border-[#FECACA]'"
        >
          <div>
            <div class="font-display font-bold text-[15px] sm:text-[16px] text-[#14231C] flex items-center gap-2">
              <span>{{ court.name }}</span>
              <span class="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#66756D] border border-[#DCE6D8]">
                {{ court.type.includes('covered') ? 'Covered' : 'Indoor' }}
              </span>
            </div>
            <div class="text-[12px] sm:text-[12.5px] text-[#66756D] mt-1 flex items-center gap-1.5 flex-wrap">
              <span>₱{{ Number(court.price_per_hour).toLocaleString() }}/hr ·</span>
              <span class="inline-flex items-center gap-1">
                <span class="w-2 h-2 rounded-full" :class="court.status === 'active' ? 'bg-[#0B6623]' : 'bg-[#D94A4A]'"></span>
                <strong :class="court.status === 'active' ? 'text-[#0B6623] font-semibold' : 'text-[#D94A4A] font-bold'">
                  {{ court.status === 'active' ? 'Open for Booking' : 'Under Maintenance' }}
                </strong>
              </span>
            </div>
          </div>

          <!-- Toggle Action Button -->
          <button
            type="button"
            class="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-[12px] sm:text-[12.5px] transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
            :class="court.status === 'active'
              ? 'bg-white hover:bg-[#FDE8E8] text-[#D94A4A] border border-[#FECACA] active:scale-95'
              : 'bg-[#0B6623] hover:bg-[#08521C] text-white active:scale-95 shadow-sm'"
            @click="toggleCourt(court)"
          >
            <span class="mdi" :class="court.status === 'active' ? 'mdi-wrench-outline' : 'mdi-check-circle-outline'"></span>
            <span>{{ court.status === 'active' ? 'Set Maintenance' : 'Activate Court' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Card 2: Paddle Rental Stock Management -->
    <div class="bg-white rounded-[20px] sm:rounded-[28px] border border-[#DCE6D8] shadow-subtle p-4 sm:p-7">
      <div class="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3.5 sm:pb-4 border-b border-[#DCE6D8]">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center border border-[#DCE6D8] shrink-0">
          <span class="mdi mdi-racquetball text-[17px] sm:text-[19px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] sm:text-[18px] text-[#14231C] m-0">Paddle Inventory Stock</h3>
          <p class="text-[11.5px] sm:text-[12.5px] text-[#66756D] m-0 mt-0.5">Live stock available for court rental bookings</p>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="paddle in paddles"
          :key="paddle.id"
          class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          :class="paddle.available_quantity > 0
            ? 'bg-[#FAF9F1]/60 border-[#DCE6D8]'
            : 'bg-[#FDE8E8]/40 border-[#FECACA]'"
        >
          <div class="flex-1 min-w-0">
            <div class="font-bold text-[14.5px] sm:text-[15px] text-[#14231C]">{{ paddle.name }}</div>
            <div class="text-[11.5px] sm:text-[12px] text-[#66756D] mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>₱{{ Number(paddle.price).toLocaleString() }}/hr ·</span>
              <span class="inline-flex items-center gap-1">
                <span class="w-2 h-2 rounded-full" :class="paddle.available_quantity > 0 ? 'bg-[#0B6623]' : 'bg-[#D94A4A]'"></span>
                <strong :class="paddle.available_quantity > 0 ? 'text-[#0B6623] font-semibold' : 'text-[#D94A4A] font-bold'">
                  {{ paddle.available_quantity > 0 ? 'In Stock' : 'Out of Stock' }}
                </strong>
              </span>
            </div>
            <!-- Capacity visual bar -->
            <div class="w-full max-w-[180px] h-1.5 rounded-full bg-[#DCE6D8] mt-2 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="paddle.available_quantity > 0 ? 'bg-[#0B6623]' : 'bg-[#D94A4A]'"
                :style="{ width: `${(paddle.available_quantity / paddle.total_quantity) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Counter Stepper Controls -->
          <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCE6D8]/50">
            <span class="text-[12.5px] sm:text-[13px] font-mono font-bold text-[#14231C] mr-1">
              {{ paddle.available_quantity }} / {{ paddle.total_quantity }} <span class="text-[10px] sm:text-[10.5px] text-[#66756D] font-sans font-medium">avail</span>
            </span>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                class="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-white border border-[#DCE6D8] text-[#14231C] hover:bg-[#E8F4D8] hover:text-[#0B6623] active:scale-92 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                :disabled="paddle.available_quantity <= 0"
                @click="$emit('adjust-paddle', paddle.id, -1)"
                aria-label="Decrease stock"
              >
                <span class="mdi mdi-minus text-[15px]"></span>
              </button>
              <button
                type="button"
                class="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-white border border-[#DCE6D8] text-[#14231C] hover:bg-[#E8F4D8] hover:text-[#0B6623] active:scale-92 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                :disabled="paddle.available_quantity >= paddle.total_quantity"
                @click="$emit('adjust-paddle', paddle.id, 1)"
                aria-label="Increase stock"
              >
                <span class="mdi mdi-plus text-[15px]"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 3: Refreshment Stock & Availability -->
    <div class="lg:col-span-2 bg-white rounded-[20px] sm:rounded-[28px] border border-[#DCE6D8] shadow-subtle p-4 sm:p-7">
      <div class="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3.5 sm:pb-4 border-b border-[#DCE6D8]">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center border border-[#DCE6D8] shrink-0">
          <span class="mdi mdi-silverware-fork-knife text-[17px] sm:text-[19px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] sm:text-[18px] text-[#14231C] m-0">Court-side Refreshments Menu</h3>
          <p class="text-[11.5px] sm:text-[12.5px] text-[#66756D] m-0 mt-0.5">Toggle menu items on or off when sold out</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          v-for="item in foodItems"
          :key="item.id"
          class="p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-2xs"
          :class="item.is_available
            ? 'bg-[#FAF9F1]/60 border-[#DCE6D8]'
            : 'bg-[#FDE8E8]/40 border-[#FECACA]'"
        >
          <div>
            <div class="flex items-center justify-between gap-1 mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#66756D] px-2 py-0.5 rounded-full bg-white border border-[#DCE6D8]">
                {{ item.category }}
              </span>
              <span class="font-display font-bold text-[14px] text-[#14231C]">
                ₱{{ Number(item.price).toLocaleString() }}
              </span>
            </div>
            <div class="font-bold text-[14.5px] text-[#14231C] leading-snug">{{ item.name }}</div>
            <div class="text-[11.5px] text-[#66756D] mt-1.5 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="item.is_available ? 'bg-[#0B6623]' : 'bg-[#D94A4A]'"></span>
              <span :class="item.is_available ? 'text-[#0B6623] font-semibold' : 'text-[#D94A4A] font-bold'">
                {{ item.is_available ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-2 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            :class="item.is_available
              ? 'bg-white hover:bg-[#FDE8E8] text-[#D94A4A] border border-[#FECACA] active:scale-95'
              : 'bg-[#0B6623] text-white hover:bg-[#08521C] active:scale-95 shadow-sm'"
            @click="$emit('toggle-food', item.id, !item.is_available)"
          >
            <span class="mdi" :class="item.is_available ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"></span>
            <span>{{ item.is_available ? 'Mark Out of Stock' : 'Mark Available' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminCourt, AdminPaddle, AdminFoodItem } from '~/composables/useAdminData'

defineProps<{
  courts: AdminCourt[]
  paddles: AdminPaddle[]
  foodItems: AdminFoodItem[]
}>()

const emit = defineEmits<{
  'toggle-court': [courtId: string, newStatus: 'active' | 'maintenance']
  'adjust-paddle': [paddleId: string, delta: number]
  'toggle-food': [foodId: string, isAvailable: boolean]
}>()

function toggleCourt(court: AdminCourt) {
  const newStatus = court.status === 'active' ? 'maintenance' : 'active'
  emit('toggle-court', court.id, newStatus)
}
</script>
