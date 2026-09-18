import { defineStore } from 'pinia'
import { useSupabase } from '~/composables/useSupabase'

// ─── Constants ────────────────────────────────────────────────────────────────
export const HOLD_DURATION_MS = 10 * 60 * 1000 // 10 minutes

export interface Court {
  id: string | number
  name: string
  price: number
  type: string
  status?: string
}

export interface PaddleItem {
  id: string
  name: string
  price: number
  stock: number
  total_quantity?: number
  available_quantity?: number
}

export interface FoodItem {
  id: string
  name: string
  price: number
  category: string
  stock_quantity?: number | null
  is_available?: boolean
}

// Fallback seed catalog (used as initial state before Supabase fetch completes)
export const DEFAULT_COURTS: Court[] = [
  { id: '7e96acc3-8ca9-4110-8895-fdb6330a1c70', name: 'Court 1', price: 250, type: 'indoor' },
  { id: '0a31ed7d-f073-488d-aae9-9dc329c38149', name: 'Court 2', price: 250, type: 'indoor' },
]

export const DEFAULT_PADDLES: PaddleItem[] = [
  { id: 'cb5ee6e3-597f-4189-87b2-ad27c38885bd', name: 'Standard paddle', price: 100, stock: 4 },
  { id: '1ef13ffa-d836-4cfd-8336-f05fc20b8a2b', name: 'Premium paddle', price: 150, stock: 4 },
  { id: '6ad6b922-1b4c-4ba0-8ba6-ed9d16b10598', name: 'Pro paddle', price: 200, stock: 4 },
]

export const DEFAULT_FOOD_GROUPS = [
  {
    label: 'Meals',
    items: [
      { id: '850c5356-a0c0-48fb-9708-67027609c433', name: 'Chicken sandwich', price: 150, category: 'Meals', is_available: true },
      { id: '3d2e6ba5-79a0-4a10-b115-3efcbd113d4a', name: 'Burger', price: 180, category: 'Meals', is_available: true },
    ],
  },
  {
    label: 'Snacks & drinks',
    items: [
      { id: '71ffd93e-0d0c-456d-9399-54fb9313adbe', name: 'Fries', price: 80, category: 'Snacks & drinks', is_available: true },
      { id: '7c08dd8f-5823-4e7f-a5a0-9fb4b9e59694', name: 'Bottled water', price: 30, category: 'Snacks & drinks', is_available: true },
    ],
  },
]

export type PaymentMethod = 'gcash' | 'maya'

export interface TimeSlot {
  label: string
  open: number
}

// 8 AM to 11 PM hourly slots (16 total slots)
export const TIME_SLOT_LABELS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
]

// Slot index to SQL TIME string (HH:MM:SS)
export function slotToTimeString(idx: number): string {
  const hour = 8 + idx // 8 = 8 AM, 12 = 12 PM, 23 = 11 PM
  return `${String(hour).padStart(2, '0')}:00:00`
}

export interface PlayerEntry {
  name: string
  mobile: string
}

interface BookingState {
  year: number
  month: number // 0-indexed (8 = September)
  day: number
  selectedSlots: number[] // array of selected slot indices
  slotIndex: number | null // kept for compatibility (first selected or null)
  courtIds: (string | number)[] // array of selected court IDs
  courtId: string | number | null // kept for compatibility (first selected court or null)
  paddleQty: Record<string, number>
  foodQty: Record<string, number>
  payMethod: PaymentMethod
  holdSeconds: number
  bookingRef: string | null
  createdBookingId: string | null
  // Booker details
  bookerName: string
  bookerMobile: string
  bookerFacebook: string
  players: PlayerEntry[]
  idPhotoName: string | null
  idPhotoFile: File | null

  // Live Supabase Database Data
  dbCourts: Court[]
  dbPaddles: PaddleItem[]
  dbFoodItems: FoodItem[]
  isLoadingCatalog: boolean
  isSubmittingBooking: boolean

