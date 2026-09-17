import { ref, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

export interface AdminCourt {
  id: string
  name: string
  type: string
  price_per_hour: number
  status: 'active' | 'maintenance'
}

export interface AdminPaddle {
  id: string
  name: string
  price: number
  total_quantity: number
  available_quantity: number
}

export interface AdminFoodItem {
  id: string
  name: string
  category: string
  price: number
  stock_quantity: number | null
  is_available: boolean
}

export interface AdminBooking {
  id: string
  reference: string
  status: 'pending_payment' | 'confirmed' | 'expired' | 'cancelled'
  booking_date: string
  start_time: string
  end_time: string
  subtotal: number
  total_amount: number
  created_at: string
  guest_name: string
  guest_mobile: string
  guest_facebook?: string
  id_photo_url?: string
  court_names: string
  court_ids: string[]
  court_rentals: Array<{
    name: string
    hours: number
    price_per_hour: number
    subtotal: number
  }>
  paddles: Array<{
    name: string
    quantity: number
    price: number
    subtotal: number
  }>
  food_items: Array<{
    name: string
    quantity: number
    price: number
    subtotal: number
  }>
  players: string[]
  payment_method: string | null
  payment_status: string | null
  checked_in: boolean
  checked_in_at?: string
}

export function useAdminData() {
  const supabase = useSupabase()

  const courts = ref<AdminCourt[]>([])
  const paddles = ref<AdminPaddle[]>([])
  const foodItems = ref<AdminFoodItem[]>([])
  const bookings = ref<AdminBooking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Local storage check-in tracker
  function getCheckedInMap(): Record<string, string> {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem('dink_checked_in_bookings') || '{}')
    } catch {
      return {}
    }
  }

  function setCheckedIn(bookingId: string) {
    if (typeof window === 'undefined') return
    const map = getCheckedInMap()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    map[bookingId] = now
    localStorage.setItem('dink_checked_in_bookings', JSON.stringify(map))

    // Update in memory bookings list
    const b = bookings.value.find((item) => item.id === bookingId)
    if (b) {
      b.checked_in = true
      b.checked_in_at = now
    }
  }

  const toArr = (v: any): any[] => (v == null ? [] : Array.isArray(v) ? v : [v])

  function mapRawBooking(b: any): AdminBooking {
    const checkedInMap = getCheckedInMap()
    const guests = toArr(b.booking_guests)
    const courtList = toArr(b.booking_courts)
    const paddleList = toArr(b.booking_paddles)
    const foodList = toArr(b.booking_food)
    const playerList = toArr(b.booking_players)
    const paymentList = toArr(b.payments)

    const firstGuest = guests[0] || {}
    const guestName = guests.map((g: any) => g.full_name).filter(Boolean).join(', ') || 'Guest Booker'
    const courtNames = courtList.map((c: any) => c.courts?.name).filter(Boolean).join(', ') || 'Court'
    const courtIds = courtList.map((c: any) => c.court_id || c.courts?.id).filter(Boolean)

    const payment = paymentList[0] || {}

    return {
      id: b.id,
      reference: b.reference,
      status: b.status,
      booking_date: b.booking_date,
      start_time: b.start_time,
      end_time: b.end_time,
      subtotal: Number(b.subtotal || 0),
      total_amount: Number(b.total_amount || 0),
      created_at: b.created_at,
      guest_name: guestName,
      guest_mobile: firstGuest.mobile || '',
      guest_facebook: firstGuest.facebook_account || '',
      id_photo_url: firstGuest.id_photo_url || '',
      court_names: courtNames,
      court_ids: courtIds,
      court_rentals: courtList.map((c: any) => ({
        name: c.courts?.name || 'Court',
        hours: Number(c.hours || 0),
        price_per_hour: Number(c.price_per_hour || 0),
        subtotal: Number(c.subtotal || 0),
      })),
      paddles: paddleList.map((p: any) => ({
        name: p.paddles?.name || 'Paddle',
        quantity: Number(p.quantity || 0),
        price: Number(p.price || 0),
        subtotal: Number(p.subtotal || 0),
      })),
      food_items: foodList.map((f: any) => ({
        name: f.food_items?.name || 'Refreshment',
        quantity: Number(f.quantity || 0),
        price: Number(f.price || 0),
        subtotal: Number(f.subtotal || 0),
      })),
      players: playerList.map((p: any) => p.player_name).filter(Boolean),
      payment_method: payment.payment_method || null,
      payment_status: payment.payment_status || null,
      checked_in: Boolean(checkedInMap[b.id]),
      checked_in_at: checkedInMap[b.id],
    }
  }

  async function fetchCourts() {
    try {
      const { data, error: err } = await supabase
        .from('courts')
        .select('*')
        .order('name', { ascending: true })

      if (err) throw err
      courts.value = data || []
    } catch (err: any) {
      console.error('Error fetching courts:', err)
    }
  }

  async function fetchPaddles() {
    try {
      const { data, error: err } = await supabase
        .from('paddles')
        .select('*')
        .order('price', { ascending: true })

      if (err) throw err
      paddles.value = data || []
    } catch (err: any) {
      console.error('Error fetching paddles:', err)
    }
  }

  async function fetchFoodItems() {
    try {
      const { data, error: err } = await supabase
        .from('food_items')
        .select('*')
        .order('category', { ascending: true })

      if (err) throw err
      foodItems.value = data || []
    } catch (err: any) {
      console.error('Error fetching food items:', err)
    }
  }

  async function fetchBookings(filterDate?: string) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
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
          created_at,
          booking_guests(full_name, mobile, facebook_account, id_photo_url),
          booking_courts(id, hours, price_per_hour, subtotal, courts(id, name, type)),
          booking_paddles(id, quantity, price, subtotal, paddles(name)),
          booking_food(id, quantity, price, subtotal, food_items(name, category)),
          booking_players(player_name),
          payments(amount, payment_method, payment_status)
        `)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: true })
        .limit(100)

      if (filterDate) {
        query = query.eq('booking_date', filterDate)
      }

      const { data, error: err } = await query
      if (err) throw err

      bookings.value = (data || []).map(mapRawBooking)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings'
      console.error('Error fetching bookings:', err)
    } finally {
      loading.value = false
    }
  }

  async function getBookingByReference(refStr: string): Promise<AdminBooking | null> {
    try {
      const cleanRef = refStr.trim().replace(/^.*ref=/i, '')
      const { data, error: err } = await supabase
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
          created_at,
          booking_guests(full_name, mobile, facebook_account, id_photo_url),
          booking_courts(id, hours, price_per_hour, subtotal, courts(id, name, type)),
          booking_paddles(id, quantity, price, subtotal, paddles(name)),
          booking_food(id, quantity, price, subtotal, food_items(name, category)),
          booking_players(player_name),
          payments(amount, payment_method, payment_status)
        `)
        .ilike('reference', cleanRef)
        .maybeSingle()

      if (err) throw err
      if (!data) return null
      return mapRawBooking(data)
    } catch (err) {
      console.error('Error finding booking by ref:', err)
      return null
    }
  }

  async function toggleCourtStatus(courtId: string, newStatus: 'active' | 'maintenance') {
    try {
      const { error: err } = await supabase
        .from('courts')
        .update({ status: newStatus })
        .eq('id', courtId)

      if (err) throw err
      const court = courts.value.find((c) => c.id === courtId)
      if (court) court.status = newStatus
    } catch (err) {
      console.error('Error updating court status:', err)
    }
  }

  async function adjustPaddleStock(paddleId: string, delta: number) {
    const p = paddles.value.find((item) => item.id === paddleId)
    if (!p) return

    const newQty = Math.max(0, Math.min(p.total_quantity, p.available_quantity + delta))
    try {
      const { error: err } = await supabase
        .from('paddles')
        .update({ available_quantity: newQty })
        .eq('id', paddleId)

      if (err) throw err
      p.available_quantity = newQty
    } catch (err) {
      console.error('Error updating paddle stock:', err)
    }
  }

  async function toggleFoodAvailability(foodId: string, isAvailable: boolean) {
    try {
      const { error: err } = await supabase
        .from('food_items')
        .update({ is_available: isAvailable })
        .eq('id', foodId)

      if (err) throw err
      const f = foodItems.value.find((item) => item.id === foodId)
      if (f) f.is_available = isAvailable
    } catch (err) {
      console.error('Error toggling food item:', err)
    }
  }

  async function updateBookingStatus(bookingId: string, newStatus: 'confirmed' | 'cancelled') {
    try {
      const { error: err } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (err) throw err
      const b = bookings.value.find((item) => item.id === bookingId)
      if (b) b.status = newStatus
    } catch (err) {
      console.error('Error updating booking status:', err)
    }
  }

  return {
    courts,
    paddles,
    foodItems,
    bookings,
    loading,
    error,
    fetchCourts,
    fetchPaddles,
    fetchFoodItems,
    fetchBookings,
    getBookingByReference,
    setCheckedIn,
    toggleCourtStatus,
    adjustPaddleStock,
    toggleFoodAvailability,
    updateBookingStatus,
  }
}
