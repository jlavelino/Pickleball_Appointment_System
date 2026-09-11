<template>
  <div>
    <!-- Court block -->
    <div class="rounded-card border-[1.5px] border-line bg-white p-4 mb-3.5">
      <div class="font-display font-semibold text-[14px] mb-0.5">{{ court.name }}</div>
      <div class="text-[12px] text-slate">{{ dateLabel }} · {{ startTime }} – {{ endTime }}</div>
    </div>

    <!-- Line items -->
    <div class="rounded-card border-[1.5px] border-line bg-white p-4">
      <!-- Court -->
      <div class="flex justify-between text-[12.5px] py-1.5">
        <span>Court rental</span>
        <span class="font-semibold">₱{{ court.pricePerHour.toLocaleString() }}</span>
      </div>

      <!-- Paddles -->
      <template v-if="paddles.length">
        <div class="h-px bg-line my-1.5" />
        <div v-for="p in paddles" :key="p.id" class="flex justify-between text-[12.5px] py-1.5">
          <span>{{ p.quantity }} × {{ p.name }}</span>
          <span class="font-semibold">₱{{ (p.price * p.quantity).toLocaleString() }}</span>
        </div>
      </template>

      <!-- Food -->
      <template v-if="food.length">
        <div class="h-px bg-line my-1.5" />
        <div class="flex justify-between text-[12.5px] py-1.5">
          <span>
            {{ food[0].quantity }} × {{ food[0].name }}
            <template v-if="food.length > 1">
              <br />
              <span class="text-slate text-[11px]">
                {{ food.slice(1).map(f => `${f.quantity} × ${f.name}`).join(', ') }}
              </span>
            </template>
          </span>
          <span class="font-semibold">₱{{ foodTotal.toLocaleString() }}</span>
        </div>
      </template>

      <!-- Total -->
      <div class="flex justify-between items-baseline pt-2.5 mt-1.5 border-t border-line">
        <span class="font-bold text-[13px]">Total</span>
        <span class="font-display font-bold text-[22px]">₱{{ total.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Court, PaddleItem, FoodItem } from '~/stores/booking'

const props = defineProps<{
  court: Court
  dateLabel: string
  startTime: string
  endTime: string
  paddles: PaddleItem[]
  food: FoodItem[]
}>()

const foodTotal   = computed(() => props.food.reduce((s, f) => s + f.price * f.quantity, 0))
const paddleTotal = computed(() => props.paddles.reduce((s, p) => s + p.price * p.quantity, 0))
const total       = computed(() => props.court.pricePerHour + paddleTotal.value + foodTotal.value)
</script>
