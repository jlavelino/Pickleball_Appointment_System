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
      :label="paying ? 'Processing…' : `Pay ₱${store.grandTotal}`"
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
import { ref } from 'vue'
import { useBookingStore } from '~/stores/booking'
import PaymentMethodCard from '~/components/booking/PaymentMethodCard.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'Pay for your booking — DINK' })

const store = useBookingStore()
if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

const paying = ref(false)
const errorMessage = ref<string | null>(null)

async function pay() {
  paying.value = true
  errorMessage.value = null
  try {
    const ref = await store.submitBookingToSupabase()
    navigateTo(`/book/confirmed/${ref}`)
  } catch (err: any) {
    console.error('Booking submission failed:', err)
    errorMessage.value = err.message || 'Payment or booking hold failed. Please try again.'
  } finally {
    paying.value = false
  }
}
</script>

