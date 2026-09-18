<template>
  <div class="text-center pt-1 pb-8 max-w-[420px] mx-auto">
    <!-- Success Celebration Emblem -->
    <div class="relative mx-auto mb-3.5 flex flex-col items-center">
      <!-- Animated Rings & Emblem -->
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-[#9ACD32]/25 animate-ping opacity-75"></div>
        <div class="absolute -inset-1 rounded-full bg-[#9ACD32]/20 animate-pulse"></div>
        <div class="relative w-14 h-14 rounded-full bg-[#14231C] text-white flex items-center justify-center shadow-md border-2 border-[#9ACD32]/50">
          <span class="mdi mdi-check-decagram text-[30px] text-[#9ACD32]"></span>
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#9ACD32] border-2 border-[#FAF9F1] flex items-center justify-center text-[#14231C] shadow-xs">
          <span class="mdi mdi-check text-[11px] font-bold"></span>
        </div>
      </div>

      <!-- Celebration Heading -->
      <div class="mt-2.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F4D8] border border-[#DCE6D8] text-[#0B6623] text-[11.5px] font-bold uppercase tracking-wider mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#0B6623]"></span>
          Pass Confirmed · Ready for Play
        </div>
        <h2 class="font-display font-bold text-[24px] text-[#14231C] m-0 leading-tight">
          You're on the court!
        </h2>
        <p class="text-[#66756D] text-[13.5px] mt-0.5 mb-0">
          Show this match pass at the reception desk
        </p>
      </div>
    </div>

    <!-- DIGITAL MATCH PASS TICKET -->
    <div class="relative bg-white border border-[#DCE6D8] rounded-[22px] shadow-subtle text-left mb-4 overflow-hidden">
      <!-- Scannable QR Code Section (Top Stub) -->
      <div class="p-6 pb-5 flex flex-col items-center justify-center text-center bg-white">
        <div class="relative p-3 bg-white rounded-2xl border border-[#DCE6D8] shadow-xs group mb-3">
          <!-- Viewfinder Corner Brackets -->
          <div class="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#0B6623] rounded-tl-sm"></div>
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#0B6623] rounded-tr-sm"></div>
          <div class="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#0B6623] rounded-bl-sm"></div>
          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#0B6623] rounded-br-sm"></div>

          <!-- Dynamic Scannable QR -->
          <div class="w-[150px] h-[150px] flex items-center justify-center bg-white">
            <img
              v-if="qrCodeUrl"
              :src="qrCodeUrl"
              alt="Booking QR Code"
              class="w-[146px] h-[146px] object-contain rounded-sm"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-[#66756D] gap-2">
              <div class="w-6 h-6 border-2 border-[#0B6623] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[11px]">Generating pass...</span>
            </div>
          </div>
        </div>

        <!-- Booking Ref Pill with Copy Feedback -->
        <button
          type="button"
          @click="copyReference"
          class="inline-flex items-center gap-2 bg-[#FAF9F1] hover:bg-[#E8F4D8] text-[#14231C] text-[13.5px] font-mono px-4 py-1.5 rounded-full border border-[#DCE6D8] transition-colors cursor-pointer group shadow-xs active:scale-95"
          title="Click to copy reference"
        >
          <span class="font-bold">{{ bookingRef }}</span>
          <span v-if="!copiedRef" class="mdi mdi-content-copy text-[13px] text-[#66756D] group-hover:text-[#0B6623] transition-colors"></span>
          <span v-else class="text-[#0B6623] font-bold text-[11.5px] animate-fade-in">Copied!</span>
        </button>

        <div class="flex items-center gap-1.5 mt-2.5 text-[11.5px] text-[#66756D] font-medium">
          <span class="mdi mdi-qrcode-scan text-[13px] text-[#0B6623]"></span>
          <span>Scan at front desk terminal upon arrival</span>
        </div>
      </div>

      <!-- Ticket Perforation Notches & Dashed Line -->
      <div class="relative flex items-center my-0 px-3">
        <div class="absolute -left-3 w-6 h-6 rounded-full bg-[#FAF9F1] border-r border-[#DCE6D8] shadow-inner"></div>
        <div class="w-full border-t border-dashed border-[#DCE6D8]"></div>
        <div class="absolute -right-3 w-6 h-6 rounded-full bg-[#FAF9F1] border-l border-[#DCE6D8] shadow-inner"></div>
      </div>

      <!-- Court & Schedule Session Details -->
      <div class="p-5 pb-4 text-center bg-white border-b border-[#DCE6D8]">
        <div class="text-[#66756D] font-mono text-[12px] tracking-wider mb-1">
          {{ bookingRef }}
        </div>
        <h3 class="font-display font-bold text-[24px] text-[#14231C] m-0 leading-tight">
          {{ courtName }}
        </h3>
        <div class="text-[13.5px] text-[#66756D] font-medium mt-1">
          {{ slotRange }} · {{ dateLabel }}
        </div>
      </div>

      <!-- Detailed Info Strip -->
      <div class="p-5 bg-white space-y-2.5 text-[13px]">
        <div class="flex justify-between items-center py-1">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center text-[11px] font-bold shrink-0">
              <span class="mdi mdi-clock-outline text-[12px]"></span>
            </div>
            <span class="font-medium text-[#14231C]">Playing Duration</span>
          </div>
          <span class="font-semibold text-[#14231C]">{{ durationLabel }}</span>
        </div>

        <div class="flex justify-between items-center py-1 border-t border-[#DCE6D8]/60">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center text-[11px] font-bold shrink-0">
              <span class="mdi mdi-credit-card-outline text-[12px]"></span>
            </div>
            <span class="font-medium text-[#14231C]">Paid via {{ payMethodLabel }}</span>
          </div>
          <span class="font-bold text-[#0B6623]">₱{{ (totalAmount || 0).toLocaleString() }}</span>
        </div>

        <div class="flex justify-between items-center py-1 border-t border-[#DCE6D8]/60">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center text-[11px] font-bold shrink-0">
              <span class="mdi mdi-tennis text-[12px]"></span>
            </div>
            <span class="font-medium text-[#14231C]">Paddles</span>
          </div>
          <span class="text-[#66756D] font-medium">
            {{ paddleCount > 0 ? `${paddleCount} paddle${paddleCount > 1 ? 's' : ''} reserved` : 'None requested' }}
          </span>
        </div>

        <div class="flex justify-between items-center py-1 border-t border-[#DCE6D8]/60">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center text-[11px] font-bold shrink-0">
              <span class="mdi mdi-food-outline text-[12px]"></span>
            </div>
            <span class="font-medium text-[#14231C]">Refreshments</span>
          </div>
          <span class="text-[#66756D] font-medium">
            {{ foodCount > 0 ? `${foodCount} item${foodCount > 1 ? 's' : ''} preparing` : 'No food ordered' }}
          </span>
        </div>

        <div v-if="bookerName" class="flex justify-between items-center py-1 border-t border-[#DCE6D8]/60">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#FAF9F1] text-[#14231C] flex items-center justify-center text-[11px] font-bold shrink-0">
              <span class="mdi mdi-account text-[13px]"></span>
            </div>
            <span class="font-medium text-[#14231C]">Booker Name</span>
          </div>
          <span class="text-[#66756D] font-medium">{{ bookerName }}</span>
        </div>

        <!-- Match Guidelines Note -->
        <div class="mt-4 p-3 rounded-xl bg-[#FAF9F1] border border-[#DCE6D8] text-[12px] text-[#66756D] flex items-start gap-2.5">
          <span class="mdi mdi-information-outline text-[16px] text-[#0B6623] shrink-0"></span>
          <p class="m-0 leading-relaxed text-left">
            Please arrive <strong class="text-[#14231C] font-semibold">10 minutes before</strong> your time slot. Non-marking indoor court shoes are required.
          </p>
        </div>
      </div>
    </div>

    <!-- Primary Action: Book Another Court -->
    <button
      type="button"
      @click="$emit('restart')"
      class="btn-primary w-full"
    >
      <span class="mdi mdi-plus text-[18px]"></span>
      <span>Book another court</span>
    </button>

    <!-- Secondary Action: View in Lookup -->
    <NuxtLink
      :to="`/lookup?ref=${bookingRef}`"
      class="mt-3.5 inline-flex items-center gap-1.5 text-[#66756D] hover:text-[#0B6623] text-[13px] font-medium transition-colors"
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
        dark: '#14231C',
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
