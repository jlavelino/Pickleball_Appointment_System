import { defineStore } from 'pinia'

// ─── Constants ────────────────────────────────────────────────────────────────
export const HOLD_DURATION_MS = 10 * 60 * 1000 // 10 minutes

export interface Court {
  id: number
  name: string
  price: number
  type: string
}

export interface PaddleItem {
  id: string
  name: string
  price: number
  stock: number
}

export interface FoodItem {
  id: string
  name: string
  price: number
  category: string
}

export const COURTS: Court[] = [
  { id: 1, name: 'Court 1', price: 300, type: 'indoor' },
  { id: 2, name: 'Court 2', price: 300, type: 'indoor' },
  { id: 3, name: 'Court 3', price: 350, type: 'covered outdoor' },
]

export const PADDLES: PaddleItem[] = [
  { id: 'standard', name: 'Standard paddle', price: 100, stock: 13 },
  { id: 'premium',  name: 'Premium paddle',  price: 150, stock: 6 },
  { id: 'pro',      name: 'Pro paddle',       price: 200, stock: 4 },
]

export const FOOD_GROUPS = [
  {
    label: 'Meals',
    items: [
      { id: 'chicken', name: 'Chicken sandwich', price: 150, category: 'Meals' },
      { id: 'burger',  name: 'Burger',           price: 180, category: 'Meals' },
    ],
  },
  {
    label: 'Snacks & drinks',
    items: [
      { id: 'fries', name: 'Fries',         price: 80, category: 'Snacks & drinks' },
      { id: 'water', name: 'Bottled water', price: 30, category: 'Snacks & drinks' },
    ],
  },
]

export const ALL_FOOD: FoodItem[] = FOOD_GROUPS.flatMap(g => g.items)

export type PaymentMethod = 'gcash' | 'maya'

export interface TimeSlot {
  label: string
  open: number
}

// 8 AM to 11 PM hourly slots
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
  courtIds: number[] // array of selected court IDs
  courtId: number | null // kept for compatibility (first selected court or null)
  paddleQty: Record<string, number>
  foodQty: Record<string, number>
  payMethod: PaymentMethod
  holdSeconds: number
  bookingRef: string | null
  // Booker details
  bookerName: string
  bookerMobile: string
  bookerFacebook: string
  players: PlayerEntry[]
  idPhotoName: string | null // just filename for display; file stays local
}

export function isDayFullyBooked(year: number, month: number, day: number): boolean {
  // Explicitly marked fully booked dates (September 11 benchmark requested by user)
  if (month === 8 && day === 11) return true
  // Day 11 benchmark across any month
  if (day === 11) return true
  return false
}

function seededVals(day: number, month = 8, year = 2026): number[] {
  if (isDayFullyBooked(year, month, day)) {
    return TIME_SLOT_LABELS.map(() => 0)
  }
  return TIME_SLOT_LABELS.map((_, i) => {
    // Predictable and realistic court availability (0 to 3)
    const seed = (day * 19 + i * 11 + 7) % 17
    if (seed === 0) return 0 // Full
    if (seed <= 3) return 1  // 1 court open
    if (seed <= 9) return 2  // 2 courts open
    return 3                 // 3 courts open
  })
}

