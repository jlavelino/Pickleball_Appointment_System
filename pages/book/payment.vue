<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <!-- Page header -->
      <div class="mt-1 mb-4">
        <h1 class="font-display font-bold text-[30px] text-[#14231C] m-0 leading-tight">
          Pay for your booking
        </h1>
        <p class="text-[#66756D] text-[14px] m-0 leading-relaxed mt-1">
          Choose your preferred payment method. You'll be redirected to a secure checkout.
        </p>
      </div>

      <!-- Active Hold Banner (Shows if user pressed Back or returned from PayMongo) -->
      <div
        v-if="activeHold && !holdExpired"
        class="mb-5 p-4 sm:p-5 rounded-2xl bg-[#FFF4E5] border border-[#FED7AA] shadow-sm relative overflow-hidden"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#D98216] animate-pulse"></span>
            <span class="text-[11.5px] font-bold uppercase tracking-wider text-[#9A3412]">
              Active Hold · QR Code Ready
            </span>
          </div>
          <span class="text-[12px] font-mono font-bold text-[#9A3412] bg-white px-2.5 py-0.5 rounded-md border border-[#FED7AA] shadow-2xs">
            Expires in {{ countdownFormatted }}
          </span>
        </div>

        <div class="text-[13.5px] text-[#14231C] font-medium leading-relaxed">
          Your slot is temporarily held under ref <strong class="font-mono text-[#9A3412]">{{ activeHold.bookingRef }}</strong>. You can reopen your PayMongo QR code below to finish paying.
        </div>

        <div class="mt-3.5 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            class="flex-1 py-3 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] active:scale-[0.98] text-white font-bold text-[13.5px] shadow-[0_3px_12px_rgba(11,102,35,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
            @click="resumePayment"
          >
            <span class="mdi mdi-qrcode-scan text-[18px] text-[#9ACD32]"></span>
            <span>Resume Payment / View QR Code</span>
          </button>

          <button
            type="button"
            class="py-3 px-4 rounded-xl bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-semibold text-[13px] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            @click="cancelHold"
          >
            <span class="mdi mdi-close-circle-outline text-[16px]"></span>
            <span>Cancel Hold</span>
          </button>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-[#14231C] rounded-2xl p-5 mb-5 text-white shadow-subtle border border-[#DCE6D8] relative overflow-hidden">
        <div class="absolute top-0 right-0 w-28 h-28 rounded-full bg-[#9ACD32]/10 -translate-y-1/2 translate-x-1/2 blur-lg pointer-events-none"></div>

        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9ACD32]">Order Summary</span>
            <span class="text-[11.5px] text-white/70">{{ store.courtNamesLabel || activeHold?.courtNamesLabel || 'Court Reserved' }}</span>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <div class="text-white/70 text-[12.5px]">Total due</div>
              <div class="font-display font-bold text-[32px] leading-tight text-white tracking-tight mt-0.5">
                ₱{{ (store.grandTotal || activeHold?.grandTotal || 0).toLocaleString() }}
              </div>
            </div>
            <div class="text-right text-[12.5px] text-white/70 pb-1">
              <div>{{ store.slotRangeLabel || activeHold?.slotRangeLabel }}</div>
              <div class="text-white/50 text-[11.5px] mt-0.5">{{ store.dateLabel || activeHold?.dateLabel }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Cards -->
      <div class="mb-2">
        <div class="text-[11px] font-bold tracking-wider uppercase text-[#66756D] mb-2.5">
          {{ activeHold ? 'Or generate a new payment method' : 'Select payment method' }}
        </div>

        <PaymentMethodCard
          method="gcash"
          :selected="store.payMethod === 'gcash'"
          @select="store.payMethod = 'gcash'"
        />

        <PaymentMethodCard
          method="maya"
          :selected="store.payMethod === 'maya'"
          @select="store.payMethod = 'maya'"
        />
      </div>

      <!-- Trust / Security Indicators -->
      <div class="flex items-center justify-center gap-5 py-3">
        <div class="flex items-center gap-1.5 text-[11.5px] text-[#66756D]">
          <span class="mdi mdi-shield-lock text-[14px] text-[#0B6623]"></span>
          <span>256-bit SSL</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11.5px] text-[#66756D]">
          <span class="mdi mdi-check-decagram text-[14px] text-[#0B6623]"></span>
          <span>PayMongo secure</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11.5px] text-[#66756D]">
          <span class="mdi mdi-clock-fast text-[14px] text-[#0B6623]"></span>
          <span>Instant confirm</span>
        </div>
      </div>

      <!-- Cancelled notice (Orange alert #D98216) -->
      <div
        v-if="wasCancelled && !activeHold"
        class="mt-2 p-3.5 rounded-2xl bg-[#FFF4E5] border border-[#FEE199] text-[#D98216] text-[13px] leading-snug flex items-start gap-2.5"
      >
        <span class="mdi mdi-information-outline text-[18px] leading-none shrink-0 text-[#D98216]"></span>
        <div class="flex-1 font-medium text-[#14231C]">
          Payment was cancelled on PayMongo. Select your payment method below to restart checkout.
        </div>
      </div>

      <!-- Error alert (Red alert #D94A4A) -->
      <div
        v-if="errorMessage"
        class="mt-3 p-3.5 rounded-2xl bg-[#FDE8E8] border border-[#FDB8B4] text-[#D94A4A] text-[13px] leading-snug flex items-start gap-2.5"
      >
        <span class="mdi mdi-alert-circle-outline text-[18px] leading-none shrink-0 text-[#D94A4A]"></span>
        <div class="flex-1 font-medium text-[#14231C]">{{ errorMessage }}</div>
      </div>
    </div>

    <!-- Pay CTA -->
    <BottomCTA
      :label="paying ? redirectingText : `Pay ₱${(store.grandTotal || activeHold?.grandTotal || 0).toLocaleString()}`"
      :disabled="paying"
      @click="pay"
    >
      <template #above>
        <div class="flex justify-between items-center mb-2 px-1">
          <div class="flex items-center gap-1.5 text-[#66756D] text-[13.5px]">
            <span>Paying via</span>
            <span class="font-bold text-[#14231C]">{{ store.payMethod === 'gcash' ? 'GCash' : 'Maya' }}</span>
          </div>
          <span class="text-[#0B6623] font-bold text-[19px] font-display">
            ₱{{ (store.grandTotal || activeHold?.grandTotal || 0).toLocaleString() }}
          </span>
        </div>
      </template>
    </BottomCTA>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBookingStore } from '~/stores/booking'
import PaymentMethodCard from '~/components/booking/PaymentMethodCard.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'Pay for your booking — PickleBook' })

const route = useRoute()
const store = useBookingStore()

const activeHold = ref<any>(null)
const secondsLeft = ref(0)
const holdExpired = ref(false)
const paying = ref(false)
const errorMessage = ref<string | null>(null)
const wasCancelled = computed(() => route.query.cancelled === 'true')

let timerInterval: ReturnType<typeof setInterval> | null = null
let pollInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  if (!activeHold.value?.expiresAt) {
    secondsLeft.value = 0
    return
  }
  const diff = Math.floor((activeHold.value.expiresAt - Date.now()) / 1000)
  if (diff <= 0) {
    secondsLeft.value = 0
    holdExpired.value = true
    store.clearActiveHold()
  } else {
    secondsLeft.value = diff
    holdExpired.value = false
  }
}

const countdownFormatted = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

async function checkPaymentStatus() {
  const refCode = activeHold.value?.bookingRef || store.bookingRef
  if (!refCode) return

  try {
    const res = await $fetch<{ success: boolean; paid?: boolean }>('/api/paymongo/verify-session', {
      method: 'POST',
      body: { bookingRef: refCode },
    })

    if (res?.paid) {
      if (pollInterval) clearInterval(pollInterval)
      store.clearActiveHold()
      navigateTo(`/book/confirmed/${encodeURIComponent(refCode)}`)
    }
  } catch {}
}

onMounted(() => {
  // Check if an active hold exists in localStorage
  const savedHold = store.restoreActiveHold()
  if (savedHold) {
    activeHold.value = savedHold
    updateCountdown()
    timerInterval = setInterval(updateCountdown, 1000)

    // Check payment status immediately and poll every 4s
    checkPaymentStatus()
    pollInterval = setInterval(checkPaymentStatus, 4000)
  } else if (store.courtId === null && store.courtIds.length === 0) {
    navigateTo('/book/court')
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (pollInterval) clearInterval(pollInterval)
})

const redirectingText = computed(() => {
  if (store.payMethod === 'gcash') return 'Redirecting to GCash…'
  if (store.payMethod === 'maya') return 'Redirecting to Maya…'
  return 'Redirecting to PayMongo…'
})

function resumePayment() {
  if (activeHold.value?.checkoutUrl) {
    window.location.href = activeHold.value.checkoutUrl
  }
}

async function cancelHold() {
  if (pollInterval) clearInterval(pollInterval)
  await store.cancelCurrentHold()
  activeHold.value = null
  navigateTo('/book')
}

async function pay() {
  paying.value = true
  errorMessage.value = null
  try {
    const checkoutUrl = await store.initiatePayMongoCheckout()
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    } else {
      throw new Error('No checkout URL received from payment provider.')
    }
  } catch (err: any) {
    console.error('Booking / payment initiation failed:', err)
    errorMessage.value = err.data?.statusMessage || err.message || 'Payment or booking hold failed. Please try again.'
    paying.value = false
  }
}
</script>
