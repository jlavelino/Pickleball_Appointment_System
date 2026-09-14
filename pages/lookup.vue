<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-8">

      <!-- Page header -->
      <div class="mb-5 mt-1">
        <h1 class="font-display font-semibold text-[26px] m-0 leading-[1.15]">
          Check your booking
        </h1>
        <p class="text-[13.5px] text-[var(--ink-soft)] mt-1 mb-0 leading-snug">
          Search by your reference number or full name
        </p>
      </div>

      <!-- Search input -->
      <div class="relative mb-4">
        <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          id="lookup-search-input"
          v-model="query"
          type="text"
          placeholder="PB-20260910-12345 or your full name"
          autocomplete="off"
          class="lookup-input"
          @keydown.enter="search"
        />
        <button
          v-if="query"
          type="button"
          class="absolute inset-y-0 right-3 flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          aria-label="Clear search"
          @click="clearSearch"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Search button -->
      <button
        id="lookup-search-btn"
        type="button"
        class="lookup-search-btn"
        :disabled="loading || !query.trim()"
        @click="search"
      >
        <svg v-if="loading" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        {{ loading ? 'Searching…' : 'Search Booking' }}
      </button>

      <!-- Error -->
      <div
        v-if="error"
        class="mt-4 p-3.5 rounded-2xl bg-[rgba(229,72,77,0.07)] border border-[rgba(229,72,77,0.22)] text-[#8A1F24] text-[13px] font-medium leading-snug"
      >
        ⚠️ {{ error }}
      </div>

      <!-- No results -->
      <div
        v-else-if="searched && results.length === 0"
        class="mt-8 flex flex-col items-center text-center gap-2 py-6"
      >
        <div class="w-14 h-14 rounded-2xl bg-[var(--cream-card)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] mb-1">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <p class="font-semibold text-[15px] text-[var(--ink)] m-0">No booking found</p>
        <p class="text-[13px] text-[var(--ink-soft)] m-0 max-w-[220px] leading-snug">
          Double-check your reference number or try your full name as registered.
        </p>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="mt-5 flex flex-col gap-3">
        <p class="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] m-0 mb-0.5">
          {{ results.length }} booking{{ results.length !== 1 ? 's' : '' }} found
        </p>

        <div
          v-for="b in results"
          :id="`result-${b.reference}`"
          :key="b.id"
          class="booking-card"
        >
          <!-- Reference + status badge -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              <div class="text-[10.5px] font-bold uppercase tracking-widest text-[var(--ink-soft)] mb-0.5">Reference no.</div>
              <div class="font-display font-bold text-[18px] text-[var(--ink)] tracking-tight">{{ b.reference }}</div>
            </div>
            <span class="status-badge" :class="statusClass(b.status)">
              {{ statusLabel(b.status) }}
            </span>
          </div>

          <div class="border-t border-[var(--line)]/70 mb-3"></div>

          <!-- Primary detail grid -->
          <div class="grid grid-cols-2 gap-y-3 gap-x-3">
            <div class="detail-block">
              <div class="detail-label">Guest name</div>
              <div class="detail-value">{{ b.guest_name }}</div>
            </div>
            <div class="detail-block">
              <div class="detail-label">Date</div>
              <div class="detail-value">{{ formatDate(b.booking_date) }}</div>
            </div>
            <div class="detail-block">
              <div class="detail-label">Time</div>
              <div class="detail-value">
                {{ formatTime(b.start_time) }} – {{ formatTime(b.end_time) }}
                <span v-if="b.duration_hours" class="text-[11.5px] text-[var(--ink-soft)] font-normal block">
                  ({{ b.duration_hours }} hr{{ b.duration_hours > 1 ? 's' : '' }})
                </span>
              </div>
            </div>
            <div class="detail-block">
              <div class="detail-label">Court(s)</div>
              <div class="detail-value">{{ b.court_names }}</div>
            </div>
          </div>

          <!-- Additional Players if any -->
          <div v-if="b.players && b.players.length > 0" class="mt-3 pt-2.5 border-t border-[var(--line)]/60">
            <div class="detail-label mb-1">Additional Players</div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="player in b.players"
                :key="player"
                class="px-2.5 py-0.5 rounded-md text-[12px] bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)] font-medium"
              >
                {{ player }}
              </span>
            </div>
          </div>

          <!-- Availed Orders Breakdown -->
          <div class="mt-3.5 pt-3 border-t border-[var(--line)]/70 flex flex-col gap-2.5">
            <div class="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-soft)]">
              Availed Orders & Breakdown
            </div>

            <!-- Court Rental Line -->
            <div class="flex justify-between items-start text-[13px]">
              <div>
                <div class="font-medium text-[var(--ink)]">Court rental</div>
                <div class="text-[12px] text-[var(--ink-soft)]">
                  {{ b.court_rentals.length > 0 ? b.court_rentals.length : 1 }} {{ (b.court_rentals.length > 1) ? 'courts' : 'court' }} × {{ b.duration_hours }} {{ b.duration_hours === 1 ? 'hour' : 'hours' }}
                </div>
              </div>
              <div class="font-semibold text-[13.5px] text-[var(--ink)]" v-if="b.court_total > 0">
                ₱{{ Number(b.court_total).toLocaleString() }}
              </div>
            </div>

            <!-- Paddles Line -->
            <div v-if="b.paddles && b.paddles.length > 0" class="flex justify-between items-start text-[13px] pt-2 border-t border-[var(--line)]/40">
              <div>
                <div class="font-medium text-[var(--ink)]">
                  {{ b.paddles[0].quantity }} × {{ b.paddles[0].name }}
                </div>
                <div class="text-[12px] text-[var(--ink-soft)] mt-0.5">
                  <span v-if="b.paddles.length > 1">
                    {{ b.paddles.slice(1).map(p => `${p.quantity} × ${p.name}`).join(', ') }} ·
                  </span>
                  <span>{{ b.duration_hours }} {{ b.duration_hours === 1 ? 'hour' : 'hours' }}</span>
                </div>
              </div>
              <div class="font-semibold text-[13.5px] text-[var(--ink)]">
                ₱{{ Number(b.paddle_total).toLocaleString() }}
              </div>
            </div>

            <!-- Food & Drinks Line -->
            <div v-if="b.food_items && b.food_items.length > 0" class="flex justify-between items-start text-[13px] pt-2 border-t border-[var(--line)]/40">
              <div>
                <div class="font-medium text-[var(--ink)]">
                  {{ b.food_items[0].quantity }} × {{ b.food_items[0].name }}
                </div>
                <div v-if="b.food_items.length > 1" class="text-[12px] text-[var(--ink-soft)] mt-0.5">
                  {{ b.food_items.slice(1).map(f => `${f.quantity} × ${f.name}`).join(', ') }}
                </div>
              </div>
              <div class="font-semibold text-[13.5px] text-[var(--ink)]">
                ₱{{ Number(b.food_total).toLocaleString() }}
              </div>
            </div>
          </div>

          <!-- Total paid -->
          <div class="mt-3.5 pt-3 border-t border-[var(--line)] flex items-center justify-between">
            <div>
              <div class="text-[12.5px] text-[var(--ink-soft)] font-medium">Total paid</div>
              <div v-if="b.payment_method" class="text-[11px] text-[var(--ink-soft)] uppercase tracking-wider">
                via {{ b.payment_method }}
              </div>
            </div>
            <span class="font-display font-bold text-[18px] text-[var(--ink)]">
              {{ b.total_amount != null ? `₱${Number(b.total_amount).toLocaleString()}` : '—' }}
            </span>
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

    // toArr: Supabase returns 1-to-1 joins as an object, 1-to-many as an array.
    // This helper always gives us a safe array to work with.
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
  padding: 12px 40px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: var(--cream-card);
  color: var(--ink);
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
  appearance: none;
}
.lookup-input::-webkit-search-cancel-button,
.lookup-input::-webkit-search-decoration {
  -webkit-appearance: none;
  display: none;
}
.lookup-input:focus {
  border-color: var(--relish);
  box-shadow: 0 0 0 3px rgba(107,142,35,0.12);
}
.lookup-input::placeholder { color: var(--ink-soft); }

.lookup-search-btn {
  width: 100%;
  padding: 13px;
  border-radius: 14px;
  border: none;
  background: var(--ink);
  color: var(--cream);
  font-size: 14.5px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s, transform 0.12s;
}
.lookup-search-btn:hover:not(:disabled) { opacity: 0.88; }
.lookup-search-btn:active:not(:disabled) { transform: scale(0.97); }
.lookup-search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.booking-card {
  background: var(--cream-card);
  border: 1.5px solid var(--line);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 2px 12px -4px rgba(34,51,24,0.08);
}

.detail-block { display: flex; flex-direction: column; gap: 2px; }
.detail-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.055em;
  color: var(--ink-soft);
}
.detail-value { font-size: 13.5px; font-weight: 500; color: var(--ink); line-height: 1.3; }

.status-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.status--confirmed  { background: #D6EEDD; color: #1A6334; }
.status--pending    { background: #FFF4DC; color: #9A5C00; }
.status--held       { background: #EBF0FF; color: #2A4E9E; }
.status--cancelled  { background: #FEECEB; color: #8A1F24; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.75s linear infinite; }
</style>
