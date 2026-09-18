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
  const idPhotoMap = ref<Record<string, string>>({})

  async function fetchIdPhotoMap(): Promise<Record<string, string>> {
    try {
      const res = await $fetch<{ success: boolean; data: Record<string, string> }>('/api/admin/id-photos')
      if (res?.data) {
        idPhotoMap.value = res.data
        return res.data
      }
    } catch {}
    return {}
  }

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
      id_photo_url: idPhotoMap.value[b.id] || idPhotoMap.value[b.reference] || firstGuest.id_photo_url || '',
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

  // Facility overrides sync helper (courts maintenance, paddle stock, food item availability)
  async function fetchFacilityOverrides() {
    try {
      const res = await $fetch<{ success: boolean; data: any }>('/api/admin/facility')
      if (res?.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('dink_facility_controls', JSON.stringify(res.data))
        }
        return res.data
      }
    } catch {
      if (typeof window !== 'undefined') {
        try {
          return JSON.parse(localStorage.getItem('dink_facility_controls') || '{}')
        } catch {
          return null
        }
      }
    }
    return null
  }

  async function fetchCourts() {
    try {
      const { data, error: err } = await supabase
        .from('courts')
        .select('*')
        .order('name', { ascending: true })

      if (err) throw err
      const rawCourts: AdminCourt[] = data || []

      // Overlay facility controls (maintenance status)
      const overrides = await fetchFacilityOverrides()
      if (overrides?.courts) {
        rawCourts.forEach((c: any) => {
          if (overrides.courts[c.id]) {
            c.status = overrides.courts[c.id]
          }
        })
      }

      courts.value = rawCourts
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
      const rawPaddles: AdminPaddle[] = (data && data.length > 0) ? data : [
        { id: 'cb5ee6e3-597f-4189-87b2-ad27c38885bd', name: 'Standard paddle', price: 100, total_quantity: 4, available_quantity: 4 },
        { id: '1ef13ffa-d836-4cfd-8336-f05fc20b8a2b', name: 'Premium paddle', price: 150, total_quantity: 4, available_quantity: 4 },
        { id: '6ad6b922-1b4c-4ba0-8ba6-ed9d16b10598', name: 'Pro paddle', price: 200, total_quantity: 4, available_quantity: 4 },
      ]

      const overrides = await fetchFacilityOverrides()
      if (overrides?.paddles) {
        rawPaddles.forEach((p: any) => {
          if (typeof overrides.paddles[p.id] === 'number') {
            p.available_quantity = overrides.paddles[p.id]
          }
        })
      }

      paddles.value = rawPaddles
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
      const rawFood: AdminFoodItem[] = data || []

      const overrides = await fetchFacilityOverrides()
      if (overrides?.foodItems) {
        rawFood.forEach((f: any) => {
          if (typeof overrides.foodItems[f.id] === 'boolean') {
            f.is_available = overrides.foodItems[f.id]
          }
        })
      }

      foodItems.value = rawFood
    } catch (err: any) {
      console.error('Error fetching food items:', err)
    }
  }

  async function fetchBookings(filterDate?: string) {
    loading.value = true
    error.value = null

    try {
      await fetchIdPhotoMap()

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
      await fetchIdPhotoMap()
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
    // 1. Immediately update local state
    const court = courts.value.find((c) => c.id === courtId)
    if (court) court.status = newStatus

    // 2. Persist to server API
    try {
      await $fetch('/api/admin/facility', {
        method: 'POST',
        body: { type: 'court', id: courtId, status: newStatus }
      })
    } catch (err) {
      console.warn('Could not persist court status to server:', err)
    }

    // 3. Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('dink_facility_controls') || '{}')
        saved.courts = saved.courts || {}
        saved.courts[courtId] = newStatus
        localStorage.setItem('dink_facility_controls', JSON.stringify(saved))
      } catch (err) {
        console.error('Error saving court status to localStorage:', err)
      }
    }

    // 4. Also try Supabase update if permissions allow
    try {
      await supabase.from('courts').update({ status: newStatus }).eq('id', courtId)
    } catch {}
  }

  // Debounced paddle sync map
  const pendingPaddleUpdates: Record<string, number> = {}
  let paddleSyncTimer: ReturnType<typeof setTimeout> | null = null

  async function adjustPaddleStock(paddleId: string, delta: number) {
    const p = paddles.value.find((item) => item.id === paddleId)
    if (!p) return

    const newQty = Math.max(0, Math.min(p.total_quantity, p.available_quantity + delta))
    p.available_quantity = newQty
    pendingPaddleUpdates[paddleId] = newQty

    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('dink_facility_controls') || '{}')
        saved.paddles = saved.paddles || {}
        saved.paddles[paddleId] = newQty
        localStorage.setItem('dink_facility_controls', JSON.stringify(saved))
      } catch {}
    }

    if (paddleSyncTimer) clearTimeout(paddleSyncTimer)
    paddleSyncTimer = setTimeout(async () => {
      const updates = { ...pendingPaddleUpdates }
      for (const [id, quantity] of Object.entries(updates)) {
        try {
          await $fetch('/api/admin/facility', {
            method: 'POST',
            body: { type: 'paddle', id, quantity }
          })
          delete pendingPaddleUpdates[id]
        } catch (err) {
          console.warn('Could not persist paddle stock to server:', err)
        }

        try {
          await supabase.from('paddles').update({ available_quantity: quantity }).eq('id', id)
        } catch {}
      }
    }, 150)
  }

  async function toggleFoodAvailability(foodId: string, isAvailable: boolean) {
    const f = foodItems.value.find((item) => item.id === foodId)
    if (f) f.is_available = isAvailable

    try {
      await $fetch('/api/admin/facility', {
        method: 'POST',
        body: { type: 'food', id: foodId, is_available: isAvailable }
      })
    } catch (err) {
      console.warn('Could not persist food status to server:', err)
    }

    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('dink_facility_controls') || '{}')
        saved.foodItems = saved.foodItems || {}
        saved.foodItems[foodId] = isAvailable
        localStorage.setItem('dink_facility_controls', JSON.stringify(saved))
      } catch {}
    }

    try {
      await supabase.from('food_items').update({ is_available: isAvailable }).eq('id', foodId)
    } catch {}
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
