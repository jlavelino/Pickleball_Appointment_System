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

              <!-- View Match Pass button -->
              <NuxtLink
                :to="`/book/confirmed/${b.reference}`"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-relish-dark text-white text-[12px] font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all"
              >
                <span>View QR Pass</span>
                <span class="mdi mdi-chevron-right text-[16px]"></span>
              </NuxtLink>
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
          </div>
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
}

const query    = ref('')
const loading  = ref(false)
const searched = ref(false)
const error    = ref('')
const results  = ref<BookingResult[]>([])

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
    held: 'On hold', cancelled: 'Cancelled',
  }
  return map[status] ?? status
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'status--confirmed', pending_payment: 'status--pending',
    held: 'status--held', cancelled: 'status--cancelled',
  }
  return map[status] ?? ''
}
</script>

<style scoped>
.lookup-input {
  width: 100%;
  padding: 11px 40px;
  border-radius: 12px;
  border: 1.5px solid var(--line, #DDDDB8);
  background: #FFFFFF;
  color: var(--ink, #223318);
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.15s ease-out;
}
.lookup-input:focus {
  border-color: var(--ink, #223318);
  box-shadow: 0 0 0 3px rgba(34, 51, 24, 0.08);
}
.lookup-input::placeholder { color: rgba(34, 51, 24, 0.4); }

.lookup-search-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: var(--ink, #223318);
  color: #FFFFFF;
  font-size: 14px;
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
  background: #15220F;
  box-shadow: 0 4px 12px -2px rgba(34, 51, 24, 0.25);
}
.lookup-search-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.ticket-pass-card {
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 16px -4px rgba(34, 51, 24, 0.1);
}

.status-badge {
  padding: 3px 9px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.status--confirmed { background: #EAF5E8; color: #1D6331; }
.status--pending   { background: #FEF3D6; color: #9B5A03; }
.status--held      { background: #EBF0FF; color: #2A4E9E; }
.status--cancelled { background: #FEECEB; color: #8A1F24; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.75s linear infinite; }
</style>
