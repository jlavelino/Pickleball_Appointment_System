<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <!-- Page header -->
      <div class="mt-1.5 mb-5">
        <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-1">
          Pay for your booking
        </h1>
        <p class="text-ink-soft text-[14px] m-0 leading-[1.4]">
          Choose your preferred payment method. You'll be redirected to a secure checkout.
        </p>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-gradient-to-r from-[#1E3314] via-[#2A481B] to-[#1E3314] rounded-2xl p-4 mb-5 text-white shadow-[0_6px_20px_-6px_rgba(34,51,24,0.4)]">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[11px] font-bold tracking-[0.08em] uppercase text-lime/80">Order Summary</span>
          <span class="text-[11px] text-white/60">{{ store.courtNamesLabel || 'Court Reserved' }}</span>
        </div>
        <div class="flex items-end justify-between">
          <div>
            <div class="text-white/70 text-[12.5px]">Total due</div>
            <div class="font-display font-bold text-[32px] leading-tight text-white tracking-tight">
              ₱{{ store.grandTotal.toLocaleString() }}
            </div>
          </div>
          <div class="text-right text-[12px] text-white/60 pb-1">
            <div>{{ store.slotRangeLabel }}</div>
            <div>{{ store.dateLabel }}</div>
          </div>
        </div>
      </div>

      <!-- Payment Method Cards -->
      <div class="mb-1">
        <div class="text-[11px] font-bold tracking-wider uppercase text-ink-soft mb-2.5">Select payment method</div>

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
      <div class="flex items-center justify-center gap-4 py-3">
        <div class="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
          <span class="mdi mdi-shield-lock text-[13px] text-lime-text"></span>
          <span>256-bit SSL</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
          <span class="mdi mdi-check-decagram text-[13px] text-lime-text"></span>
          <span>PayMongo secure</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
          <span class="mdi mdi-clock-fast text-[13px] text-lime-text"></span>
          <span>Instant confirm</span>
        </div>
      </div>

      <!-- Cancelled notice -->
      <div
        v-if="wasCancelled"
        class="mt-2 p-3.5 rounded-xl bg-[#FFF9E6] border border-[#FEE199] text-[#946200] text-[13px] leading-snug flex items-start gap-2.5"
      >
        <span class="text-[15px] leading-none">ℹ️</span>
        <div class="flex-1 font-medium">
          Payment was cancelled on PayMongo. Your reservation hold is still active — select your payment method and try again.
        </div>
      </div>

      <!-- Error alert -->
      <div
        v-if="errorMessage"
        class="mt-3 p-3.5 rounded-xl bg-[#FEECEB] border border-[#FDB8B4] text-[#CE2C31] text-[13px] leading-snug flex items-start gap-2.5"
      >
        <span class="text-[15px] leading-none">⚠️</span>
        <div class="flex-1 font-medium">{{ errorMessage }}</div>
      </div>
    </div>

    <!-- Pay CTA -->
    <BottomCTA
      :label="paying ? redirectingText : `Pay ₱${store.grandTotal}`"
      :disabled="paying"
      @click="pay"
    >
      <template #above>
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-1.5 text-ink-soft text-[13.5px]">
            <span>Paying via</span>
            <span class="font-semibold text-ink">{{ store.payMethod === 'gcash' ? 'GCash' : 'Maya' }}</span>
          </div>
          <span class="text-ink font-bold text-[19px] font-display">₱{{ store.grandTotal.toLocaleString() }}</span>
        </div>
      </template>
    </BottomCTA>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import PaymentMethodCard from '~/components/booking/PaymentMethodCard.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'Pay for your booking — DINK' })

const route = useRoute()
const store = useBookingStore()

if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

const paying = ref(false)
const errorMessage = ref<string | null>(null)
const wasCancelled = computed(() => route.query.cancelled === 'true')

const redirectingText = computed(() => {
  if (store.payMethod === 'gcash') return 'Redirecting to GCash…'
  if (store.payMethod === 'maya') return 'Redirecting to Maya…'
  return 'Redirecting to PayMongo…'
})

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
