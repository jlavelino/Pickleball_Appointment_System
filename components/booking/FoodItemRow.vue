<template>
  <div
    class="food-card transition-all duration-200"
    :class="[
      quantity > 0 ? 'food-card--active' : '',
      isOutOfStock ? 'food-card--out-of-stock' : ''
    ]"
  >
    <div class="flex items-center gap-3.5">

      <!-- Context-aware MDI icon swatch -->
      <div class="food-icon-box shrink-0" :style="{ background: isOutOfStock ? '#F3F4F6' : iconBg, borderColor: isOutOfStock ? '#E5E7EB' : iconBorder }">
        <span class="mdi text-[22px]" :class="mdiIcon" :style="{ color: isOutOfStock ? '#9CA3AF' : iconColor }"></span>
      </div>

      <!-- Food name + price -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-display font-bold text-[15.5px] text-ink truncate" :class="{ 'text-ink-soft/70': isOutOfStock }">
            {{ food.name }}
          </span>
          <span
            v-if="isOutOfStock"
            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shrink-0"
          >
            Out of Stock
          </span>
        </div>
        <div class="text-[13px] font-bold text-ink mt-0.5" :class="{ 'text-ink-soft/60': isOutOfStock }">
          ₱{{ food.price }}
          <span class="text-[11.5px] font-normal text-ink-soft">each</span>
        </div>
      </div>

      <!-- Quantity stepper or Out of Stock indicator -->
      <div v-if="isOutOfStock" class="shrink-0">
        <span class="text-[11.5px] font-bold text-amber-900/80 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
          Unavailable
        </span>
      </div>
      <div v-else class="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease"
          class="stepper-btn"
        >
          <span class="mdi mdi-minus text-[14px]"></span>
        </button>

        <span class="w-5 text-center font-bold text-[15px] text-ink font-mono">
          {{ quantity }}
        </span>

        <button
          type="button"
          :disabled="quantity >= 20"
          @click="$emit('step', 1)"
          aria-label="Increase"
          class="stepper-btn stepper-btn--add"
        >
          <span class="mdi mdi-plus text-[14px]"></span>
        </button>
      </div>
    </div>

    <!-- Subtotal strip when selected -->
    <div v-if="quantity > 0 && !isOutOfStock" class="flex items-center justify-between mt-2.5 pt-2 border-t border-line/60 text-[11.5px] font-medium text-ink-soft">
      <span>Court-side served</span>
      <span class="font-bold text-ink text-[12.5px]">
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

// Classify food by name and category for icon + color matching
const iconType = computed(() => {
  const n = (props.food.name || '').toLowerCase()
  const c = (props.food.category || '').toLowerCase()

  if (n.includes('water') || n.includes('h2o'))                           return 'water'
  if (n.includes('juice') || n.includes('gatorade') || n.includes('pocari') || n.includes('iced tea') || n.includes('soda') || c.includes('juice'))
                                                                           return 'juice'
  if (n.includes('coffee') || n.includes('latte') || n.includes('espresso') || n.includes('tea') || c.includes('coffee'))
                                                                           return 'coffee'
  if (n.includes('burger') || n.includes('patty'))                        return 'burger'
  if (n.includes('chicken') || n.includes('wing') || n.includes('bbq') || n.includes('pork') || n.includes('beef') || n.includes('meat'))
                                                                           return 'chicken'
  if (n.includes('sandwich') || n.includes('sub') || n.includes('wrap') || n.includes('toast'))
                                                                           return 'sandwich'
  if (n.includes('fries') || n.includes('chips') || n.includes('nachos') || n.includes('popcorn') || n.includes('snack'))
                                                                           return 'fries'
  if (n.includes('pizza'))                                                 return 'pizza'
  if (n.includes('noodle') || n.includes('pasta') || n.includes('rice') || n.includes('fried rice') || n.includes('ramen'))
                                                                           return 'noodles'
  if (c.includes('drink') || c.includes('beverage'))                      return 'juice'
  if (c.includes('snack'))                                                 return 'fries'
  return 'default'
})

const iconBg = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#EBF5FB'
    case 'juice':    return '#FEF3D6'
    case 'coffee':   return '#F5EBE0'
    case 'burger':   return '#FEF0E6'
    case 'chicken':  return '#FEF0E6'
    case 'sandwich': return '#FEF6E9'
    case 'fries':    return '#FFFBE6'
    case 'pizza':    return '#FEF0E6'
    case 'noodles':  return '#F0F9EB'
    default:         return '#F0F4F9'
  }
})

const iconBorder = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#BEE3F8'
    case 'juice':    return '#FBD38D'
    case 'coffee':   return '#D4A574'
    case 'burger':   return '#F6AD55'
    case 'chicken':  return '#F6AD55'
    case 'sandwich': return '#FBD38D'
    case 'fries':    return '#F6E05E'
    case 'pizza':    return '#F6AD55'
    case 'noodles':  return '#9AE6B4'
    default:         return '#BEE3F8'
  }
})

const iconColor = computed(() => {
  switch (iconType.value) {
    case 'water':    return '#2B6CB0'
    case 'juice':    return '#B7791F'
    case 'coffee':   return '#7B4F2E'
    case 'burger':   return '#C05621'
    case 'chicken':  return '#C05621'
    case 'sandwich': return '#B7791F'
    case 'fries':    return '#975A16'
    case 'pizza':    return '#C05621'
    case 'noodles':  return '#276749'
    default:         return '#2C5282'
  }
})

// Map food type to the correct MDI icon class
const mdiIcon = computed(() => {
  switch (iconType.value) {
    case 'water':    return 'mdi-water'
    case 'juice':    return 'mdi-bottle-soda-classic'
    case 'coffee':   return 'mdi-coffee'
    case 'burger':   return 'mdi-hamburger'
    case 'chicken':  return 'mdi-food-drumstick'
    case 'sandwich': return 'mdi-food'
    case 'fries':    return 'mdi-french-fries'
    case 'pizza':    return 'mdi-pizza'
    case 'noodles':  return 'mdi-noodles'
    default:         return 'mdi-silverware-fork-knife'
  }
})
</script>

<style scoped>
.food-card {
  background: var(--cream-card, #FDFCF5);
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 6px -2px rgba(34, 51, 24, 0.05);
}

.food-card--active {
  border-color: var(--ink, #223318);
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAF0 100%);
  box-shadow: 0 4px 12px -4px rgba(34, 51, 24, 0.12), 0 0 0 1px var(--ink, #223318);
}

.food-card--out-of-stock {
  opacity: 0.65;
  background: #FAF8F5;
  border-color: #E8E5DA;
  cursor: not-allowed;
}

.food-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--line, #DDDDB8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1.5px solid var(--line, #DDDDB8);
  background: #FFFFFF;
  color: var(--ink, #223318);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-out;
}
.stepper-btn:hover:not(:disabled) {
  border-color: var(--ink, #223318);
  background: var(--cream, #F5F1DE);
}
.stepper-btn:active:not(:disabled) {
  transform: scale(0.94);
}
.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-btn--add {
  background: var(--ink, #223318);
  color: var(--cream, #F5F1DE);
  border-color: var(--ink, #223318);
}
.stepper-btn--add:hover:not(:disabled) {
  background: #15220F;
  border-color: #15220F;
  color: #FFFFFF;
}
</style>