function formatEndHour(label: string): string {
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
    paddleQty: { standard: 0, premium: 0, pro: 0 },
    foodQty: { chicken: 0, burger: 0, fries: 0, water: 0 },
    payMethod: 'gcash',
    holdSeconds: 10 * 60,
    bookingRef: null,
    bookerName: '',
    bookerMobile: '',
    bookerFacebook: '',
    players: [],
    idPhotoName: null,
  }),

  getters: {
    isCurrentDayFullyBooked: (s): boolean => {
      return isDayFullyBooked(s.year, s.month, s.day)
    },

    slots: (s): TimeSlot[] => {
      const vals = seededVals(s.day, s.month, s.year)
      return TIME_SLOT_LABELS.map((label, i) => ({ label, open: vals[i] }))
    },

    selectedSlot: (s): TimeSlot | null => {
      if (s.selectedSlots.length === 0 && s.slotIndex === null) return null
      const idx = s.selectedSlots[0] ?? s.slotIndex
      const vals = seededVals(s.day, s.month, s.year)
      return { label: TIME_SLOT_LABELS[idx], open: vals[idx] }
    },

    selectedSlotsList: (s): TimeSlot[] => {
      const vals = seededVals(s.day, s.month, s.year)
      return s.selectedSlots.map(idx => ({ label: TIME_SLOT_LABELS[idx], open: vals[idx] }))
    },

    selectedCourt: (s): Court | null => {
      const id = s.courtIds[0] ?? s.courtId
      return COURTS.find(c => c.id === id) || null
    },

    selectedCourts: (s): Court[] => {
      if (s.courtIds.length > 0) {
        return COURTS.filter(c => s.courtIds.includes(c.id))
      }
      if (s.courtId !== null) {
        const c = COURTS.find(x => x.id === s.courtId)
        return c ? [c] : []
      }
      return []
    },

    courtNamesLabel: (s): string => {
      const courts = COURTS.filter(c => s.courtIds.includes(c.id))
      if (courts.length === 0) {
        const c = COURTS.find(x => x.id === s.courtId)
        return c ? c.name : ''
      }
      const names = courts.map(c => c.name)
      if (names.length === 1) return names[0]
      if (names.length === 2) return `${names[0]} & ${names[1]}`
      return names.join(', ')
    },

    courtsStatusMap: (s): Record<number, 'open' | 'low' | 'full'> => {
      const vals = seededVals(s.day, s.month, s.year)
      const selectedCounts = s.selectedSlots.length > 0
        ? s.selectedSlots.map(idx => vals[idx] ?? 3)
        : (s.slotIndex !== null ? [vals[s.slotIndex] ?? 3] : [3])
      const minOpen = Math.min(...selectedCounts)

      if (minOpen >= 3) return { 1: 'open', 2: 'open', 3: 'low' }
      if (minOpen === 2) return { 1: 'open', 2: 'open', 3: 'full' }
      if (minOpen === 1) return { 1: 'open', 2: 'full', 3: 'full' }
      return { 1: 'full', 2: 'full', 3: 'full' }
    },

    paddleTotal: (s): number => {
      return PADDLES.reduce((sum, p) => sum + p.price * (s.paddleQty[p.id] || 0), 0)
    },

    paddleCount: (s): number => {
      return PADDLES.reduce((sum, p) => sum + (s.paddleQty[p.id] || 0), 0)
    },

    foodTotal: (s): number => {
      return ALL_FOOD.reduce((sum, f) => sum + f.price * (s.foodQty[f.id] || 0), 0)
    },

    foodCount: (s): number => {
      return ALL_FOOD.reduce((sum, f) => sum + (s.foodQty[f.id] || 0), 0)
    },

    slotHours: (s): number => {
      return s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
    },

    courtTotal: (s): number => {
      const hours = s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
      if (s.courtIds.length > 0) {
        const selected = COURTS.filter(c => s.courtIds.includes(c.id))
        return selected.reduce((sum, c) => sum + (c.price * hours), 0)
      }
      if (s.courtId !== null) {
        const c = COURTS.find(x => x.id === s.courtId)
        return c ? c.price * hours : 0
      }
      return 0
    },

    grandTotal: (s): number => {
      const hours = s.selectedSlots.length > 0 ? s.selectedSlots.length : (s.slotIndex !== null ? 1 : 0)
      let courtPrice = 0
      if (s.courtIds.length > 0) {
        const selected = COURTS.filter(c => s.courtIds.includes(c.id))
        courtPrice = selected.reduce((sum, c) => sum + (c.price * hours), 0)
      } else if (s.courtId !== null) {
        const c = COURTS.find(x => x.id === s.courtId)
        courtPrice = c ? c.price * hours : 0
      }
      const pTotal = PADDLES.reduce((sum, p) => sum + p.price * (s.paddleQty[p.id] || 0), 0)
      const fTotal = ALL_FOOD.reduce((sum, f) => sum + f.price * (s.foodQty[f.id] || 0), 0)
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

      // Check if contiguous block
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

      // Non-contiguous list
      return `${sorted.map(i => TIME_SLOT_LABELS[i]).join(', ')} (${hrsText})`
    },
  },

  actions: {
    setDay(day: number) {
      this.day = day
      this.selectedSlots = []
      this.slotIndex = null
      this.courtIds = []
      this.courtId = null
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
    },

    toggleSlot(idx: number) {
      if (this.selectedSlots.includes(idx)) {
        this.selectedSlots = this.selectedSlots.filter(i => i !== idx)
      } else {
        this.selectedSlots = [...this.selectedSlots, idx].sort((a, b) => a - b)
      }
      this.slotIndex = this.selectedSlots.length > 0 ? this.selectedSlots[0] : null
    },

    setSlot(idx: number) {
      this.toggleSlot(idx)
    },

    setSlots(indices: number[]) {
      this.selectedSlots = [...indices].sort((a, b) => a - b)
      this.slotIndex = this.selectedSlots.length > 0 ? this.selectedSlots[0] : null
    },

    clearSlots() {
      this.selectedSlots = []
      this.slotIndex = null
    },

    toggleCourt(id: number) {
      if (this.courtIds.includes(id)) {
        this.courtIds = this.courtIds.filter(x => x !== id)
      } else {
        this.courtIds = [...this.courtIds, id].sort((a, b) => a - b)
      }
      this.courtId = this.courtIds.length > 0 ? this.courtIds[0] : null
    },

    setCourt(id: number) {
      this.toggleCourt(id)
    },

    setCourts(ids: number[]) {
      this.courtIds = [...ids].sort((a, b) => a - b)
      this.courtId = this.courtIds.length > 0 ? this.courtIds[0] : null
    },

    clearCourts() {
      this.courtIds = []
      this.courtId = null
    },

    setPaddleQty(id: string, dir: number) {
      const p = PADDLES.find(x => x.id === id)
      if (!p) return
      let next = (this.paddleQty[id] || 0) + dir
      next = Math.max(0, Math.min(p.stock, next))
      this.paddleQty[id] = next
    },

    setFoodQty(id: string, dir: number) {
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
      this.paddleQty = { standard: 0, premium: 0, pro: 0 }
      this.foodQty = { chicken: 0, burger: 0, fries: 0, water: 0 }
      this.payMethod = 'gcash'
      this.holdSeconds = 10 * 60
      this.bookingRef = null
      this.bookerName = ''
      this.bookerMobile = ''
      this.bookerFacebook = ''
      this.players = []
      this.idPhotoName = null
    },
  },
})