  // Availability map from database: slotIndex -> count of available courts
  dbSlotAvailability: Record<number, number>
  // Booked court IDs per slot: slotIndex -> string[] of booked court IDs
  dbCourtSlotBooked: Record<number, string[]>
  // Reserved paddles map from database: slotIndex -> (paddleId -> count reserved)
  dbPaddleSlotReserved: Record<number, Record<string, number>>
  isLoadingAvailability: boolean
}

export function formatEndHour(label: string): string {
  const [time, period] = label.split(' ')
  const [hourStr, minStr] = time.split(':')
  const hour = parseInt(hourStr)
  let nextHour = hour + 1
  let nextPeriod = period
  if (hour === 11 && period === 'AM') {
    nextHour = 12
    nextPeriod = 'PM'
  } else if (hour === 11 && period === 'PM') {
    nextHour = 12
    nextPeriod = 'AM'
  } else if (hour === 12) {
    nextHour = 1
  }
  return `${nextHour}:${minStr} ${nextPeriod}`
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    year: 2026,
    month: 8, // September
    day: 15,
    selectedSlots: [],
    slotIndex: null,
    courtIds: [],
    courtId: null,
    paddleQty: {},
    foodQty: {},
    payMethod: 'gcash',
    holdSeconds: 10 * 60,
    bookingRef: null,
    createdBookingId: null,
    bookerName: '',
    bookerMobile: '',
    bookerFacebook: '',
    players: [],
    idPhotoName: null,
    idPhotoFile: null,

    dbCourts: DEFAULT_COURTS,
    dbPaddles: DEFAULT_PADDLES,
    dbFoodItems: DEFAULT_FOOD_GROUPS.flatMap(g => g.items),
    isLoadingCatalog: false,
    isSubmittingBooking: false,

    dbSlotAvailability: {},
    dbCourtSlotBooked: {},
    dbPaddleSlotReserved: {},
    isLoadingAvailability: false,
  }),

  getters: {
    courts: (s): Court[] => {
      return s.dbCourts.length > 0 ? s.dbCourts : DEFAULT_COURTS
    },

    paddles: (s): PaddleItem[] => {
      const baseList = s.dbPaddles.length > 0 ? s.dbPaddles : DEFAULT_PADDLES

      // Identify active selected slots (multi-select or single)
      const activeSlots = s.selectedSlots.length > 0
        ? s.selectedSlots
        : (s.slotIndex !== null ? [s.slotIndex] : [])

      return baseList.map(p => {
        // Base facility inventory (respect admin override in available_quantity if set)
        const baseTotal = typeof p.available_quantity === 'number'
          ? p.available_quantity
          : (p.total_quantity ?? 4)

        // If user has selected slots, find peak reserved quantity across those slots
        let maxReserved = 0
        if (activeSlots.length > 0 && s.dbPaddleSlotReserved) {
          activeSlots.forEach(slotIdx => {
            const reservedInSlot = s.dbPaddleSlotReserved[slotIdx]?.[p.id] || 0
            if (reservedInSlot > maxReserved) {
              maxReserved = reservedInSlot
            }
          })
        }

        const available = Math.max(0, baseTotal - maxReserved)
        return {
          ...p,
          stock: available,
          total_quantity: Number(p.total_quantity ?? 4),
          available_quantity: baseTotal,
        }
      })
    },

    allFood: (s): FoodItem[] => {
      return s.dbFoodItems.length > 0 ? s.dbFoodItems : DEFAULT_FOOD_GROUPS.flatMap(g => g.items)
    },

    foodGroups: (s) => {
      const items = s.dbFoodItems.length > 0 ? s.dbFoodItems : DEFAULT_FOOD_GROUPS.flatMap(g => g.items)
      const meals = items.filter(f => f.category === 'Meals')
      const snacks = items.filter(f => f.category === 'Snacks & drinks' || f.category !== 'Meals')
      return [
        { label: 'Meals', items: meals },
        { label: 'Snacks & drinks', items: snacks },
      ]
    },

    isCurrentDayFullyBooked: (s): boolean => {
      // If we have live slot availability, check if all slots have 0 courts
      if (Object.keys(s.dbSlotAvailability).length > 0) {
        return TIME_SLOT_LABELS.every((_, idx) => (s.dbSlotAvailability[idx] ?? 0) === 0)
      }
      return false
    },

    slots: (s): TimeSlot[] => {
      const totalCourts = s.dbCourts.length > 0 ? s.dbCourts.length : 2
      return TIME_SLOT_LABELS.map((label, i) => {
        const count = s.dbSlotAvailability[i] !== undefined
          ? s.dbSlotAvailability[i]
          : totalCourts
        return { label, open: count }
      })
    },

    selectedSlot: (s): TimeSlot | null => {
      if (s.selectedSlots.length === 0 && s.slotIndex === null) return null
      const idx = s.selectedSlots[0] ?? s.slotIndex!
      const totalCourts = s.dbCourts.length > 0 ? s.dbCourts.length : 2
      const count = s.dbSlotAvailability[idx] !== undefined ? s.dbSlotAvailability[idx] : totalCourts
      return { label: TIME_SLOT_LABELS[idx], open: count }
    },

    selectedSlotsList: (s): TimeSlot[] => {
      const totalCourts = s.dbCourts.length > 0 ? s.dbCourts.length : 2
      return s.selectedSlots.map(idx => ({
        label: TIME_SLOT_LABELS[idx],
        open: s.dbSlotAvailability[idx] !== undefined ? s.dbSlotAvailability[idx] : totalCourts,
      }))
    },

    selectedCourt(): Court | null {
      const id = this.courtIds[0] ?? this.courtId
      if (!id) return null
      return this.courts.find((c: Court) => String(c.id) === String(id)) || null
    },

    selectedCourts(): Court[] {
      if (this.courtIds.length > 0) {
        return this.courts.filter((c: Court) => this.courtIds.map(String).includes(String(c.id)))
      }
      if (this.courtId !== null) {
        const c = this.courts.find((x: Court) => String(x.id) === String(this.courtId))
        return c ? [c] : []
      }
      return []
    },

    courtNamesLabel(): string {
      const courts = this.courts.filter((c: Court) => this.courtIds.map(String).includes(String(c.id)))
      if (courts.length === 0) {
        const c = this.courts.find((x: Court) => String(x.id) === String(this.courtId))
        return c ? c.name : ''
      }
      const names = courts.map((c: Court) => c.name)
      if (names.length === 1) return names[0]
      if (names.length === 2) return `${names[0]} & ${names[1]}`
      return names.join(', ')
    },

    courtsStatusMap(s): Record<string, 'open' | 'low' | 'full' | 'maintenance'> {
      const map: Record<string, 'open' | 'low' | 'full' | 'maintenance'> = {}

      // Determine which slots are active
      const activeSlots = s.selectedSlots.length > 0
        ? s.selectedSlots
        : (s.slotIndex !== null ? [s.slotIndex] : [])

      this.courts.forEach((court: Court) => {
        const courtIdStr = String(court.id)

        // Court in maintenance mode cannot be booked
        if (court.status === 'maintenance') {
          map[courtIdStr] = 'maintenance'
          return
        }

        if (activeSlots.length === 0) {
          // No slot selected yet — show active courts as open
          map[courtIdStr] = 'open'
          return
        }

        // Court is 'full' (unavailable) for the user's chosen slots if it is
        // booked during ANY of those slots.
        const isBookedInAnySlot = activeSlots.some(slotIdx => {
          const bookedIds: string[] = s.dbCourtSlotBooked[slotIdx] ?? []
          return bookedIds.includes(courtIdStr)
        })

        map[courtIdStr] = isBookedInAnySlot ? 'full' : 'open'
      })

      return map
    },

    paddleTotal(s): number {
      const hours = s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 1)
      return this.paddles.reduce((sum: number, p: PaddleItem) => sum + (p.price * hours) * (s.paddleQty[p.id] || 0), 0)
    },

    paddleCount(s): number {
      return this.paddles.reduce((sum: number, p: PaddleItem) => sum + (s.paddleQty[p.id] || 0), 0)
    },

    foodTotal(s): number {
      return this.allFood.reduce((sum: number, f: FoodItem) => sum + f.price * (s.foodQty[f.id] || 0), 0)
    },

    foodCount(s): number {
      return this.allFood.reduce((sum: number, f: FoodItem) => sum + (s.foodQty[f.id] || 0), 0)
    },

    slotHours(s): number {
      return s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
    },

    courtTotal(s): number {
      const hours = s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
      if (s.courtIds.length > 0) {
        const selected = this.courts.filter((c: Court) => s.courtIds.map(String).includes(String(c.id)))
        return selected.reduce((sum: number, c: Court) => sum + (c.price * hours), 0)
      }
      if (s.courtId !== null) {
        const c = this.courts.find((x: Court) => String(x.id) === String(s.courtId))
        return c ? c.price * hours : 0
      }
      return 0
    },

    grandTotal(s): number {
      const hours = s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
      let courtPrice = 0
      if (s.courtIds.length > 0) {
        const selected = this.courts.filter((c: Court) => s.courtIds.map(String).includes(String(c.id)))
        courtPrice = selected.reduce((sum: number, c: Court) => sum + (c.price * hours), 0)
      } else if (s.courtId !== null) {
        const c = this.courts.find((x: Court) => String(x.id) === String(s.courtId))
        courtPrice = c ? c.price * hours : 0
      }
      const paddleHours = hours > 0 ? hours : 1
      const pTotal = this.paddles.reduce((sum: number, p: PaddleItem) => sum + (p.price * paddleHours) * (s.paddleQty[p.id] || 0), 0)
      const fTotal = this.allFood.reduce((sum: number, f: FoodItem) => sum + f.price * (s.foodQty[f.id] || 0), 0)
      return courtPrice + pTotal + fTotal
    },

    dateLabel: (s): string => {
      const d = new Date(s.year, s.month, s.day)
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
      const monthName = d.toLocaleDateString('en-US', { month: 'short' })
      return `${weekday}, ${monthName} ${s.day}`
    },

    fullDateLabel: (s): string => {
      const d = new Date(s.year, s.month, s.day)
      const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
      const monthName = d.toLocaleDateString('en-US', { month: 'long' })
      return `${weekday}, ${monthName} ${s.day}`
    },

    slotRangeLabel: (s): string => {
      const count = s.selectedSlots.length
      if (count === 0) {
        if (s.slotIndex === null) return ''
        const start = TIME_SLOT_LABELS[s.slotIndex]
        return `${start} – ${formatEndHour(start)} (1 hr)`
      }

      if (count === 1) {
        const start = TIME_SLOT_LABELS[s.selectedSlots[0]]
        return `${start} – ${formatEndHour(start)} (1 hr)`
      }

      const sorted = [...s.selectedSlots].sort((a, b) => a - b)
      let isContiguous = true
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] !== sorted[i] + 1) {
          isContiguous = false
          break
        }
      }

      const hrsText = `${count} hrs`
      if (isContiguous) {
        const start = TIME_SLOT_LABELS[sorted[0]]
        const end = formatEndHour(TIME_SLOT_LABELS[sorted[sorted.length - 1]])
        return `${start} – ${end} (${hrsText})`
      }

      return `${sorted.map(i => TIME_SLOT_LABELS[i]).join(', ')} (${hrsText})`
    },
  },

  actions: {
    // ─── Fetch Catalogs from Supabase ──────────────────────────────────────
    async fetchCatalogs() {
      this.isLoadingCatalog = true
      try {
        const supabase = useSupabase()

        const [courtsRes, paddlesRes, foodRes, facilityRes] = await Promise.all([
          supabase.from('courts').select('*').order('name'),
          supabase.from('paddles').select('*').order('price'),
          supabase.from('food_items').select('*').order('name'),
          $fetch<{ success: boolean; data: any }>('/api/admin/facility').catch(() => null),
        ])

        const facilityOverrides = facilityRes?.data || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('dink_facility_controls') || '{}') : null)

        if (courtsRes.data && courtsRes.data.length > 0) {
          this.dbCourts = courtsRes.data.map(c => {
            const overrideStatus = facilityOverrides?.courts?.[c.id]
            return {
              id: c.id,
              name: c.name,
              price: Number(c.price_per_hour),
              type: c.type || 'indoor',
              status: overrideStatus || c.status || 'active',
            }
          })
        }

        if (paddlesRes.data && paddlesRes.data.length > 0) {
          this.dbPaddles = paddlesRes.data.map(p => {
            const overrideQty = facilityOverrides?.paddles?.[p.id]
            const available = typeof overrideQty === 'number' ? overrideQty : Number(p.available_quantity ?? p.total_quantity ?? 4)
            return {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              stock: available,
              total_quantity: Number(p.total_quantity ?? 4),
              available_quantity: available,
            }
          })
        } else if (facilityOverrides?.paddles) {
          this.dbPaddles = DEFAULT_PADDLES.map(p => {
            const overrideQty = facilityOverrides.paddles[p.id]
            const available = typeof overrideQty === 'number' ? overrideQty : p.stock
            return {
              ...p,
              stock: available,
              available_quantity: available,
            }
          })
        }

        if (foodRes.data && foodRes.data.length > 0) {
          this.dbFoodItems = foodRes.data.map(f => {
            const overrideAvail = facilityOverrides?.foodItems?.[f.id]
            return {
              id: f.id,
              name: f.name,
              price: Number(f.price),
              category: f.category,
              stock_quantity: f.stock_quantity,
              is_available: typeof overrideAvail === 'boolean' ? overrideAvail : f.is_available,
            }
          })
        }

        // Automatically reset quantities of out of stock food items to 0
        this.allFood.forEach(f => {
          if (f.is_available === false && this.foodQty[f.id]) {
            this.foodQty[f.id] = 0
          }
        })

        // Automatically clamp any selected paddle quantities to current available stock
        this.paddles.forEach(p => {
          if ((this.paddleQty[p.id] || 0) > p.stock) {
            this.paddleQty[p.id] = p.stock
          }
        })
      } catch (err) {
        console.error('[Supabase] Failed to load catalogs, using defaults:', err)
      } finally {
        this.isLoadingCatalog = false
      }
    },

    // ─── Fetch Availability for Current Date from Supabase ─────────────────
    async fetchAvailability() {
      this.isLoadingAvailability = true
      try {
        const supabase = useSupabase()
        const dateStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`
        const totalCourts = this.dbCourts.length > 0 ? this.dbCourts.length : 2

        // Single query: fetch all active bookings for the day with court AND paddle assignments.
        // Statuses that count as "taking a slot": confirmed, pending_payment, held.
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('id, start_time, end_time, booking_courts(court_id), booking_paddles(paddle_id, quantity)')
          .eq('booking_date', dateStr)
          .in('status', ['confirmed', 'pending_payment', 'held'])

        if (error) {
          console.error('[Supabase] fetchAvailability query error:', error)
        }

        const availabilityMap: Record<number, number> = {}
        const courtSlotBookedMap: Record<number, string[]> = {}
        const paddleReservedMap: Record<number, Record<string, number>> = {}

        // For each hourly slot, find which courts and paddles are occupied
        TIME_SLOT_LABELS.forEach((_, idx) => {
          const slotStartHour = 8 + idx       // e.g. idx 0 → 8 AM
          const slotEndHour   = slotStartHour + 1

          const bookedCourtIds = new Set<string>()
          const paddleReserved: Record<string, number> = {}

          if (!error && bookingsData) {
            bookingsData.forEach((booking: any) => {
              const bookingStartHour = parseInt((booking.start_time as string).split(':')[0])
              let bookingEndHour   = parseInt((booking.end_time   as string).split(':')[0])
              if (bookingEndHour === 0) bookingEndHour = 24

              // Overlap: booking occupies this slot if it starts before slot ends AND ends after slot starts
              if (bookingStartHour < slotEndHour && bookingEndHour > slotStartHour) {
                ;(booking.booking_courts as { court_id: string }[] || []).forEach(bc => {
                  bookedCourtIds.add(bc.court_id)
                })
                ;(booking.booking_paddles as { paddle_id: string; quantity: number }[] || []).forEach(bp => {
                  if (bp.paddle_id) {
                    paddleReserved[bp.paddle_id] = (paddleReserved[bp.paddle_id] || 0) + Number(bp.quantity || 0)
                  }
                })
              }
            })
          }

          // Deduct booked courts AND courts in maintenance mode
          const availableCount = this.courts.filter(c => {
            if (c.status === 'maintenance') return false
            return !bookedCourtIds.has(String(c.id))
          }).length
          availabilityMap[idx] = Math.max(0, availableCount)
          courtSlotBookedMap[idx] = Array.from(bookedCourtIds)
          paddleReservedMap[idx] = paddleReserved
        })

        this.dbSlotAvailability = availabilityMap
        this.dbCourtSlotBooked = courtSlotBookedMap
        this.dbPaddleSlotReserved = paddleReservedMap

        // Automatically clamp any selected paddle quantities to current available stock
        this.paddles.forEach(p => {
          if ((this.paddleQty[p.id] || 0) > p.stock) {
            this.paddleQty[p.id] = p.stock
          }
        })

        // Auto-deselect any courts that are in maintenance or booked during the selected slots
        if (this.courtIds.length > 0) {
          const activeSlots = this.selectedSlots.length > 0
            ? this.selectedSlots
            : (this.slotIndex !== null ? [this.slotIndex] : [])
          const nowUnavailable = this.courtIds.filter(id => {
            const idStr = String(id)
            const courtObj = this.courts.find(c => String(c.id) === idStr)
            if (courtObj && courtObj.status === 'maintenance') return true
            return activeSlots.some(slotIdx => {
              const booked = courtSlotBookedMap[slotIdx] ?? []
              return booked.includes(idStr)
            })
          })
          if (nowUnavailable.length > 0) {
            this.courtIds = this.courtIds.filter(id => !nowUnavailable.map(String).includes(String(id)))
            this.courtId = this.courtIds.length > 0 ? this.courtIds[0] : null
          }
        }
      } catch (err) {
        console.error('[Supabase] Failed to fetch availability:', err)
      } finally {
        this.isLoadingAvailability = false
      }
    },

    // ─── Create 10-Minute Booking Hold in Supabase ─────────────────────────
    async createBookingHold(): Promise<{ bookingId: string; bookingRef: string }> {
      this.isSubmittingBooking = true
      try {
        const supabase = useSupabase()
        const dateStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`

        // Sort slot indices
        const sortedSlots = (this.selectedSlots.length > 0 ? this.selectedSlots : [this.slotIndex ?? 0]).sort((a, b) => a - b)
        const startSlotIdx = sortedSlots[0]
        const endSlotIdx = sortedSlots[sortedSlots.length - 1]

        const startTime = slotToTimeString(startSlotIdx)
        const endTime = slotToTimeString(endSlotIdx + 1)

        // Selected court UUIDs
        const courtIdsToBook = this.courtIds.length > 0
          ? this.courtIds.map(String)
          : [String(this.courtId || this.courts[0].id)]

        // Prepare guest json
        const guestPayload = {
          full_name: this.bookerName || 'Guest User',
          mobile: this.bookerMobile || '09000000000',
          facebook_account: this.bookerFacebook || null,
        }

        // Prepare players json
        const playersPayload = this.players
          .filter(p => p.name.trim().length > 0)
          .map(p => ({
            player_name: p.name.trim(),
            player_mobile: p.mobile ? p.mobile.trim() : null,
          }))

        // Prepare paddle selections
        const paddleSelections = Object.entries(this.paddleQty)
          .filter(([_, qty]) => qty > 0)
          .map(([id, qty]) => ({ id, quantity: qty }))

        // Prepare food selections
        const foodSelections = Object.entries(this.foodQty)
          .filter(([_, qty]) => qty > 0)
          .map(([id, qty]) => ({ id, quantity: qty }))

        // Ensure paddles table available_quantity is sufficient for the RPC check
        if (paddleSelections.length > 0) {
          for (const sel of paddleSelections) {
            const p = this.paddles.find(item => item.id === sel.id)
            const targetQty = Math.max(sel.quantity, p?.total_quantity ?? 4)
            await supabase
              .from('paddles')
              .update({ available_quantity: targetQty })
              .eq('id', sel.id)
          }
        }

        // Call create_booking_hold RPC
        const { data: holdData, error: holdError } = await supabase.rpc('create_booking_hold', {
          p_court_ids: courtIdsToBook,
          p_booking_date: dateStr,
          p_start_time: startTime,
          p_end_time: endTime,
          p_guest: guestPayload,
          p_players: playersPayload,
          p_paddle_sels: paddleSelections,
          p_food_sels: foodSelections,
        })

        if (holdError || !holdData) {
          console.error('[Supabase] create_booking_hold error:', holdError)
          throw new Error(holdError?.message || 'Failed to hold booking slots.')
        }

        // Keep paddles table available_quantity reset to base total quantity
        if (paddleSelections.length > 0) {
          for (const sel of paddleSelections) {
            const p = this.paddles.find(item => item.id === sel.id)
            const baseTotal = p?.total_quantity ?? 4
            await supabase
              .from('paddles')
              .update({ available_quantity: baseTotal })
              .eq('id', sel.id)
          }
        }

        const bookingId = holdData.booking_id
        const ref = holdData.reference

        this.createdBookingId = bookingId
        this.bookingRef = ref

        // Upload attached ID photo to server if present
        if (this.idPhotoFile && typeof window !== 'undefined') {
          try {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(this.idPhotoFile!)
            })

            await $fetch('/api/booking/upload-id', {
              method: 'POST',
              body: {
                bookingId,
                bookingRef: ref,
                photoBase64: base64,
                filename: this.idPhotoName || 'id_photo.jpg',
              }
            })
          } catch (uploadErr) {
            console.warn('[Booking] Could not upload ID photo:', uploadErr)
          }
        }

        return { bookingId, bookingRef: ref }
      } finally {
        this.isSubmittingBooking = false
      }
    },

    // ─── Initiate PayMongo Checkout Session (GCash / Maya) ─────────────────
    async initiatePayMongoCheckout(): Promise<string> {
      // 1. Create the booking hold in Supabase (or reuse active hold)
      let bookingId = this.createdBookingId
      let ref = this.bookingRef

      if (!bookingId || !ref) {
        const hold = await this.createBookingHold()
        bookingId = hold.bookingId
        ref = hold.bookingRef
      }

      // 2. Request PayMongo checkout session from Nuxt server route
      const response = await $fetch<{ success: boolean; checkoutUrl: string; sessionId: string }>('/api/paymongo/create-checkout', {
        method: 'POST',
        body: {
          bookingId,
          bookingRef: ref,
          amount: this.grandTotal,
          paymentMethod: this.payMethod,
          bookerName: this.bookerName,
          bookerMobile: this.bookerMobile,
        },
      })

      if (!response?.checkoutUrl) {
        throw new Error('Failed to generate PayMongo checkout URL.')
      }

      if (typeof window !== 'undefined' && response.sessionId && ref) {
        try {
          sessionStorage.setItem(`paymongo_session_${ref}`, response.sessionId)
        } catch (e) {
          // ignore storage error
        }
      }

      return response.checkoutUrl
    },

    // Convenience alias
    async submitBookingToSupabase(): Promise<string> {
      return this.initiatePayMongoCheckout()
    },

    setDate(year: number, month: number, day: number) {
      this.year = year
      this.month = month
      this.day = day
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
      this.fetchAvailability()
    },

    setDay(day: number) {
      this.day = day
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
      this.fetchAvailability()
    },

    prevMonth() {
      this.month -= 1
      if (this.month < 0) {
        this.month = 11
        this.year -= 1
      }
      this.day = 1
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
      this.fetchAvailability()
    },

    nextMonth() {
      this.month += 1
      if (this.month > 11) {
        this.month = 0
        this.year += 1
      }
      this.day = 1
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
      this.fetchAvailability()
    },

    clampPaddleQuantities() {
      this.paddles.forEach(p => {
        if ((this.paddleQty[p.id] || 0) > p.stock) {
          this.paddleQty[p.id] = p.stock
        }
      })
    },

    toggleSlot(idx: number) {
      if (this.selectedSlots.includes(idx)) {
        this.selectedSlots = this.selectedSlots.filter(i => i !== idx)
      } else {
        this.selectedSlots = [...this.selectedSlots, idx].sort((a, b) => a - b)
      }
      this.slotIndex = this.selectedSlots.length > 0 ? this.selectedSlots[0] : null
      this.clampPaddleQuantities()
    },

    setSlot(idx: number) {
      this.toggleSlot(idx)
    },

    setSlots(indices: number[]) {
      this.selectedSlots = [...indices].sort((a, b) => a - b)
      this.slotIndex = this.selectedSlots.length > 0 ? this.selectedSlots[0] : null
      this.clampPaddleQuantities()
    },

    clearSlots() {
      this.selectedSlots = []
      this.slotIndex = null
      this.clampPaddleQuantities()
    },

    toggleCourt(id: string | number) {
      const strId = String(id)
      const current = this.courtIds.map(String)
      if (current.includes(strId)) {
        this.courtIds = this.courtIds.filter(x => String(x) !== strId)
      } else {
        this.courtIds = [...this.courtIds, id]
      }
      this.courtId = this.courtIds.length > 0 ? this.courtIds[0] : null
    },

    setCourt(id: string | number) {
      this.toggleCourt(id)
    },

    setCourts(ids: (string | number)[]) {
      this.courtIds = [...ids]
      this.courtId = this.courtIds.length > 0 ? this.courtIds[0] : null
    },

    clearCourts() {
      this.courtIds = []
      this.courtId = null
    },

    setPaddleQty(id: string, dir: number) {
      const p = this.paddles.find(x => x.id === id)
      if (!p) return
      if (p.stock <= 0 && dir > 0) return
      let next = (this.paddleQty[id] || 0) + dir
      next = Math.max(0, Math.min(p.stock, next))
      this.paddleQty[id] = next
    },

    setFoodQty(id: string, dir: number) {
      const f = this.allFood.find(x => x.id === id)
      if (f && f.is_available === false && dir > 0) return
      let next = (this.foodQty[id] || 0) + dir
      next = Math.max(0, Math.min(20, next))
      this.foodQty[id] = next
    },

    startHold() {
      this.holdSeconds = 10 * 60
    },

    decrementHold() {
      this.holdSeconds = Math.max(0, this.holdSeconds - 1)
    },

    generateBookingRef() {
      const d = new Date(this.year, this.month, this.day)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const rand = Math.floor(10000 + Math.random() * 89999)
      this.bookingRef = `PB-${y}${m}${day}-${rand}`
      return this.bookingRef
    },

    reset() {
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
      this.paddleQty = {}
      this.foodQty = {}
      this.payMethod = 'gcash'
      this.holdSeconds = 10 * 60
      this.bookingRef = null
      this.createdBookingId = null
      this.bookerName = ''
      this.bookerMobile = ''
      this.bookerFacebook = ''
      this.players = []
      this.idPhotoName = null
      this.idPhotoFile = null
      this.fetchAvailability()
    },
  },
})
