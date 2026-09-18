<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
    <!-- Dialog Card Container -->
    <div class="w-full max-w-[500px] bg-white rounded-[24px] sm:rounded-[28px] border border-[#DCE6D8] shadow-2xl overflow-hidden flex flex-col max-h-[min(90vh,780px)] my-auto">
      <!-- Header -->
      <div class="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#14231C] text-white flex items-center justify-between border-b border-[#243D2F] shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-widest text-[#9ACD32]">
              Match Pass Verification
            </span>
            <span
              v-if="booking.checked_in"
              class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#059669] text-white flex items-center gap-1 shadow-xs"
            >
              <span class="mdi mdi-check-circle text-[11px]"></span>
              <span>Admitted</span>
            </span>
          </div>
          <div class="font-mono font-bold text-[17px] sm:text-[18px] text-white mt-0.5 tracking-tight">
            {{ booking.reference }}
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          @click="$emit('close')"
          aria-label="Close modal"
        >
          <span class="mdi mdi-close text-[17px]"></span>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar pb-5">
        <!-- Court & Schedule Hero Banner -->
        <div class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E8F4D8]/70 border border-[#DCE6D8] flex items-center justify-between gap-3 shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#0B6623] text-white flex items-center justify-center font-display font-extrabold text-[17px] shadow-xs shrink-0">
              <span class="mdi mdi-racquetball text-[20px] text-[#9ACD32]"></span>
            </div>
            <div>
              <div class="font-display font-bold text-[16.5px] sm:text-[17.5px] text-[#14231C] leading-tight">
                {{ booking.court_names }}
              </div>
              <div class="text-[12px] sm:text-[12.5px] text-[#66756D] font-medium mt-0.5">
                {{ booking.start_time.slice(0, 5) }} – {{ booking.end_time.slice(0, 5) }} · <strong class="text-[#14231C]">{{ booking.booking_date }}</strong>
              </div>
            </div>
          </div>

          <span
            class="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-2xs shrink-0"
            :class="booking.status === 'confirmed'
              ? 'bg-[#E8F4D8] border-[#B8DC9E] text-[#0B6623]'
              : 'bg-[#FFF4E5] border-[#FED7AA] text-[#9A3412]'"
          >
            {{ booking.status === 'confirmed' ? 'Paid & Confirmed' : booking.status }}
          </span>
        </div>

        <!-- Section 1: Booker Identity & ID Photo -->
        <div class="p-4 rounded-xl sm:rounded-2xl bg-[#FAF9F1]/70 border border-[#DCE6D8] shadow-2xs">
          <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-[#DCE6D8]/60">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[#66756D] flex items-center gap-1.5">
              <span class="mdi mdi-account-circle text-[15px] text-[#0B6623]"></span>
              <span>Booker Identity</span>
            </div>
            <span v-if="booking.id_photo_url" class="text-[11px] font-bold text-[#0B6623] flex items-center gap-1">
              <span class="mdi mdi-check-decagram text-[13px]"></span>
              <span>Valid ID Attached</span>
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 sm:gap-3 text-[13px] mb-2.5">
            <div>
              <span class="text-[10.5px] text-[#66756D] block font-medium">Full Name</span>
              <span class="font-bold text-[#14231C] text-[14px]">{{ booking.guest_name }}</span>
            </div>
            <div>
              <span class="text-[10.5px] text-[#66756D] block font-medium">Contact Phone</span>
              <span class="font-mono font-bold text-[#14231C]">{{ booking.guest_mobile || '—' }}</span>
            </div>
            <div v-if="booking.guest_facebook" class="col-span-2">
              <span class="text-[10.5px] text-[#66756D] block font-medium">Facebook Profile</span>
              <span class="text-[#0B6623] font-semibold">{{ booking.guest_facebook }}</span>
            </div>
          </div>

          <!-- Government ID Photo Preview & Inspector -->
          <div v-if="displayPhotoUrl" class="mt-2 pt-2.5 border-t border-[#DCE6D8]/60">
            <div class="text-[11px] font-semibold text-[#66756D] mb-1.5 flex items-center justify-between">
              <span>Government-Issued ID</span>
              <span class="text-[11px] text-[#0B6623] font-bold cursor-pointer hover:underline flex items-center gap-0.5" @click="showFullId = true">
                <span class="mdi mdi-magnify-plus text-[12px]"></span>
                <span>Tap photo to zoom</span>
              </span>
            </div>
            <div
              class="relative rounded-xl border border-[#DCE6D8] overflow-hidden bg-[#14231C]/5 cursor-pointer group h-[140px] sm:h-[150px] flex items-center justify-center shadow-xs"
              @click="showFullId = true"
            >
              <img
                :src="displayPhotoUrl"
                alt="Government ID"
                class="w-full h-full object-contain group-hover:scale-102 transition-transform"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-[#14231C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[12px] font-bold gap-1.5 backdrop-blur-[2px]">
                <span class="mdi mdi-magnify-plus text-[16px]"></span>
                <span>Inspect Fullscreen</span>
              </div>
            </div>
          </div>

          <div v-else class="p-2.5 rounded-xl bg-white border border-[#DCE6D8] text-[#66756D] text-[11.5px] flex items-center gap-2">
            <span class="mdi mdi-card-account-details-outline text-[16px] text-[#66756D]/70"></span>
            <span>No government ID photo was submitted with this booking.</span>
          </div>
        </div>

        <!-- Section 2: Additional Players Roster -->
        <div v-if="booking.players && booking.players.length" class="p-4 rounded-xl sm:rounded-2xl bg-[#FAF9F1]/70 border border-[#DCE6D8] shadow-2xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#66756D] mb-2 flex items-center gap-1.5 pb-2 border-b border-[#DCE6D8]/60">
            <span class="mdi mdi-account-group text-[15px] text-[#0B6623]"></span>
            <span>Registered Players ({{ booking.players.length }})</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(player, idx) in booking.players"
              :key="idx"
              class="px-2.5 py-1 rounded-lg bg-white border border-[#DCE6D8] text-[12px] font-semibold text-[#14231C] flex items-center gap-1.5 shadow-2xs"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#0B6623]"></span>
              <span>{{ player }}</span>
            </span>
          </div>
        </div>

        <!-- Section 3: Equipment & Refreshments -->
        <div class="p-4 rounded-xl sm:rounded-2xl bg-[#FAF9F1]/70 border border-[#DCE6D8] shadow-2xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#66756D] mb-2 pb-2 border-b border-[#DCE6D8]/60 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="mdi mdi-receipt-text-outline text-[15px] text-[#0B6623]"></span>
              <span>Reserved Items & Add-ons</span>
            </span>
            <span class="text-[#14231C] font-bold font-display text-[15px]">
              ₱{{ Number(booking.total_amount).toLocaleString() }}
            </span>
          </div>

          <div class="space-y-2 text-[12.5px]">
            <!-- Paddles -->
            <div v-for="(p, i) in booking.paddles" :key="`p-${i}`" class="flex justify-between items-center text-[#14231C]">
              <span class="flex items-center gap-2">
                <span class="mdi mdi-racquetball text-[#0B6623] text-[14px]"></span>
                <span class="font-semibold">{{ p.quantity }}x {{ p.name }}</span>
              </span>
              <span class="font-medium text-[#66756D]">₱{{ Number(p.subtotal).toLocaleString() }}</span>
            </div>

            <!-- Food -->
            <div v-for="(f, i) in booking.food_items" :key="`f-${i}`" class="flex justify-between items-center text-[#14231C]">
              <span class="flex items-center gap-2">
                <span class="mdi mdi-silverware-fork-knife text-[#0B6623] text-[14px]"></span>
                <span class="font-semibold">{{ f.quantity }}x {{ f.name }}</span>
              </span>
              <span class="font-medium text-[#66756D]">₱{{ Number(f.subtotal).toLocaleString() }}</span>
            </div>

            <!-- If none -->
            <div v-if="!booking.paddles.length && !booking.food_items.length" class="text-[#66756D] text-[12px] italic">
              No extra rental paddles or refreshments ordered.
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-3.5 sm:p-4 bg-[#FAF9F1] border-t border-[#DCE6D8] flex flex-col sm:flex-row items-center gap-2 shrink-0">
        <!-- Mark Checked-in Button -->
        <button
          v-if="!booking.checked_in"
          type="button"
          class="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[#0B6623] hover:bg-[#08521C] text-white font-bold text-[13.5px] shadow-[0_3px_12px_rgba(11,102,35,0.25)] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          @click="onCheckIn"
        >
          <span class="mdi mdi-check-decagram text-[18px] text-[#9ACD32]"></span>
          <span>Confirm Gate Check-In</span>
        </button>

        <div
          v-else
          class="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[#D1FAE5] border border-[#6EE7B7] text-[#065F46] font-bold text-[13px] flex items-center justify-center gap-2 shadow-2xs"
        >
          <span class="mdi mdi-check-circle text-[17px] text-[#059669]"></span>
          <span>Guest Admitted · {{ booking.checked_in_at || 'Checked In' }}</span>
        </div>

        <!-- Cancel Booking Button (if active) -->
        <button
          v-if="booking.status === 'confirmed'"
          type="button"
          class="w-full sm:w-auto py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-white border border-[#FECACA] text-[#D94A4A] font-bold text-[12.5px] hover:bg-[#FDE8E8] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          @click="onCancelBooking"
        >
          <span class="mdi mdi-close-circle-outline text-[15px]"></span>
          <span>Cancel Booking</span>
        </button>
      </div>
    </div>

    <!-- Fullscreen Government ID Inspector Modal -->
    <div
      v-if="showFullId && displayPhotoUrl"
      class="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
      @click="showFullId = false"
    >
      <div class="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black" @click.stop>
        <img :src="displayPhotoUrl" alt="Enlarged ID" class="w-full h-full object-contain max-h-[80vh]" />
        <button
          type="button"
          class="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
          @click="showFullId = false"
        >
          <span class="mdi mdi-close text-[20px]"></span>
        </button>
      </div>
      <div class="text-white text-[13.5px] mt-3.5 font-bold tracking-tight">
        {{ booking.guest_name }} — Government Identification Card
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
const displayPhotoUrl = ref(props.booking.id_photo_url || '')

watch(() => props.booking.id_photo_url, (newVal) => {
  displayPhotoUrl.value = newVal || ''
})

function handleImageError() {
  if (!displayPhotoUrl.value) return
  // If remote Supabase public URL failed (e.g. private bucket or network error), fallback to internal proxy
  const filename = displayPhotoUrl.value.split('/').pop()?.split('?')[0]
  if (filename && !displayPhotoUrl.value.startsWith('/api/booking/id-photo/')) {
    displayPhotoUrl.value = `/api/booking/id-photo/${filename}`
  }
}

function onCheckIn() {
  emit('check-in', props.booking.id)
}

function onCancelBooking() {
  if (confirm(`Are you sure you want to cancel booking ${props.booking.reference}?`)) {
    emit('cancel-booking', props.booking.id)
  }
}
</script>
