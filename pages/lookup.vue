<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-8">

      <!-- Page header -->
      <div class="mb-5 mt-1">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-card border border-line text-[11.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
          <span>Match Pass & Reservation Search</span>
        </div>
        <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
          Find your booking
        </h1>
        <p class="text-[14px] text-ink-soft mt-1 mb-0 leading-relaxed">
          Access your digital match pass, court details, and receipt.
        </p>
      </div>

      <!-- Search input container -->
      <div class="p-3.5 rounded-2xl bg-cream-card border border-line shadow-xs mb-4">
        <div class="relative mb-2.5">
          <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-ink-soft">
            <span class="mdi mdi-magnify text-[18px]"></span>
          </div>
          <input
            id="lookup-search-input"
            v-model="query"
            type="text"
            placeholder="e.g. PB-20260915-... or full name"
            autocomplete="off"
            class="lookup-input font-mono"
            @keydown.enter="search"
          />
          <button
            v-if="query"
            type="button"
            class="absolute inset-y-0 right-3 flex items-center text-ink-soft hover:text-ink transition-colors"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <span class="mdi mdi-close text-[16px]"></span>
          </button>
        </div>

        <!-- Quick tips / search button -->
        <button
          id="lookup-search-btn"
          type="button"
          class="lookup-search-btn"
          :disabled="loading || !query.trim()"
          @click="search"
        >
          <span v-if="loading" class="mdi mdi-loading animate-spin text-[16px]"></span>
          <span v-else class="mdi mdi-magnify text-[16px]"></span>
          <span>{{ loading ? 'Searching records…' : 'Locate Booking' }}</span>
        </button>
      </div>

      <!-- Error banner -->
      <div
        v-if="error"
        class="mt-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-[13px] font-medium leading-snug flex items-center gap-2"
      >
        <span class="mdi mdi-alert-circle text-[16px] text-red-600 shrink-0"></span>
        <span>{{ error }}</span>
      </div>

      <!-- Empty / No results -->
      <div
        v-else-if="searched && results.length === 0"
        class="mt-6 flex flex-col items-center text-center gap-2 py-8 bg-cream-card rounded-2xl border border-line"
      >
        <div class="w-12 h-12 rounded-2xl bg-sold border border-line flex items-center justify-center text-relish-dark mb-1">
          <span class="mdi mdi-magnify-remove-outline text-[26px]"></span>
        </div>
        <p class="font-display font-bold text-[17px] text-ink m-0">No booking found</p>
        <p class="text-[13px] text-ink-soft m-0 max-w-[240px] leading-relaxed">
          Please check the reference number or verify spelling of your full name.
        </p>
      </div>

      <!-- Results list -->
      <div v-else-if="results.length > 0" class="mt-4 flex flex-col gap-4">
        <div class="flex items-center justify-between px-1">
          <span class="text-[12px] font-bold uppercase tracking-wider text-ink-soft">
            {{ results.length }} match pass{{ results.length !== 1 ? 'es' : '' }} found
          </span>
        </div>

        <div
          v-for="b in results"
          :id="`result-${b.reference}`"
          :key="b.id"
          class="ticket-pass-card"
        >
          <!-- Top Header Strip: Ref & Status -->
          <div class="p-4 bg-ink text-cream rounded-t-[18px] flex items-center justify-between">
            <div>
              <div class="text-[10px] font-bold uppercase tracking-widest text-cream/60">
                OFFICIAL MATCH PASS
              </div>
              <div class="font-mono font-bold text-[17px] tracking-tight text-white mt-0.5">
                {{ b.reference }}
              </div>
            </div>

            <span class="status-badge" :class="statusClass(b.status)">
              {{ statusLabel(b.status) }}
            </span>
          </div>

          <!-- Ticket body -->
          <div class="p-4 bg-white">
            <!-- Court Hero line -->
            <div class="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-line/60">
              <div>
                <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft">Reserved Facility</div>
                <div class="font-display font-bold text-[17px] text-ink">{{ b.court_names }}</div>
              </div>

              <!-- Quick QR Button -->
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F4D8] hover:bg-[#D4EBC0] text-[#0B6623] text-[12px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer border border-[#B8DC9E]"
                @click="openQrModal(b)"
              >
                <span class="mdi mdi-qrcode text-[15px]"></span>
                <span>View QR Pass</span>
              </button>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
              <div>
                <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft mb-0.5">Guest Booker</div>
                <div class="font-semibold text-ink">{{ b.guest_name }}</div>
              </div>
              <div>
                <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft mb-0.5">Match Date</div>
                <div class="font-semibold text-ink">{{ formatDate(b.booking_date) }}</div>
              </div>
              <div>
                <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft mb-0.5">Session Window</div>
                <div class="font-semibold text-ink">
                  {{ formatTime(b.start_time) }} – {{ formatTime(b.end_time) }}
                </div>
              </div>
              <div>
                <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft mb-0.5">Duration</div>
                <div class="font-semibold text-ink">
                  {{ b.duration_hours }} hr{{ b.duration_hours > 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <!-- Co-players if any -->
            <div v-if="b.players && b.players.length > 0" class="mt-3 pt-3 border-t border-line/60">
              <div class="text-[10.5px] font-bold uppercase tracking-wider text-ink-soft mb-1.5">Registered Squad</div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="player in b.players"
                  :key="player"
                  class="px-2 py-0.5 rounded-md text-[11.5px] bg-cream border border-line text-ink font-medium"
                >
                  {{ player }}
                </span>
              </div>
            </div>

            <!-- Order breakdown line items -->
            <div class="mt-3.5 pt-3 border-t border-line/60 flex flex-col gap-1.5 text-[12.5px]">
              <div class="flex justify-between items-center text-ink-soft">
                <span>Court access ({{ b.duration_hours }}h)</span>
                <span class="font-semibold text-ink">₱{{ Number(b.court_total).toLocaleString() }}</span>
              </div>
              <div v-if="b.paddle_total > 0" class="flex justify-between items-center text-ink-soft">
                <span>Paddle rentals</span>
                <span class="font-semibold text-ink">₱{{ Number(b.paddle_total).toLocaleString() }}</span>
              </div>
              <div v-if="b.food_total > 0" class="flex justify-between items-center text-ink-soft">
                <span>Court-side refreshments</span>
                <span class="font-semibold text-ink">₱{{ Number(b.food_total).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Ticket footer: Total & Payment Method -->
            <div class="mt-3 pt-3 border-t border-line flex items-center justify-between">
              <div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Total Paid</div>
                <div v-if="b.payment_method" class="text-[11px] text-ink-soft">
                  via {{ b.payment_method.toUpperCase() }}
                </div>
              </div>
              <span class="font-display font-extrabold text-[20px] text-ink">
                {{ b.total_amount != null ? `₱${Number(b.total_amount).toLocaleString()}` : '—' }}
              </span>
            </div>

            <!-- Active Hold Alert Banner -->
            <div
              v-if="isHoldActive(b)"
              class="mt-3.5 p-3.5 rounded-xl bg-[#FFF4E5] border border-[#FED7AA] text-[#9A3412] text-[13px]"
            >
              <div class="flex items-center justify-between mb-1.5 font-bold">
                <span class="flex items-center gap-1.5">
                  <span class="mdi mdi-clock-alert-outline text-[16px] text-[#D98216]"></span>
                  <span>Payment Pending · Hold Active</span>
                </span>
                <span class="text-[11.5px] bg-[#FED7AA]/60 px-2 py-0.5 rounded-md font-mono">
                  {{ getRemainingMinutes(b) }}m left
                </span>
              </div>
              <p class="m-0 text-[12.5px] text-[#7C2D12] leading-relaxed">
                This court slot is temporarily reserved for you. Tap below to view your PayMongo QR code and complete payment.
              </p>
            </div>

            <!-- Expired Hold Banner -->
            <div
              v-else-if="(b.status === 'pending_payment' || b.status === 'held') && !isHoldActive(b)"
              class="mt-3.5 p-3 rounded-xl bg-[#FDE8E8] border border-[#FECACA] text-[#991B1B] text-[12.5px] flex items-center gap-2"
            >
              <span class="mdi mdi-alert-circle text-[16px] text-[#DC2626] shrink-0"></span>
              <span>This reservation hold has expired and the court slot was released.</span>
            </div>

            <!-- Resume Error if any -->
            <div
              v-if="resumeError && resumingBookingRef === b.reference"
              class="mt-2.5 p-2.5 rounded-lg bg-[#FDE8E8] text-[#991B1B] text-[12px]"
            >
              {{ resumeError }}
            </div>

            <!-- Actions based on status -->
            <div class="mt-3.5 pt-3.5 border-t border-[#DCE6D8] flex flex-col sm:flex-row gap-2">
              <!-- CASE 1: Active Hold: Complete Payment / Open QR Code -->
              <template v-if="isHoldActive(b)">
                <button
                  type="button"
                  class="flex-1 py-3 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] active:scale-[0.98] text-white font-bold text-[13.5px] shadow-[0_3px_12px_rgba(11,102,35,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  :disabled="resumingBookingRef === b.reference"
                  @click="resumeCheckout(b)"
                >
                  <span v-if="resumingBookingRef === b.reference" class="mdi mdi-loading mdi-spin text-[18px]"></span>
                  <span v-else class="mdi mdi-qrcode-scan text-[18px] text-[#9ACD32]"></span>
                  <span>{{ resumingBookingRef === b.reference ? 'Opening PayMongo…' : 'Pay Now / View QR Code' }}</span>
                </button>
              </template>

              <!-- CASE 2: Expired Hold or Cancelled -->
              <template v-else-if="b.status === 'cancelled' || b.status === 'expired' || b.status === 'pending_payment'">
                <NuxtLink
                  to="/book"
                  class="flex-1 py-3 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] text-white font-bold text-[13px] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 no-underline shadow-2xs"
                >
                  <span class="mdi mdi-calendar-plus text-[16px]"></span>
                  <span>Book New Slot</span>
                </NuxtLink>
              </template>

              <!-- CASE 3: Confirmed / Paid: Access Gate QR Pass & Full Receipt -->
              <template v-else>
                <button
                  type="button"
                  class="flex-1 py-3 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] active:scale-[0.98] text-white font-bold text-[13.5px] shadow-[0_3px_12px_rgba(11,102,35,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  @click="openQrModal(b)"
                >
                  <span class="mdi mdi-qrcode-scan text-[18px] text-[#9ACD32]"></span>
                  <span>Access Gate QR Pass</span>
                </button>

                <NuxtLink
                  :to="`/book/confirmed/${b.reference}`"
                  class="py-3 px-4 rounded-xl bg-[#FAF9F1] hover:bg-[#E8F4D8] border border-[#DCE6D8] text-[#14231C] hover:text-[#0B6623] font-bold text-[13px] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 no-underline shadow-2xs"
                >
                  <span>Full Receipt</span>
                  <span class="mdi mdi-arrow-right text-[15px]"></span>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Digital Match Pass Gate QR Modal -->
    <div
      v-if="selectedBookingForQr"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in overflow-y-auto"
      @click="closeQrModal"
    >
      <div
        class="w-full max-w-[420px] bg-white rounded-[26px] border border-[#DCE6D8] shadow-2xl overflow-hidden flex flex-col my-auto text-left"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-5 py-3.5 bg-[#14231C] text-white flex items-center justify-between border-b border-[#243D2F]">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-[#0B6623] text-[#9ACD32] flex items-center justify-center text-[15px]">
              <span class="mdi mdi-qrcode-scan"></span>
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold tracking-widest text-[#9ACD32]">
                Official Match Pass
              </div>
              <div class="font-mono font-bold text-[15px] text-white leading-tight">
                {{ selectedBookingForQr.reference }}
              </div>
            </div>
          </div>

          <button
            type="button"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            @click="closeQrModal"
            aria-label="Close pass modal"
          >
            <span class="mdi mdi-close text-[17px]"></span>
          </button>
        </div>

        <!-- Modal QR Body -->
        <div class="p-5 flex flex-col items-center justify-center text-center bg-white">
          <!-- QR Frame with Corner Brackets -->
          <div class="relative p-3.5 bg-white rounded-2xl border border-[#DCE6D8] shadow-xs mb-3">
            <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#0B6623] rounded-tl-sm"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#0B6623] rounded-tr-sm"></div>
            <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#0B6623] rounded-bl-sm"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#0B6623] rounded-br-sm"></div>

            <div class="w-[180px] h-[180px] flex items-center justify-center bg-white">
              <img
                v-if="modalQrCodeUrl"
                :src="modalQrCodeUrl"
                alt="Match Pass QR Code"
                class="w-[176px] h-[176px] object-contain rounded-sm"
              />
              <div v-else class="flex flex-col items-center justify-center text-[#66756D] gap-2">
                <div class="w-7 h-7 border-2.5 border-[#0B6623] border-t-transparent rounded-full animate-spin"></div>
                <span class="text-[11.5px] font-medium">Generating gate pass...</span>
              </div>
            </div>
          </div>

          <!-- Reference with Copy Button -->
          <button
            type="button"
            class="inline-flex items-center gap-2 bg-[#FAF9F1] hover:bg-[#E8F4D8] text-[#14231C] text-[13px] font-mono px-3.5 py-1.5 rounded-full border border-[#DCE6D8] transition-colors cursor-pointer shadow-xs active:scale-95 mb-2"
            title="Copy Reference Code"
            @click="copyModalReference"
          >
            <span class="font-bold">{{ selectedBookingForQr.reference }}</span>
            <span v-if="!copiedModalRef" class="mdi mdi-content-copy text-[13px] text-[#66756D]"></span>
            <span v-else class="text-[#0B6623] font-bold text-[11px]">Copied!</span>
          </button>

          <p class="text-[12px] text-[#66756D] m-0 mb-4 flex items-center gap-1.5 font-medium">
            <span class="mdi mdi-cellphone-check text-[15px] text-[#0B6623]"></span>
            <span>Scan at front desk terminal upon arrival</span>
          </p>

          <!-- Match Summary Pill -->
          <div class="w-full p-3.5 rounded-2xl bg-[#FAF9F1] border border-[#DCE6D8] text-left text-[12.5px] space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-[#66756D] font-medium">Facility</span>
              <strong class="text-[#14231C] font-display">{{ selectedBookingForQr.court_names }}</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#66756D] font-medium">Schedule</span>
              <span class="text-[#14231C] font-semibold">
                {{ formatTime(selectedBookingForQr.start_time) }} – {{ formatTime(selectedBookingForQr.end_time) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#66756D] font-medium">Match Date</span>
              <span class="text-[#14231C] font-semibold">{{ formatDate(selectedBookingForQr.booking_date) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#66756D] font-medium">Guest</span>
              <span class="text-[#14231C] font-semibold">{{ selectedBookingForQr.guest_name }}</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-3.5 bg-[#FAF9F1] border-t border-[#DCE6D8] flex items-center gap-2">
          <button
            type="button"
            class="flex-1 py-2.5 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] text-white font-bold text-[13px] shadow-sm transition-all cursor-pointer"
            @click="closeQrModal"
          >
            Done
          </button>
          <NuxtLink
            :to="`/book/confirmed/${selectedBookingForQr.reference}`"
            class="py-2.5 px-4 rounded-xl bg-white hover:bg-[#E8F4D8] border border-[#DCE6D8] text-[#14231C] font-bold text-[13px] transition-all no-underline shadow-2xs text-center"
          >
            Full Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

useHead({ title: 'Check Booking — PickleBook' })

const supabase = useSupabase()

interface CourtRentalItem {
  name: string
  hours: number
  price_per_hour: number
  subtotal: number
}

interface ItemDetail {
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface BookingResult {
  id: string
  reference: string
  status: string
  booking_date: string
  start_time: string
  end_time: string
  duration_hours: number
  guest_name: string
  total_amount: number | null
  court_names: string
  court_rentals: CourtRentalItem[]
  court_total: number
  paddles: ItemDetail[]
  paddle_total: number
  food_items: ItemDetail[]
  food_total: number
  players: string[]
  payment_method: string | null
  created_at?: string
}

const query    = ref('')
const loading  = ref(false)
const searched = ref(false)
const error    = ref('')
const results  = ref<BookingResult[]>([])

const selectedBookingForQr = ref<BookingResult | null>(null)
const modalQrCodeUrl = ref<string>('')
const copiedModalRef = ref(false)
const qrGenerating = ref(false)

async function openQrModal(booking: BookingResult) {
  selectedBookingForQr.value = booking
  modalQrCodeUrl.value = ''
  qrGenerating.value = true
  copiedModalRef.value = false

  try {
    const QRCode = (await import('qrcode')).default
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const qrData = origin ? `${origin}/lookup?ref=${booking.reference}` : booking.reference

    modalQrCodeUrl.value = await QRCode.toDataURL(qrData, {
      width: 360,
      margin: 1,
      color: {
        dark: '#14231C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
  } catch (err) {
    console.error('Failed to generate match pass QR code:', err)
  } finally {
    qrGenerating.value = false
  }
}

function closeQrModal() {
  selectedBookingForQr.value = null
  modalQrCodeUrl.value = ''
}

function copyModalReference() {
  if (!selectedBookingForQr.value) return
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(selectedBookingForQr.value.reference)
    copiedModalRef.value = true
    setTimeout(() => {
      copiedModalRef.value = false
    }, 2000)
  }
}

function clearSearch() {
  query.value    = ''
  results.value  = []
  searched.value = false
  error.value    = ''
}

function calculateDurationHours(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0
  const [sh] = startStr.split(':').map(Number)
  let [eh] = endStr.split(':').map(Number)
  if (eh === 0) eh = 24
  return Math.max(0, eh - sh)
}

async function search() {
  const q = query.value.trim()
  if (!q) return

  loading.value  = true
  error.value    = ''
  results.value  = []
  searched.value = false

  try {
    const isRef = /^PB-/i.test(q)
    const guestSelect = isRef ? 'booking_guests(full_name)' : 'booking_guests!inner(full_name)'

    let req = supabase
      .from('bookings')
      .select(`
        id,
        reference,
        status,
        created_at,
        booking_date,
        start_time,
        end_time,
        subtotal,
        total_amount,
        ${guestSelect},
        booking_courts(
          id,
          hours,
          price_per_hour,
          subtotal,
          courts(name, type)
        ),
        booking_paddles(
          id,
          quantity,
          price,
          subtotal,
          paddles(name)
        ),
        booking_food(
          id,
          quantity,
          price,
          subtotal,
          food_items(name, category)
        ),
        booking_players(
          player_name
        ),
        payments(amount, payment_method, payment_status)
      `)
      .in('status', ['confirmed', 'pending_payment', 'held', 'cancelled'])
      .order('booking_date', { ascending: false })
      .limit(10)

    if (isRef) {
      req = req.ilike('reference', q.trim())
    } else {
      req = req.ilike('booking_guests.full_name', q.trim())
    }

    const { data, error: qErr } = await req
    if (qErr) throw qErr

    const toArr = (v: any): any[] =>
      v == null ? [] : Array.isArray(v) ? v : [v]

    const mapped: BookingResult[] = (data ?? [])
      .map((b: any) => {
        const guests    = toArr(b.booking_guests)
        const courts    = toArr(b.booking_courts)
        const paddles   = toArr(b.booking_paddles)
        const food      = toArr(b.booking_food)
        const players   = toArr(b.booking_players)
        const payments  = toArr(b.payments)

        const guestName   = guests.map((g: any) => g.full_name).filter(Boolean).join(', ') || '—'
        const courtNames  = courts.map((bc: any) => bc.courts?.name).filter(Boolean).join(', ') || '—'

        const courtRentals: CourtRentalItem[] = courts.map((bc: any) => ({
          name: bc.courts?.name || 'Court',
          hours: Number(bc.hours || 0),
          price_per_hour: Number(bc.price_per_hour || 0),
          subtotal: Number(bc.subtotal || 0),
        }))
        const courtTotal = courtRentals.reduce((sum, c) => sum + c.subtotal, 0)

        const paddleItems: ItemDetail[] = paddles.map((bp: any) => ({
          name: bp.paddles?.name || 'Paddle',
          quantity: Number(bp.quantity || 1),
          price: Number(bp.price || 0),
          subtotal: Number(bp.subtotal || 0),
        }))
        const paddleTotal = paddleItems.reduce((sum, p) => sum + p.subtotal, 0)

        const foodItems: ItemDetail[] = food.map((bf: any) => ({
          name: bf.food_items?.name || 'Food item',
          quantity: Number(bf.quantity || 1),
          price: Number(bf.price || 0),
          subtotal: Number(bf.subtotal || 0),
        }))
        const foodTotal = foodItems.reduce((sum, f) => sum + f.subtotal, 0)

        const playerNames = players.map((p: any) => p.player_name).filter(Boolean)
        const durationHours = courtRentals[0]?.hours || calculateDurationHours(b.start_time, b.end_time)

        const totalAmount = b.total_amount != null
          ? Number(b.total_amount)
          : payments.reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0) || null

        const paymentMethod = payments[0]?.payment_method || null

        return {
          id: b.id,
          reference: b.reference,
          status: b.status,
          booking_date: b.booking_date,
          start_time: b.start_time,
          end_time: b.end_time,
          duration_hours: durationHours,
          guest_name: guestName,
          total_amount: totalAmount,
          court_names: courtNames,
          court_rentals: courtRentals,
          court_total: courtTotal,
          paddles: paddleItems,
          paddle_total: paddleTotal,
          food_items: foodItems,
          food_total: foodTotal,
          players: playerNames,
          payment_method: paymentMethod,
          created_at: b.created_at,
        }
      })

    results.value  = mapped
    searched.value = true
  } catch (err: any) {
    error.value = err?.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function isHoldActive(b: BookingResult): boolean {
  if (b.status !== 'pending_payment' && b.status !== 'held') return false
  if (!b.created_at) return false
  const diff = Date.now() - new Date(b.created_at).getTime()
  return diff <= 10 * 60 * 1000
}

function getRemainingMinutes(b: BookingResult): number {
  if (!b.created_at) return 0
  const elapsed = Date.now() - new Date(b.created_at).getTime()
  const remainingMs = Math.max(0, 10 * 60 * 1000 - elapsed)
  return Math.max(1, Math.ceil(remainingMs / (60 * 1000)))
}

const resumingBookingRef = ref<string | null>(null)
const resumeError = ref<string | null>(null)

async function resumeCheckout(booking: BookingResult) {
  resumingBookingRef.value = booking.reference
  resumeError.value = null
  try {
    const res = await $fetch<{
      success: boolean
      checkoutUrl?: string
      alreadyPaid?: boolean
      message?: string
    }>('/api/paymongo/resume-checkout', {
      method: 'POST',
      body: { bookingRef: booking.reference },
    })

    if (res?.alreadyPaid) {
      navigateTo(`/book/confirmed/${booking.reference}`)
      return
    }

    if (res?.checkoutUrl) {
      window.location.href = res.checkoutUrl
    } else {
      throw new Error(res?.message || 'Could not retrieve payment checkout URL.')
    }
  } catch (err: any) {
    resumeError.value = err?.data?.statusMessage || err?.message || 'Failed to resume payment session.'
  } finally {
    resumingBookingRef.value = null
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '—'
  const [h, m] = timeStr.split(':').map(Number)
  const isMidnight = h === 24 || h === 0
  const period = isMidnight ? 'AM' : (h >= 12 && h < 24) ? 'PM' : 'AM'
  const hour   = isMidnight ? 12 : (h % 12 || 12)
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'Confirmed ✓', pending_payment: 'Pending',
    held: 'On hold', cancelled: 'Cancelled', expired: 'Expired',
  }
  return map[status] ?? status
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'status--confirmed', pending_payment: 'status--pending',
    held: 'status--held', cancelled: 'status--cancelled', expired: 'status--cancelled',
  }
  return map[status] ?? ''
}
</script>

<style scoped>
.lookup-input {
  width: 100%;
  padding: 11px 40px;
  border-radius: 12px;
  border: 1px solid #DCE6D8;
  background: #FFFFFF;
  color: #14231C;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.15s ease-out;
}
.lookup-input:focus {
  border-color: #0B6623;
  box-shadow: 0 0 0 3px rgba(11, 102, 35, 0.1);
}
.lookup-input::placeholder { color: #8A938D; }

.lookup-search-btn {
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: none;
  background: #0B6623;
  color: #FFFFFF;
  font-size: 14.5px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease-out;
}
.lookup-search-btn:hover:not(:disabled) {
  background: #08521C;
  box-shadow: 0 4px 14px -2px rgba(11, 102, 35, 0.35);
}
.lookup-search-btn:disabled {
  background: #D9DEDA;
  color: #8A938D;
  cursor: not-allowed;
}

.ticket-pass-card {
  border: 1px solid #DCE6D8;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px -2px rgba(20, 35, 28, 0.05);
  background: #FFFFFF;
}

.status-badge {
  padding: 3px 9px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.status--confirmed { background: #E8F4D8; color: #0B6623; }
.status--pending   { background: #FEF3D6; color: #D98216; }
.status--held      { background: #FEF3D6; color: #D98216; }
.status--cancelled { background: #FDE8E8; color: #D94A4A; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.75s linear infinite; }
</style>
