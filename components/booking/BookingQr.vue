<template>
  <div class="text-center pt-1 pb-8 max-w-[420px] mx-auto">
    <!-- Success Celebration Emblem -->
    <div class="relative mx-auto mb-3.5 flex flex-col items-center">
      <!-- Animated Ripple Rings & Emblem -->
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-lime/25 animate-ping opacity-75"></div>
        <div class="absolute -inset-1 rounded-full bg-lime/20 animate-pulse"></div>
        <div class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#223318] via-[#2E4A1A] to-[#436D20] text-cream flex items-center justify-center shadow-lg border-2 border-lime/40">
          <!-- Athletic Pickleball Paddle & Checkmark SVG -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="text-lime">
            <!-- Pickleball Ball with Holes -->
            <circle cx="16.5" cy="7.5" r="4.5" stroke="#96C33E" stroke-width="1.8" fill="#EAF1CE" />
            <circle cx="15.5" cy="6.5" r="0.7" fill="#38591A" />
            <circle cx="17.5" cy="6.5" r="0.7" fill="#38591A" />
            <circle cx="16.5" cy="8.5" r="0.7" fill="#38591A" />
            <!-- Paddle Outline -->
            <path d="M4 14.5C4 11.46 6.46 9 9.5 9C12.54 9 15 11.46 15 14.5C15 16.2 14.2 17.7 13 18.7V21.5C13 21.8 12.8 22 12.5 22H6.5C6.2 22 6 21.8 6 21.5V18.7C4.8 17.7 4 16.2 4 14.5Z" stroke="#F5F1DE" stroke-width="1.8" stroke-linejoin="round" />
            <!-- Checkmark badge -->
            <path d="M7 14L9 16L12.5 12.5" stroke="#96C33E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <!-- Mini Verified Check Badge -->
        <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-lime border-2 border-cream flex items-center justify-center text-[10px] text-ink font-extrabold shadow-sm">
          ✓
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
        <p class="text-ink-soft text-[13px] mt-0.5 mb-0">
          Present your digital match pass at the front desk terminal.
        </p>
      </div>
    </div>

    <!-- DIGITAL MATCH PASS TICKET -->
    <div class="relative bg-white border border-line rounded-[22px] shadow-[0_10px_30px_-10px_rgba(34,51,24,0.12)] text-left mb-4 overflow-hidden">
      <!-- Ticket Header Bar -->
      <div class="bg-gradient-to-r from-[#1E3314] via-[#2A481B] to-[#1E3314] text-white px-4 py-3 flex items-center justify-between border-b border-[#2E4F1E]">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-lime"></span>
          <span class="text-[11px] font-bold tracking-[0.08em] text-lime uppercase">Match Pass</span>
        </div>
        <!-- Booking Ref Pill with Copy Button -->
        <button
          type="button"
          @click="copyReference"
          class="flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-cream text-[12px] font-mono px-2.5 py-1 rounded-full border border-white/10 transition-colors cursor-pointer group"
          title="Click to copy reference"
        >
          <span>{{ bookingRef }}</span>
          <svg v-if="!copiedRef" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="text-lime group-hover:scale-110 transition-transform">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span v-else class="text-lime font-bold text-[11px] animate-fade-in">Copied!</span>
        </button>
      </div>

      <!-- Court Hero Details -->
      <div class="p-5 pb-3">
        <div class="flex justify-between items-start gap-2">
          <div>
            <div class="text-[11px] font-bold tracking-wider uppercase text-ink-soft mb-0.5">Assigned Court</div>
            <h3 class="font-display font-bold text-[24px] text-ink m-0 leading-tight">
              {{ courtName }}
            </h3>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-lime-soft/70 border border-lime/30 text-lime-text font-bold text-[11px] uppercase tracking-wide">
            {{ courtType ? courtType + ' Court' : 'Indoor Court' }}
          </span>
        </div>

        <!-- Time & Schedule Banner -->
        <div class="mt-3.5 p-3 rounded-xl bg-cream/70 border border-line/70 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white border border-line/60 flex items-center justify-center text-ink flex-shrink-0">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <div class="font-bold text-[14px] text-ink leading-tight">{{ slotRange }}</div>
              <div class="text-[12px] text-ink-soft">{{ dateLabel }}</div>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[11px] font-semibold text-ink-soft bg-white/80 px-2 py-0.5 rounded-md border border-line/50">
              {{ durationLabel }}
            </span>
          </div>
        </div>

        <!-- Scannable QR Code Section -->
        <div class="my-5 flex flex-col items-center justify-center">
          <div class="relative p-3 bg-white rounded-2xl border border-line shadow-xs group">
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
          <div class="flex items-center gap-1.5 mt-2.5 text-[11.5px] text-ink-soft font-medium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
            </svg>
            <span>Scan at front desk terminal upon arrival</span>
          </div>
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

      <!-- Pass Amenities & Receipt Breakdown -->
      <div class="p-5 pt-4 bg-cream-card/50">
        <div class="text-[11px] font-bold tracking-wider uppercase text-ink-soft mb-2">Reservation Breakdown</div>

        <div class="space-y-2.5 text-[13.5px]">
          <!-- Payment Row -->
          <div class="flex justify-between items-center py-1">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                ✓
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
                ✓
              </div>
              <span class="font-medium text-ink">Court Access</span>
            </div>
            <span class="text-ink-soft font-medium">Reserved & Guaranteed</span>
          </div>

          <!-- Paddles Row -->
          <div class="flex justify-between items-center py-1 border-t border-line/40">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                ✓
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
                ✓
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
                👤
              </div>
              <span class="font-medium text-ink">Booker Name</span>
            </div>
            <span class="text-ink-soft font-medium">{{ bookerName }}</span>
          </div>
        </div>

        <!-- Match Guidelines Note -->
        <div class="mt-4 p-3 rounded-xl bg-cream border border-line text-[12px] text-ink-soft flex items-start gap-2.5">
          <span class="text-[14px]">💡</span>
          <p class="m-0 leading-relaxed">
            Please arrive <strong class="text-ink font-semibold">10 minutes before</strong> your time slot. Non-marking indoor court shoes are recommended.
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Utilities Action Bar -->
    <div class="grid grid-cols-2 gap-2.5 mb-4">
      <!-- Add to Calendar Button -->
      <button
        type="button"
        @click="addToCalendar"
        class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-line text-ink hover:bg-cream/60 active:scale-[0.98] transition-all text-[13px] font-semibold shadow-xs cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-ink-soft">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Add to Calendar</span>
      </button>

      <!-- Share Match Pass -->
      <button
        type="button"
        @click="sharePass"
        class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-line text-ink hover:bg-cream/60 active:scale-[0.98] transition-all text-[13px] font-semibold shadow-xs cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-ink-soft">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>{{ shareFeedback || 'Share Pass' }}</span>
      </button>
    </div>

    <!-- Primary Action: Book Another Court -->
    <button
      type="button"
      @click="$emit('restart')"
      class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-ink text-cream font-bold text-[15px] shadow-[0_6px_20px_-4px_rgba(34,51,24,0.4)] hover:bg-[#2e4a1a] hover:shadow-[0_8px_25px_-4px_rgba(34,51,24,0.5)] active:scale-[0.98] transition-all cursor-pointer group"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform group-hover:rotate-90 duration-200 text-lime"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span>Book another court</span>
    </button>

    <!-- Secondary Action: View in Lookup -->
    <NuxtLink
      :to="`/lookup?ref=${bookingRef}`"
      class="mt-3 inline-flex items-center gap-1.5 text-ink-soft hover:text-ink text-[13px] font-medium transition-colors"
    >
      <span>Find this in Booking Lookup & Receipts</span>
      <span>→</span>
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
const shareFeedback = ref('')

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

async function sharePass() {
  const shareText = `🎾 PickleBook Reservation Pass\nRef: ${props.bookingRef}\nCourt: ${props.courtName}\nSchedule: ${props.slotRange} · ${props.dateLabel}\nStatus: Paid & Confirmed`

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `PickleBook Pass - ${props.courtName}`,
        text: shareText,
        url: typeof window !== 'undefined' ? `${window.location.origin}/lookup?ref=${props.bookingRef}` : undefined,
      })
      return
    } catch {
      // User cancelled or share failed, fallback to copy
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(shareText)
    shareFeedback.value = 'Pass Copied!'
    setTimeout(() => {
      shareFeedback.value = ''
    }, 2000)
  } catch {
    shareFeedback.value = 'Unable to copy'
  }
}

function addToCalendar() {
  // Generate Google Calendar Link
  const title = encodeURIComponent(`Pickleball Match: ${props.courtName}`)
  const details = encodeURIComponent(
    `PickleBook Confirmed Reservation\nCourt: ${props.courtName}\nReference: ${props.bookingRef}\nStatus: Confirmed`
  )
  const location = encodeURIComponent('PickleBook Court Club')

  // Parse dates if available
  let startIso = ''
  let endIso = ''

  if (props.dateIso && props.startTime && props.endTime) {
    const cleanDate = props.dateIso.replace(/-/g, '')
    const cleanStart = props.startTime.replace(/:/g, '').slice(0, 6)
    const cleanEnd = props.endTime.replace(/:/g, '').slice(0, 6)
    startIso = `${cleanDate}T${cleanStart}`
    endIso = `${cleanDate}T${cleanEnd}`
  } else {
    // Default fallback
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    startIso = `${y}${m}${d}T080000`
    endIso = `${y}${m}${d}T090000`
  }

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`
  window.open(gCalUrl, '_blank')
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
