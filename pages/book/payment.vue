<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Pay for your booking
      </h1>
      <p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">
        Choose how you'd like to pay
      </p>

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

      <!-- Cancelled notice -->
      <div
        v-if="wasCancelled"
        class="mt-4 p-3.5 rounded-xl bg-[#FFF9E6] border border-[#FEE199] text-[#946200] text-[13.5px] leading-snug flex items-start gap-2.5"
      >
        <span class="text-[16px] leading-none">ℹ️</span>
        <div class="flex-1 font-medium">
          Payment was cancelled on PayMongo. Your reservation hold is still active—you can select your payment method and try again.
        </div>
      </div>

      <!-- Error alert -->
      <div
        v-if="errorMessage"
        class="mt-4 p-3.5 rounded-xl bg-[#FEECEB] border border-[#FDB8B4] text-[#CE2C31] text-[13.5px] leading-snug flex items-start gap-2.5"
      >
        <span class="text-[16px] leading-none">⚠️</span>
        <div class="flex-1 font-medium">{{ errorMessage }}</div>
      </div>
    </div>


    <BottomCTA
      :label="paying ? redirectingText : `Pay ₱${store.grandTotal}`"
      :disabled="paying"
      @click="pay"
    >
      <template #above>
        <div class="flex justify-between items-baseline mb-2 text-ink-soft text-[14px]">
          <span>Total due</span>
          <span class="text-ink font-bold text-[19px] font-display">₱{{ store.grandTotal }}</span>
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

