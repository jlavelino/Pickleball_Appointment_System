<template>
  <div class="text-center pt-1 pb-8 max-w-[420px] mx-auto">
    <!-- Success Celebration Emblem -->
    <div class="relative mx-auto mb-3.5 flex flex-col items-center">
      <!-- Animated Ripple Rings & Emblem -->
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-lime/25 animate-ping opacity-75"></div>
        <div class="absolute -inset-1 rounded-full bg-lime/20 animate-pulse"></div>
        <div class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#223318] via-[#2E4A1A] to-[#436D20] text-cream flex items-center justify-center shadow-lg border-2 border-lime/40">
          <!-- Athletic Check Celebration MDI icon -->
          <span class="mdi mdi-check-decagram text-[30px] text-lime"></span>
        </div>
        <!-- Mini Verified Check Badge -->
        <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-lime border-2 border-cream flex items-center justify-center text-ink shadow-sm">
          <span class="mdi mdi-check text-[11px] font-bold"></span>
        </div>
      </div>

      <!-- Celebration Heading -->
      <div class="mt-2.5">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-soft border border-lime/30 text-lime-text text-[11.5px] font-bold uppercase tracking-wider mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#3F6019] animate-pulse"></span>
          Pass Confirmed · Ready for Play
        </div>
        <h2 class="font-display font-semibold text-[23px] text-ink m-0 leading-tight">
          You're on the court!
        </h2>
        <p class="text-ink-soft text-[13.5px] mt-0.5 mb-0">
          Show this pass at the gate
        </p>
      </div>
    </div>

    <!-- DIGITAL MATCH PASS TICKET -->
    <div class="relative bg-white border border-line rounded-[22px] shadow-[0_10px_30px_-10px_rgba(34,51,24,0.10)] text-left mb-4 overflow-hidden">

      <!-- Scannable QR Code Section (Top Stub) -->
      <div class="p-6 pb-5 flex flex-col items-center justify-center text-center bg-white">
        <div class="relative p-3 bg-white rounded-2xl border border-line shadow-xs group mb-3">
          <!-- Viewfinder Corner Brackets -->
          <div class="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-ink rounded-tl-sm"></div>
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-ink rounded-tr-sm"></div>
          <div class="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-ink rounded-bl-sm"></div>
          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-ink rounded-br-sm"></div>

          <!-- Dynamic Scannable QR -->
          <div class="w-[150px] h-[150px] flex items-center justify-center bg-white">
            <img
              v-if="qrCodeUrl"
              :src="qrCodeUrl"
              alt="Booking QR Code"
              class="w-[146px] h-[146px] object-contain rounded-sm"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-ink-soft gap-2">
              <div class="w-6 h-6 border-2 border-lime border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[11px]">Generating pass...</span>
            </div>
          </div>
        </div>

        <!-- Booking Ref Pill with Copy Feedback -->
        <button
          type="button"
          @click="copyReference"
          class="inline-flex items-center gap-2 bg-[#EFEAD8] hover:bg-[#E8E1CB] text-ink text-[13.5px] font-mono px-4 py-1.5 rounded-full border border-[#DFD8BE] transition-colors cursor-pointer group shadow-xs active:scale-95"
          title="Click to copy reference"
        >
          <span class="font-semibold">{{ bookingRef }}</span>
          <span v-if="!copiedRef" class="mdi mdi-content-copy text-[13px] text-ink-soft group-hover:text-ink transition-colors"></span>
          <span v-else class="text-relish-dark font-bold text-[11.5px] animate-fade-in">Copied!</span>
        </button>

        <div class="flex items-center gap-1.5 mt-2.5 text-[11.5px] text-ink-soft font-medium">
          <span class="mdi mdi-qrcode-scan text-[13px]"></span>
          <span>Scan at front desk terminal upon arrival</span>
        </div>
      </div>

      <!-- Ticket Perforation Notches & Dashed Line -->
      <div class="relative flex items-center my-0 px-3">
        <!-- Left Cutout Notch -->
        <div class="absolute -left-3 w-6 h-6 rounded-full bg-cream border-r border-line shadow-inner"></div>
        <!-- Dashed Divider -->
        <div class="w-full border-t border-dashed border-line"></div>
        <!-- Right Cutout Notch -->
        <div class="absolute -right-3 w-6 h-6 rounded-full bg-cream border-l border-line shadow-inner"></div>
      </div>

      <!-- Court & Schedule Session Details (Below Perforation) -->
      <div class="p-5 pb-4 text-center bg-white border-b border-line/40">
        <div class="text-ink-soft font-mono text-[12.5px] tracking-wider mb-1">
          {{ bookingRef }}
        </div>
        <h3 class="font-display font-bold text-[26px] text-ink m-0 leading-tight">
          {{ courtName }}
        </h3>
        <div class="text-[13.5px] text-ink-soft font-medium mt-1">
          {{ slotRange }} · {{ dateLabel }}
        </div>
      </div>

      <!-- Pass Amenities & Receipt Breakdown -->
      <div class="p-5 pt-4 bg-cream-card/50">
        <div class="text-[11px] font-bold tracking-wider uppercase text-ink-soft mb-2">Reservation Breakdown</div>

        <div class="space-y-2.5 text-[13.5px]">
          <!-- Payment Row -->
          <div class="flex justify-between items-center py-1">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                <span class="mdi mdi-check text-[11px]"></span>
              </div>
              <span class="font-medium text-ink">Payment Status</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-ink">Paid · {{ payMethodLabel }}</span>
              <span v-if="totalAmount > 0" class="text-[12px] text-ink-soft block">
                ₱{{ Number(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
          </div>

          <!-- Court Row -->
          <div class="flex justify-between items-center py-1 border-t border-line/40">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                <span class="mdi mdi-check text-[11px]"></span>
              </div>
              <span class="font-medium text-ink">Court Access</span>
            </div>
            <span class="text-ink-soft font-medium">Reserved & Guaranteed</span>
          </div>

          <!-- Paddles Row -->
          <div class="flex justify-between items-center py-1 border-t border-line/40">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                <span class="mdi mdi-check text-[11px]"></span>
              </div>
              <span class="font-medium text-ink">Paddles</span>
            </div>
            <span class="text-ink-soft font-medium">
              {{ paddleCount > 0 ? `${paddleCount} paddle${paddleCount > 1 ? 's' : ''} reserved` : 'None requested' }}
            </span>
          </div>

          <!-- Food Row -->
          <div class="flex justify-between items-center py-1 border-t border-line/40">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                <span class="mdi mdi-check text-[11px]"></span>
              </div>
              <span class="font-medium text-ink">Refreshments</span>
            </div>
            <span class="text-ink-soft font-medium">
              {{ foodCount > 0 ? `${foodCount} item${foodCount > 1 ? 's' : ''} preparing` : 'No food ordered' }}
            </span>
          </div>

          <!-- Booker Name if available -->
          <div v-if="bookerName" class="flex justify-between items-center py-1 border-t border-line/40">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-cream text-ink flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                <span class="mdi mdi-account text-[13px]"></span>
              </div>
              <span class="font-medium text-ink">Booker Name</span>
            </div>
            <span class="text-ink-soft font-medium">{{ bookerName }}</span>
          </div>
        </div>

        <!-- Match Guidelines Note -->
        <div class="mt-4 p-3 rounded-xl bg-cream border border-line text-[12px] text-ink-soft flex items-start gap-2.5">
          <span class="mdi mdi-lightbulb-on-outline text-[15px] text-amber-600 shrink-0"></span>
          <p class="m-0 leading-relaxed">
            Please arrive <strong class="text-ink font-semibold">10 minutes before</strong> your time slot. Non-marking indoor court shoes are recommended.
          </p>
        </div>
      </div>
    </div>

    <!-- Primary Action: Book Another Court -->
    <button
      type="button"
      @click="$emit('restart')"
      class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-ink text-cream font-bold text-[15px] shadow-[0_6px_20px_-4px_rgba(34,51,24,0.4)] hover:bg-[#2e4a1a] hover:shadow-[0_8px_25px_-4px_rgba(34,51,24,0.5)] active:scale-[0.98] transition-all cursor-pointer group"
    >
      <span class="mdi mdi-plus text-[18px] text-lime transition-transform group-hover:rotate-90 duration-200"></span>
      <span>Book another court</span>
    </button>

    <!-- Secondary Action: View in Lookup -->
    <NuxtLink
      :to="`/lookup?ref=${bookingRef}`"
      class="mt-3 inline-flex items-center gap-1.5 text-ink-soft hover:text-ink text-[13px] font-medium transition-colors"
    >
      <span>Find this in Booking Lookup & Receipts</span>
      <span class="mdi mdi-arrow-right text-[13px]"></span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    bookingRef: string
    courtName: string
    courtType?: string
    slotRange: string
    dateLabel: string
    dateIso?: string
    startTime?: string
    endTime?: string
    payMethod: 'gcash' | 'maya' | string
    totalAmount?: number
    paddleCount?: number
    foodCount?: number
    bookerName?: string
    bookerMobile?: string
  }>(),
  {
    courtType: 'indoor',
    totalAmount: 0,
    paddleCount: 0,
    foodCount: 0,
    bookerName: '',
    bookerMobile: '',
  }
)

defineEmits<{
  restart: []
}>()

const qrCodeUrl = ref<string>('')
const copiedRef = ref(false)

const payMethodLabel = computed(() => {
  const m = String(props.payMethod || '').toLowerCase()
  if (m === 'maya') return 'Maya'
  return 'GCash'
})

const durationLabel = computed(() => {
  if (props.startTime && props.endTime) {
    const sh = parseInt(props.startTime.split(':')[0]) || 0
    let eh = parseInt(props.endTime.split(':')[0]) || 0
    if (eh === 0) eh = 24
    const diff = Math.max(1, eh - sh)
    return `${diff} hr${diff > 1 ? 's' : ''} session`
  }
  return '1 hr session'
})

onMounted(async () => {
  // Scroll to top so the celebration emblem is always visible
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  try {
    const QRCode = (await import('qrcode')).default
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const lookupUrl = origin ? `${origin}/lookup?ref=${props.bookingRef}` : props.bookingRef

    qrCodeUrl.value = await QRCode.toDataURL(lookupUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#223318',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
  } catch (err) {
    console.error('Failed to generate scannable QR code:', err)
  }
})

async function copyReference() {
  try {
    await navigator.clipboard.writeText(props.bookingRef)
    copiedRef.value = true
    setTimeout(() => {
      copiedRef.value = false
    }, 2000)
  } catch (err) {
    console.warn('Clipboard copy failed:', err)
  }
}


</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
