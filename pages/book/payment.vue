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
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'Pay for your booking — DINK' })

const store = useBookingStore()
if (store.courtId === null) {
  navigateTo('/book/court')
}

const paying = ref(false)

async function pay() {
  paying.value = true
  await new Promise(r => setTimeout(r, 900))
  const refId = store.generateBookingRef()
  navigateTo(`/book/confirmed/${refId}`)
}
</script>
