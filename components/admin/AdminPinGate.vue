<template>
  <div class="min-h-screen bg-[#FAF9F1] flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- Subtle luxury ambient blur background elements -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9ACD32]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-72 h-72 bg-[#0B6623]/5 rounded-full blur-2xl pointer-events-none"></div>

    <!-- Main Card Container -->
    <div class="w-full max-w-[380px] bg-white rounded-[32px] border border-[#DCE6D8] p-7 shadow-[0_16px_48px_-8px_rgba(20,35,28,0.08)] text-center relative z-10">
      <!-- Logo Branding Header -->
      <div class="flex items-center justify-center gap-2.5 mb-3">
        <img
          src="~/assets/images/pickle_logo.png"
          alt="PickleBook Logo"
          class="w-7 h-7 object-contain"
        />
        <img
          src="~/assets/images/pickle_name.png"
          alt="PickleBook"
          class="h-5 w-auto object-contain"
        />
      </div>

      <!-- Staff Portal Badge -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4D8] text-[#0B6623] text-[11px] font-bold uppercase tracking-wider mb-4 border border-[#DCE6D8]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#0B6623] animate-pulse"></span>
        <span>Staff Portal Access</span>
      </div>

      <h1 class="font-display font-bold text-[24px] text-[#14231C] m-0 tracking-tight leading-tight">
        Facility Security Gate
      </h1>
      <p class="text-[13px] text-[#66756D] mt-1.5 mb-6 leading-relaxed">
        Enter your 4-digit PIN code to unlock staff controls & timeline
      </p>

      <!-- 4-Dot PIN Indicator -->
      <div
        class="flex items-center justify-center gap-4 mb-6"
        :class="{ 'animate-shake': hasError }"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="w-4 h-4 rounded-full transition-all duration-200"
          :class="pin.length >= i
            ? 'bg-[#0B6623] scale-125 shadow-[0_0_12px_rgba(11,102,35,0.35)]'
            : 'bg-[#FAF9F1] border-2 border-[#DCE6D8]'"
        ></div>
      </div>

      <!-- Error / Helper message -->
      <div class="h-6 flex items-center justify-center mb-3">
        <div
          v-if="hasError"
          class="text-[12px] font-bold text-[#D94A4A] flex items-center justify-center gap-1.5 animate-fade-in"
        >
          <span class="mdi mdi-alert-circle-outline text-[15px]"></span>
          <span>Incorrect PIN code. Please try again.</span>
        </div>
        <div v-else class="text-[11.5px] text-[#66756D]/70 font-medium">
          Default Staff PIN: 2026
        </div>
      </div>

      <!-- Numeric Keypad Grid -->
      <div class="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-2">
        <button
          v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="n"
          type="button"
          class="h-14 rounded-2xl bg-[#FAF9F1] border border-[#DCE6D8] text-[#14231C] font-display font-bold text-[21px] hover:bg-[#E8F4D8] hover:text-[#0B6623] hover:border-[#0B6623]/30 active:scale-92 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          @click="addDigit(String(n))"
        >
          {{ n }}
        </button>

        <!-- Clear Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-white border border-[#DCE6D8] text-[#66756D] font-bold text-[12px] hover:bg-[#FAF9F1] hover:text-[#14231C] active:scale-92 transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
          @click="clearPin"
        >
          Clear
        </button>

        <!-- Zero Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-[#FAF9F1] border border-[#DCE6D8] text-[#14231C] font-display font-bold text-[21px] hover:bg-[#E8F4D8] hover:text-[#0B6623] hover:border-[#0B6623]/30 active:scale-92 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          @click="addDigit('0')"
        >
          0
        </button>

        <!-- Backspace Button -->
        <button
          type="button"
          class="h-14 rounded-2xl bg-white border border-[#DCE6D8] text-[#66756D] hover:bg-[#FAF9F1] hover:text-[#14231C] active:scale-92 transition-all cursor-pointer flex items-center justify-center"
          @click="removeDigit"
          aria-label="Backspace"
        >
          <span class="mdi mdi-backspace-outline text-[20px]"></span>
        </button>
      </div>

      <!-- Return to Front Site Link -->
      <div class="mt-5 pt-3.5 border-t border-[#DCE6D8]/70">
        <NuxtLink
          to="/"
          class="text-[12.5px] font-semibold text-[#66756D] hover:text-[#0B6623] inline-flex items-center gap-1.5 transition-colors"
        >
          <span class="mdi mdi-arrow-left text-[14px]"></span>
          <span>Back to Court Booking</span>
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
    }, 550)
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
