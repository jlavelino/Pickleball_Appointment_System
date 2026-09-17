<template>
  <div class="min-h-screen bg-[#F5F1DE] flex flex-col items-center justify-center p-4">
    <!-- Card Container -->
    <div class="w-full max-w-[360px] bg-white rounded-[28px] border border-line p-6 shadow-[0_12px_40px_-12px_rgba(34,51,24,0.18)] text-center">
      <!-- Shield / Padlock Emblem -->
      <div class="w-16 h-16 rounded-2xl bg-sold mx-auto mb-4 flex items-center justify-center text-relish-dark shadow-xs">
        <span class="mdi mdi-shield-lock-outline text-[32px]"></span>
      </div>

      <h1 class="font-display font-bold text-[22px] text-ink m-0">
        Staff Gate Access
      </h1>
      <p class="text-[13px] text-ink-soft mt-1 mb-6">
        Enter your 4-digit security PIN to continue
      </p>

      <!-- 4-Dot PIN Indicator -->
      <div class="flex items-center justify-center gap-3.5 mb-6" :class="{ 'animate-shake': hasError }">
        <div
          v-for="i in 4"
          :key="i"
          class="w-4 h-4 rounded-full border-2 transition-all duration-150"
          :class="pin.length >= i ? 'bg-ink border-ink scale-110 shadow-sm' : 'bg-sold/50 border-line'"
        ></div>
      </div>

      <!-- Error message -->
      <div v-if="hasError" class="text-[12px] font-bold text-red-600 mb-3 animate-fade-in flex items-center justify-center gap-1">
        <span class="mdi mdi-alert-circle-outline text-[14px]"></span>
        Incorrect PIN. Please try again.
      </div>
      <div v-else class="text-[11.5px] text-ink-soft mb-3">&nbsp;</div>

      <!-- Numeric Keypad Grid -->
      <div class="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-2">
        <button
          v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="n"
          type="button"
          class="h-14 rounded-2xl bg-cream border border-line text-ink font-display font-bold text-[20px] hover:bg-sold active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
          @click="addDigit(String(n))"
        >
          {{ n }}
        </button>

        <!-- Clear Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-cream/60 border border-line text-ink-soft font-semibold text-[13px] hover:bg-cream active:scale-95 transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
          @click="clearPin"
        >
          Clear
        </button>

        <!-- Zero Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-cream border border-line text-ink font-display font-bold text-[20px] hover:bg-sold active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
          @click="addDigit('0')"
        >
          0
        </button>

        <!-- Backspace Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-cream/60 border border-line text-ink hover:bg-cream active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          @click="removeDigit"
        >
          <span class="mdi mdi-backspace-outline text-[20px]"></span>
        </button>
      </div>

      <!-- Return to Front Site Link -->
      <div class="mt-4 pt-3 border-t border-line/60">
        <NuxtLink to="/" class="text-[12.5px] font-medium text-ink-soft hover:text-ink inline-flex items-center gap-1 transition-colors">
          <span class="mdi mdi-arrow-left text-[14px]"></span>
          <span>Back to Court Reservation</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'

const emit = defineEmits<{
  authenticated: []
}>()

const auth = useAdminAuth()
const pin = ref('')
const hasError = ref(false)

function addDigit(digit: string) {
  if (pin.value.length < 4) {
    hasError.value = false
    pin.value += digit
    if (pin.value.length === 4) {
      submitPin()
    }
  }
}

function removeDigit() {
  hasError.value = false
  pin.value = pin.value.slice(0, -1)
}

function clearPin() {
  hasError.value = false
  pin.value = ''
}

function submitPin() {
  const ok = auth.verifyPin(pin.value)
  if (ok) {
    emit('authenticated')
  } else {
    hasError.value = true
    setTimeout(() => {
      pin.value = ''
    }, 600)
  }
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
