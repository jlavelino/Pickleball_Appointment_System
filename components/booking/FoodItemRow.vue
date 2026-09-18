<template>
  <div
    class="food-card transition-all duration-200"
    :class="[
      quantity > 0 ? 'food-card--active' : '',
      isOutOfStock ? 'food-card--out-of-stock' : ''
    ]"
  >
    <div class="flex items-center gap-3.5">
      <!-- Icon container -->
      <div
        class="food-icon-box shrink-0"
        :style="{
          background: isOutOfStock ? '#F5F5F3' : iconBg,
          borderColor: isOutOfStock ? '#DCE6D8' : iconBorder
        }"
      >
        <span
          class="mdi text-[21px]"
          :class="mdiIcon"
          :style="{ color: isOutOfStock ? '#9AA39E' : iconColor }"
        ></span>
      </div>

      <!-- Name + price -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            class="font-sans font-semibold text-[15px] leading-snug truncate"
            :class="isOutOfStock ? 'text-[#9AA39E]' : 'text-[#14231C]'"
          >
            {{ food.name }}
          </span>
          <span
            v-if="isOutOfStock"
            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#FDE8E8] text-[#D94A4A] border border-[#FDB8B4] shrink-0"
          >
            Unavailable
          </span>
        </div>
        <div class="text-[13px]" :class="isOutOfStock ? 'text-[#9AA39E]' : ''">
          <span :class="isOutOfStock ? 'text-[#9AA39E]' : 'font-bold text-[#0B6623]'">
            ₱{{ food.price.toLocaleString() }}
          </span>
          <span class="text-[#66756D] text-[12px] ml-1">each</span>
        </div>
      </div>

      <!-- Stepper or Out of Stock -->
      <div v-if="isOutOfStock" class="shrink-0">
        <span class="text-[11px] font-bold text-[#9AA39E] bg-[#F5F5F3] border border-[#DCE6D8] px-2.5 py-1 rounded-xl">
          —
        </span>
      </div>
      <div v-else class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease"
          class="stepper-btn"
          :class="quantity <= 0 ? 'stepper-btn--disabled' : ''"
        >
          <span class="mdi mdi-minus text-[13px]"></span>
        </button>

        <span class="w-6 text-center font-bold text-[15px] text-[#14231C]">
          {{ quantity }}
        </span>

        <button
          type="button"
          :disabled="quantity >= 20"
          @click="$emit('step', 1)"
          aria-label="Increase"
          class="stepper-btn stepper-btn--add"
        >
          <span class="mdi mdi-plus text-[13px]"></span>
        </button>
      </div>
    </div>

    <!-- Subtotal strip when selected -->
    <div
      v-if="quantity > 0 && !isOutOfStock"
      class="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#DCE6D8]"
    >
      <span class="text-[12px] text-[#66756D] font-medium">Court-side served</span>
      <span class="font-bold text-[#14231C] text-[13px]">
        ₱{{ (food.price * quantity).toLocaleString() }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FoodItem } from '~/stores/booking'

const props = defineProps<{
  food: FoodItem
  quantity: number
}>()

const isOutOfStock = computed(() => props.food.is_available === false)

defineEmits<{
  step: [dir: number]
}>()

const iconType = computed(() => {
  const n = (props.food.name || '').toLowerCase()
  const c = (props.food.category || '').toLowerCase()
  if (n.includes('water') || n.includes('h2o')) return 'water'
  if (n.includes('juice') || n.includes('gatorade') || n.includes('pocari') || n.includes('iced tea') || n.includes('soda') || c.includes('juice')) return 'juice'
  if (n.includes('coffee') || n.includes('latte') || n.includes('espresso') || n.includes('tea') || c.includes('coffee')) return 'coffee'
  if (n.includes('burger') || n.includes('patty')) return 'burger'
  if (n.includes('chicken') || n.includes('wing') || n.includes('bbq') || n.includes('pork') || n.includes('beef') || n.includes('meat')) return 'chicken'
  if (n.includes('sandwich') || n.includes('sub') || n.includes('wrap') || n.includes('toast')) return 'sandwich'
  if (n.includes('fries') || n.includes('chips') || n.includes('nachos') || n.includes('popcorn') || n.includes('snack')) return 'fries'
  if (n.includes('pizza')) return 'pizza'
  if (n.includes('noodle') || n.includes('pasta') || n.includes('rice') || n.includes('ramen')) return 'noodles'
  if (c.includes('drink') || c.includes('beverage')) return 'juice'
  if (c.includes('snack')) return 'fries'
  return 'default'
})

