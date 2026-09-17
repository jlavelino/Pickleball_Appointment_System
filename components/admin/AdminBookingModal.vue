<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
    <!-- Dialog Card -->
    <div class="w-full max-w-[500px] bg-white rounded-[26px] border border-line shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="p-4 px-5 bg-[#1E3314] text-white flex items-center justify-between border-b border-[#2E4F1E]">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10.5px] uppercase font-bold tracking-widest text-lime">
              Match Pass Verification
            </span>
            <span
              v-if="booking.checked_in"
              class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1"
            >
              <span class="mdi mdi-check-circle text-[12px]"></span>
              Checked In
            </span>
          </div>
          <div class="font-mono font-bold text-[17px] text-white mt-0.5">
            {{ booking.reference }}
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <span class="mdi mdi-close text-[18px]"></span>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-5 overflow-y-auto space-y-4">
        <!-- Court & Time Hero Banner -->
        <div class="p-3.5 rounded-2xl bg-cream border border-line flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sold text-relish-dark flex items-center justify-center font-display font-extrabold text-[18px]">
              <span class="mdi mdi-racquetball text-[22px]"></span>
            </div>
            <div>
              <div class="font-display font-bold text-[18px] text-ink leading-tight">
                {{ booking.court_names }}
              </div>
              <div class="text-[12.5px] text-ink-soft font-medium mt-0.5">
                {{ booking.start_time.slice(0, 5) }} – {{ booking.end_time.slice(0, 5) }} · {{ booking.booking_date }}
              </div>
            </div>
          </div>

          <span
            class="text-[11.5px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-2xs"
            :class="booking.status === 'confirmed' ? 'bg-[#EBF5DC] border-[#B7DD85] text-relish-dark' : 'bg-amber-50 border-amber-200 text-amber-900'"
          >
            {{ booking.status === 'confirmed' ? 'Confirmed & Paid' : booking.status }}
          </span>
        </div>

        <!-- Section 1: Guest Booker & Government ID Photo -->
        <div class="p-4 rounded-2xl bg-white border border-line shadow-2xs">
          <div class="flex items-center justify-between mb-2 pb-2 border-b border-line/50">
            <div class="text-[11px] font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
              <span class="mdi mdi-account text-[14px]"></span>
              <span>Booker Identity</span>
            </div>
            <span v-if="booking.id_photo_url" class="text-[11px] font-bold text-relish-dark flex items-center gap-1">
              <span class="mdi mdi-check-decagram text-[13px]"></span>
              ID Attached
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[13px] mb-3">
            <div>
              <span class="text-[11px] text-ink-soft block">Full Name</span>
              <span class="font-bold text-ink">{{ booking.guest_name }}</span>
            </div>
            <div>
              <span class="text-[11px] text-ink-soft block">Contact Mobile</span>
              <span class="font-mono font-semibold text-ink">{{ booking.guest_mobile || '—' }}</span>
            </div>
            <div v-if="booking.guest_facebook" class="col-span-2">
              <span class="text-[11px] text-ink-soft block">Facebook Profile</span>
              <span class="text-ink font-medium">{{ booking.guest_facebook }}</span>
            </div>
          </div>

          <!-- Government ID Photo Preview & Inspector -->
          <div v-if="booking.id_photo_url" class="mt-2 pt-2 border-t border-line/40">
            <div class="text-[11px] font-semibold text-ink-soft mb-1.5 flex items-center justify-between">
              <span>Valid Government ID</span>
              <span class="text-[10.5px] text-ink-soft">(Tap photo to zoom)</span>
            </div>
            <div
              class="relative rounded-xl border border-line overflow-hidden bg-cream-card cursor-pointer group max-h-[160px] flex items-center justify-center"
              @click="showFullId = true"
            >
              <img
                :src="booking.id_photo_url"
                alt="Government ID"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[12px] font-bold gap-1">
                <span class="mdi mdi-magnify-plus-outline text-[18px]"></span>
                <span>Inspect ID</span>
              </div>
            </div>
          </div>

          <div v-else class="p-2.5 rounded-xl bg-sold/40 border border-line text-ink-soft text-[12px] flex items-center gap-2">
            <span class="mdi mdi-card-account-details-outline text-[16px]"></span>
            <span>No ID photo attached for this record.</span>
          </div>
        </div>

        <!-- Section 2: Additional Players Roster -->
        <div v-if="booking.players && booking.players.length" class="p-4 rounded-2xl bg-white border border-line shadow-2xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-1.5 pb-1 border-b border-line/50">
            <span class="mdi mdi-account-group text-[14px]"></span>
            <span>Registered Players ({{ booking.players.length }})</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(player, idx) in booking.players"
              :key="idx"
              class="px-2.5 py-1 rounded-lg bg-cream border border-line text-[12px] font-medium text-ink flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
              {{ player }}
            </span>
          </div>
        </div>

        <!-- Section 3: Equipment & Refreshments -->
        <div class="p-4 rounded-2xl bg-white border border-line shadow-2xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2 pb-1 border-b border-line/50 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="mdi mdi-receipt-text-outline text-[14px]"></span>
              <span>Reserved Items & Refreshments</span>
            </span>
            <span class="text-ink font-bold font-display text-[14px]">
              ₱{{ Number(booking.total_amount).toLocaleString() }}
            </span>
          </div>

          <div class="space-y-1.5 text-[12.5px]">
            <!-- Paddles -->
            <div v-for="(p, i) in booking.paddles" :key="`p-${i}`" class="flex justify-between items-center text-ink">
              <span class="flex items-center gap-1.5">
                <span class="mdi mdi-racquetball text-relish-dark text-[14px]"></span>
                {{ p.quantity }}x {{ p.name }}
              </span>
              <span class="font-medium text-ink-soft">₱{{ Number(p.subtotal).toLocaleString() }}</span>
            </div>

            <!-- Food -->
            <div v-for="(f, i) in booking.food_items" :key="`f-${i}`" class="flex justify-between items-center text-ink">
              <span class="flex items-center gap-1.5">
                <span class="mdi mdi-food text-relish-dark text-[14px]"></span>
                {{ f.quantity }}x {{ f.name }}
              </span>
              <span class="font-medium text-ink-soft">₱{{ Number(f.subtotal).toLocaleString() }}</span>
            </div>

            <!-- If none -->
            <div v-if="!booking.paddles.length && !booking.food_items.length" class="text-ink-soft text-[12px] italic">
              No extra paddles or refreshments pre-ordered.
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-4 bg-cream border-t border-line flex flex-col sm:flex-row items-center gap-2.5">
        <!-- Mark Checked-in Button -->
        <button
          v-if="!booking.checked_in"
          type="button"
          class="w-full sm:flex-1 py-3 px-4 rounded-xl bg-relish-dark hover:bg-black text-white font-bold text-[14px] shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          @click="onCheckIn"
        >
          <span class="mdi mdi-check-decagram text-[18px] text-lime"></span>
          <span>Confirm Gate Check-In</span>
        </button>

        <div v-else class="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[13px] flex items-center justify-center gap-1.5">
          <span class="mdi mdi-check-circle text-[16px] text-emerald-700"></span>
          <span>Guest Admitted at {{ booking.checked_in_at }}</span>
        </div>

        <!-- Cancel Booking Button (if active) -->
        <button
          v-if="booking.status === 'confirmed'"
          type="button"
          class="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-white border border-red-200 text-red-700 font-semibold text-[13px] hover:bg-red-50 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1"
          @click="onCancelBooking"
        >
          <span class="mdi mdi-close-circle-outline text-[16px]"></span>
          <span>Cancel</span>
        </button>
      </div>
    </div>

    <!-- Fullscreen Government ID Inspector Modal -->
    <div
      v-if="showFullId && booking.id_photo_url"
      class="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4"
      @click="showFullId = false"
    >
      <div class="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20">
        <img :src="booking.id_photo_url" alt="Enlarged ID" class="w-full h-full object-contain" />
        <button
          type="button"
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          @click="showFullId = false"
        >
          <span class="mdi mdi-close text-[18px]"></span>
        </button>
      </div>
      <div class="text-white text-[13px] mt-3 font-medium">
        {{ booking.guest_name }} — Government Issued ID
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AdminBooking } from '~/composables/useAdminData'

const props = defineProps<{
  booking: AdminBooking
}>()

const emit = defineEmits<{
  'close': []
  'check-in': [bookingId: string]
  'cancel-booking': [bookingId: string]
}>()

const showFullId = ref(false)

function onCheckIn() {
  emit('check-in', props.booking.id)
}

function onCancelBooking() {
  if (confirm(`Are you sure you want to cancel booking ${props.booking.reference}?`)) {
    emit('cancel-booking', props.booking.id)
  }
}
</script>
