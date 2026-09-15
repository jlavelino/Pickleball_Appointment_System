<template>
  <div
    class="food-card transition-all duration-200"
    :class="quantity > 0 ? 'food-card--active' : ''"
  >
    <div class="flex items-center gap-3.5">
      <!-- Icon swatch based on category or name -->
      <div class="food-icon-box shrink-0" :class="isDrink ? 'bg-[#EBF5FB]' : 'bg-[#FEF6E9]'">
        <!-- Drink / hydration icon -->
        <svg v-if="isDrink" class="w-5 h-5 text-[#2471A3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          <path d="M7 2h10"/>
        </svg>
        <!-- Food / snack icon -->
        <svg v-else class="w-5 h-5 text-[#B76E12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      </div>

      <!-- Food info -->
      <div class="flex-1 min-w-0">
        <div class="font-display font-bold text-[15.5px] text-ink truncate">
          {{ food.name }}
        </div>
        <div class="text-[13px] font-bold text-ink mt-0.5">
          ₱{{ food.price }}
          <span class="text-[11.5px] font-normal text-ink-soft">each</span>
        </div>
      </div>

      <!-- Quantity Stepper -->
      <div class="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          :disabled="quantity <= 0"
          @click="$emit('step', -1)"
          aria-label="Decrease"
          class="stepper-btn"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
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
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Active quantity subtotal strip if selected -->
    <div v-if="quantity > 0" class="flex items-center justify-between mt-2.5 pt-2 border-t border-line/60 text-[11.5px] font-medium text-ink-soft">
      <span>Court-side chilled</span>
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

defineEmits<{
  step: [dir: number]
}>()

const isDrink = computed(() => {
  const cat = (props.food.category || '').toLowerCase()
  const name = (props.food.name || '').toLowerCase()
  return cat.includes('drink') || cat.includes('beverage') || name.includes('water') || name.includes('gatorade') || name.includes('pocari') || name.includes('juice')
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