const iconBg = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#EBF5FB'
    case 'juice':    return '#FEF3D6'
    case 'coffee':   return '#F5EBE0'
    case 'burger':   return '#FEF0E6'
    case 'chicken':  return '#FEF0E6'
    case 'sandwich': return '#E8F4D8'
    case 'fries':    return '#FEF3D6'
    case 'pizza':    return '#FEF0E6'
    case 'noodles':  return '#E8F4D8'
    default:         return '#E8F4D8'
  }
})

const iconBorder = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#BEE3F8'
    case 'juice':    return '#FBD38D'
    case 'coffee':   return '#D4A574'
    case 'burger':   return '#F6AD55'
    case 'chicken':  return '#F6AD55'
    case 'sandwich': return '#DCE6D8'
    case 'fries':    return '#F6E05E'
    case 'pizza':    return '#F6AD55'
    case 'noodles':  return '#DCE6D8'
    default:         return '#DCE6D8'
  }
})

const iconColor = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#2B6CB0'
    case 'juice':    return '#D98216'
    case 'coffee':   return '#7B4F2E'
    case 'burger':   return '#C05621'
    case 'chicken':  return '#C05621'
    case 'sandwich': return '#0B6623'
    case 'fries':    return '#D98216'
    case 'pizza':    return '#C05621'
    case 'noodles':  return '#0B6623'
    default:         return '#0B6623'
  }
})

const mdiIcon = computed(() => {
  switch (iconType.value) {
    case 'water':    return 'mdi-cup-water'
    case 'juice':    return 'mdi-bottle-tonic-plus-outline'
    case 'coffee':   return 'mdi-coffee-outline'
    case 'burger':   return 'mdi-hamburger'
    case 'chicken':  return 'mdi-food-drumstick-outline'
    case 'sandwich': return 'mdi-bread-slice-outline'
    case 'fries':    return 'mdi-french-fries'
    case 'pizza':    return 'mdi-pizza'
    case 'noodles':  return 'mdi-noodles'
    default:         return 'mdi-food-outline'
  }
})
</script>

<style scoped>
.food-card {
  background: #FFFFFF;
  border: 1.5px solid #DCE6D8;
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px -2px rgba(20, 35, 28, 0.04);
  transition: all 0.18s ease;
}

.food-card--active {
  border: 2px solid #0B6623 !important;
  background: #F6FAF2 !important;
  box-shadow: 0 4px 14px -3px rgba(11, 102, 35, 0.12) !important;
}

.food-card--out-of-stock {
  opacity: 0.55;
  background: #FAFAF8;
  cursor: default;
}

.food-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: 1px solid #DCE6D8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Stepper ──────────────────────────────────── */
.stepper-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #DCE6D8;
  background: #FFFFFF;
  color: #14231C;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-out;
  padding: 0;
  flex-shrink: 0;
}
.stepper-btn:hover:not(.stepper-btn--disabled) {
  border-color: #0B6623;
  background: #E8F4D8;
  color: #0B6623;
}
.stepper-btn:active:not(.stepper-btn--disabled) {
  transform: scale(0.90);
}
.stepper-btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stepper-btn--add {
  background: #0B6623;
  color: #FFFFFF;
  border-color: #0B6623;
}
.stepper-btn--add:hover:not(.stepper-btn--disabled) {
  background: #08521C;
  border-color: #08521C;
  color: #FFFFFF;
}
</style>
