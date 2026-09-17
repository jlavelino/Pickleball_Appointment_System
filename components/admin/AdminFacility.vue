<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Card 1: Court Operational Status -->
    <div class="bg-white rounded-[24px] border border-line shadow-sm p-5 sm:p-6">
      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
        <div class="w-8 h-8 rounded-xl bg-sold text-relish-dark flex items-center justify-center">
          <span class="mdi mdi-court text-[18px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] text-ink m-0">Court Maintenance Controls</h3>
          <p class="text-[12px] text-ink-soft m-0">Set courts to active or maintenance mode</p>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="court in courts"
          :key="court.id"
          class="p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors"
          :class="court.status === 'active' ? 'bg-cream/40 border-line' : 'bg-red-50/70 border-red-200'"
        >
          <div>
            <div class="font-display font-bold text-[15px] text-ink flex items-center gap-2">
              <span>{{ court.name }}</span>
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-ink-soft border border-line">
                {{ court.type }}
              </span>
            </div>
            <div class="text-[12px] text-ink-soft mt-0.5">
              ₱{{ Number(court.price_per_hour).toLocaleString() }}/hour · Status:
              <strong :class="court.status === 'active' ? 'text-relish-dark' : 'text-red-700'">
                {{ court.status === 'active' ? 'Open for Booking' : 'Under Maintenance' }}
              </strong>
            </div>
          </div>

          <!-- Toggle Button -->
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl font-bold text-[12px] transition-all cursor-pointer shadow-2xs"
            :class="court.status === 'active' ? 'bg-white hover:bg-red-50 text-red-700 border border-red-200' : 'bg-relish-dark text-white hover:bg-black'"
            @click="toggleCourt(court)"
          >
            {{ court.status === 'active' ? 'Put in Maintenance' : 'Set Active' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Card 2: Paddle Rental Stock Management -->
    <div class="bg-white rounded-[24px] border border-line shadow-sm p-5 sm:p-6">
      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
        <div class="w-8 h-8 rounded-xl bg-sold text-relish-dark flex items-center justify-center">
          <span class="mdi mdi-racquetball text-[18px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] text-ink m-0">Paddle Inventory Stock</h3>
          <p class="text-[12px] text-ink-soft m-0">Live available vs reserved quantities</p>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="paddle in paddles"
          :key="paddle.id"
          class="p-3.5 rounded-2xl bg-cream/40 border border-line flex items-center justify-between gap-3"
        >
          <div>
            <div class="font-bold text-[14.5px] text-ink">{{ paddle.name }}</div>
            <div class="text-[12px] text-ink-soft mt-0.5">
              ₱{{ Number(paddle.price).toLocaleString() }}/hour rental
            </div>
          </div>

          <!-- Counter Stepper -->
          <div class="flex items-center gap-2">
            <span class="text-[13px] font-mono font-bold text-ink mr-1">
              {{ paddle.available_quantity }} / {{ paddle.total_quantity }} <span class="text-[10.5px] text-ink-soft font-sans font-medium">available</span>
            </span>

            <button
              type="button"
              class="w-8 h-8 rounded-lg bg-white border border-line text-ink hover:bg-cream active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              :disabled="paddle.available_quantity <= 0"
              @click="$emit('adjust-paddle', paddle.id, -1)"
            >
              <span class="mdi mdi-minus text-[14px]"></span>
            </button>
            <button
              type="button"
              class="w-8 h-8 rounded-lg bg-white border border-line text-ink hover:bg-cream active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              :disabled="paddle.available_quantity >= paddle.total_quantity"
              @click="$emit('adjust-paddle', paddle.id, 1)"
            >
              <span class="mdi mdi-plus text-[14px]"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 3: Refreshment Stock & Availability -->
    <div class="md:col-span-2 bg-white rounded-[24px] border border-line shadow-sm p-5 sm:p-6">
      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
        <div class="w-8 h-8 rounded-xl bg-sold text-relish-dark flex items-center justify-center">
          <span class="mdi mdi-silverware-fork-knife text-[18px]"></span>
        </div>
        <div>
          <h3 class="font-display font-bold text-[16px] text-ink m-0">Court-side Refreshments Menu</h3>
          <p class="text-[12px] text-ink-soft m-0">Toggle items on/off when out of stock</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="item in foodItems"
          :key="item.id"
          class="p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3"
          :class="item.is_available ? 'bg-cream/40 border-line' : 'bg-gray-100/80 border-gray-200 opacity-75'"
        >
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-1.5 py-0.5 rounded bg-white border border-line">
                {{ item.category }}
              </span>
              <span class="font-bold text-[13.5px] text-ink">₱{{ Number(item.price).toLocaleString() }}</span>
            </div>
            <div class="font-bold text-[14px] text-ink">{{ item.name }}</div>
          </div>

          <button
            type="button"
            class="w-full py-1.5 px-2 rounded-xl text-[11.5px] font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1"
            :class="item.is_available ? 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-200' : 'bg-relish-dark text-white hover:bg-black'"
            @click="$emit('toggle-food', item.id, !item.is_available)"
          >
            <span class="mdi" :class="item.is_available ? 'mdi-cancel' : 'mdi-check'"></span>
            <span>{{ item.is_available ? 'Mark Out of Stock' : 'Mark Available' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminCourt, AdminPaddle, AdminFoodItem } from '~/composables/useAdminData'

const props = defineProps<{
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
