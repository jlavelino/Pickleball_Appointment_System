<template>
  <div class="min-h-screen bg-[#FAF9F1] text-[#14231C] font-sans">
    <!-- 1. PIN Lock Screen (if not authenticated) -->
    <AdminPinGate
      v-if="!auth.isAuthenticated.value"
      @authenticated="onAuthenticated"
    />

    <!-- 2. Main Admin Dashboard -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Admin Header Bar -->
      <AdminHeader
        :selected-date-label="selectedDateLabel"
        :is-today="isToday"
        :loading="data.loading.value"
        @prev-day="changeDate(-1)"
        @next-day="changeDate(1)"
        @go-today="resetToday"
        @open-scanner="showScanner = true"
        @refresh="loadData"
        @logout="auth.logout()"
      />

      <!-- Main Dashboard Container -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-8 space-y-5 sm:space-y-6">
        <!-- Quick KPI Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          <!-- 1. Total Day Revenue — Primary Forest Action Metric -->
          <div class="p-3.5 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[#14231C] border border-[#243D2F] shadow-sm flex flex-col justify-between col-span-1 relative overflow-hidden text-white">
            <div class="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#9ACD32]/10 -translate-y-1/2 translate-x-1/2 blur-lg pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-1 sm:mb-2">
                <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#9ACD32]">Day Revenue</span>
                <span class="mdi mdi-cash text-[15px] sm:text-[17px] text-[#9ACD32]"></span>
              </div>
              <div class="font-display font-bold text-[22px] sm:text-[32px] text-white leading-none tracking-tight">
                ₱{{ dayRevenue.toLocaleString() }}
              </div>
              <div class="text-[10.5px] sm:text-[11.5px] text-white/60 mt-2 sm:mt-3 font-medium flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#9ACD32]"></span>
                <span class="truncate">{{ dayConfirmedCount }} paid booking{{ dayConfirmedCount !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>

          <!-- 2. Total Bookings — Clean White Card -->
          <div class="p-3.5 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-white border border-[#DCE6D8] shadow-subtle flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1 sm:mb-2">
              <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66756D]">Bookings</span>
              <span class="mdi mdi-calendar-check text-[15px] sm:text-[17px] text-[#0B6623]"></span>
            </div>
            <div class="font-display font-bold text-[22px] sm:text-[32px] text-[#14231C] leading-none tracking-tight">
              {{ dayBookings.length }}
            </div>
            <div class="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 flex-wrap">
              <span class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#E8F4D8] text-[#0B6623] border border-[#DCE6D8]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#0B6623]"></span>
                <span>{{ dayConfirmedCount }} paid</span>
              </span>
              <span v-if="dayPendingCount > 0" class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FFF4E5] text-[#D98216] border border-[#FEE199]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#D98216]"></span>
                <span>{{ dayPendingCount }} hold</span>
              </span>
            </div>
          </div>

          <!-- 3. Gate Check-Ins — Arrival Tracking Card -->
          <div class="p-3.5 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-white border border-[#DCE6D8] shadow-subtle flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1 sm:mb-2">
              <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66756D]">Gate Check-Ins</span>
              <span class="mdi mdi-account-check text-[15px] sm:text-[17px] text-[#0B6623]"></span>
            </div>
            <div class="font-display font-bold text-[22px] sm:text-[32px] text-[#14231C] leading-none tracking-tight">
              {{ dayCheckedInCount }}
            </div>
            <!-- Arrival progress bar -->
            <div class="mt-2 sm:mt-3">
              <div class="h-1.5 rounded-full bg-[#E8F4D8] overflow-hidden">
                <div
                  class="h-full rounded-full bg-[#0B6623] transition-all duration-500"
                  :style="{ width: dayConfirmedCount > 0 ? (dayCheckedInCount / dayConfirmedCount * 100) + '%' : '0%' }"
                ></div>
              </div>
              <div class="text-[10.5px] sm:text-[11px] text-[#66756D] mt-1 sm:mt-1.5 font-medium truncate">
                {{ dayCheckedInCount }} of {{ dayConfirmedCount }} arrived
              </div>
            </div>
          </div>

          <!-- 4. Active Courts — Facility Status Card -->
          <div class="p-3.5 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-white border border-[#DCE6D8] shadow-subtle flex flex-col justify-between">
            <div class="flex items-center justify-between mb-1 sm:mb-2">
              <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#66756D]">Court Availability</span>
              <span class="mdi mdi-court text-[15px] sm:text-[17px] text-[#0B6623]"></span>
            </div>
            <div class="font-display font-bold text-[22px] sm:text-[32px] text-[#14231C] leading-none tracking-tight">
              {{ activeCourtsCount }}<span class="text-[14px] sm:text-[16px] font-sans font-medium text-[#66756D] ml-1">/ {{ data.courts.value.length || 2 }}</span>
            </div>
            <!-- Court status dots -->
            <div class="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
              <span
                v-for="(court, idx) in (data.courts.value.length > 0 ? data.courts.value : [{status:'active'},{status:'active'}])"
                :key="'id' in court ? court.id : idx"
                class="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors"
                :class="court.status === 'active' ? 'bg-[#0B6623]' : 'bg-[#D94A4A]'"
                :title="court.status === 'active' ? 'Active' : 'Maintenance'"
              ></span>
              <span class="text-[10.5px] sm:text-[11px] text-[#66756D] font-medium ml-1 truncate">courts operational</span>
            </div>
          </div>
        </div>

        <!-- Tab Selector Navigation Pill -->
        <div class="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white border border-[#DCE6D8] shadow-subtle overflow-x-auto no-scrollbar">
          <button
            v-for="tab in mainTabs"
            :key="tab.id"
            type="button"
            class="flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[12px] sm:text-[13px] transition-all whitespace-nowrap cursor-pointer"
            :class="activeTab === tab.id
              ? 'bg-[#0B6623] text-white shadow-sm'
              : 'text-[#66756D] hover:text-[#14231C] hover:bg-[#E8F4D8]/60'"
            @click="activeTab = tab.id"
          >
            <span class="mdi text-[15px] sm:text-[16px]" :class="tab.icon"></span>
            <span class="hidden sm:inline">{{ tab.label }}</span>
            <span class="sm:hidden">{{ tab.shortLabel }}</span>
          </button>
        </div>

        <!-- Tab 1: Interactive Court Timeline -->
        <div v-if="activeTab === 'timeline'">
          <AdminTimeline
            :courts="data.courts.value"
            :bookings="dayBookings"
            :selected-date-label="selectedDateLabel"
            @select-booking="openBookingDetails"
          />
        </div>

        <!-- Tab 2: Bookings Directory Table -->
        <div v-else-if="activeTab === 'bookings'">
          <AdminBookingsTable
            :bookings="data.bookings.value"
            @select-booking="openBookingDetails"
          />
        </div>

        <!-- Tab 3: Facility Controls -->
        <div v-else-if="activeTab === 'facility'">
          <AdminFacility
            :courts="data.courts.value"
            :paddles="data.paddles.value"
            :food-items="data.foodItems.value"
            @toggle-court="data.toggleCourtStatus"
            @adjust-paddle="data.adjustPaddleStock"
            @toggle-food="data.toggleFoodAvailability"
          />
        </div>
      </main>

      <!-- 3. QR Camera Scanner Modal -->
      <AdminQrScannerModal
        v-if="showScanner"
        @close="showScanner = false"
        @scanned="handleQrScanned"
      />

      <!-- 4. Booking Details & ID Verification Modal -->
      <AdminBookingModal
        v-if="selectedBooking"
        :booking="selectedBooking"
        @close="selectedBooking = null"
        @check-in="handleCheckIn"
        @cancel-booking="handleCancelBooking"
      />

      <!-- Notification Toast -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="notification"
          class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#14231C] text-white border border-[#243D2F] shadow-2xl text-[13px] font-bold flex items-center gap-2.5"
        >
          <span class="mdi mdi-check-circle-outline text-[#9ACD32] text-[18px] shrink-0"></span>
          <span>{{ notification }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useAdminData, type AdminBooking } from '~/composables/useAdminData'
import AdminPinGate from '~/components/admin/AdminPinGate.vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminTimeline from '~/components/admin/AdminTimeline.vue'
import AdminBookingsTable from '~/components/admin/AdminBookingsTable.vue'
import AdminBookingModal from '~/components/admin/AdminBookingModal.vue'
import AdminFacility from '~/components/admin/AdminFacility.vue'
import AdminQrScannerModal from '~/components/admin/AdminQrScannerModal.vue'

useHead({ title: 'PickleBook Staff Portal — Facility & Desk Manager' })

const auth = useAdminAuth()
const data = useAdminData()

const activeTab = ref<'timeline' | 'bookings' | 'facility'>('timeline')
const showScanner = ref(false)
const selectedBooking = ref<AdminBooking | null>(null)
const notification = ref<string | null>(null)

const mainTabs = [
  { id: 'timeline', label: 'Court Schedule Grid', shortLabel: 'Schedule', icon: 'mdi-calendar-clock' },
  { id: 'bookings', label: 'All Reservations', shortLabel: 'Reservations', icon: 'mdi-format-list-bulleted' },
  { id: 'facility', label: 'Facility & Equipment', shortLabel: 'Facility', icon: 'mdi-cog-outline' },
] as const

// Date management
const currentDate = ref(new Date())

const selectedDateIso = computed(() => {
  const y = currentDate.value.getFullYear()
  const m = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const d = String(currentDate.value.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

const selectedDateLabel = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
})

const isToday = computed(() => {
  const today = new Date()
  return (
    today.getFullYear() === currentDate.value.getFullYear() &&
    today.getMonth() === currentDate.value.getMonth() &&
    today.getDate() === currentDate.value.getDate()
  )
})

function changeDate(deltaDays: number) {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + deltaDays)
  currentDate.value = d
}

function resetToday() {
  currentDate.value = new Date()
}

// Filtered Bookings for the selected date
const dayBookings = computed(() => {
  return data.bookings.value.filter((b) => b.booking_date === selectedDateIso.value)
})

const dayConfirmedCount = computed(() => {
  return dayBookings.value.filter((b) => b.status === 'confirmed').length
})

const dayPendingCount = computed(() => {
  return dayBookings.value.filter((b) => {
    if (b.status !== 'pending_payment') return false
    if (!b.created_at) return false
    return Date.now() - new Date(b.created_at).getTime() <= 10 * 60 * 1000
  }).length
})

const dayCheckedInCount = computed(() => {
  return dayBookings.value.filter((b) => b.checked_in).length
})

const dayRevenue = computed(() => {
  return dayBookings.value
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0)
})

const activeCourtsCount = computed(() => {
  return data.courts.value.filter((c) => c.status === 'active').length
})

onMounted(async () => {
  auth.checkSession()
  if (auth.isAuthenticated.value) {
    await loadData()
  }
})

async function onAuthenticated() {
  await loadData()
}

async function loadData() {
  await Promise.all([
    data.fetchCourts(),
    data.fetchPaddles(),
    data.fetchFoodItems(),
    data.fetchBookings(),
  ])
}

function openBookingDetails(booking: AdminBooking) {
  selectedBooking.value = booking
}

async function handleQrScanned(scannedCode: string) {
  showScanner.value = false
  const booking = await data.getBookingByReference(scannedCode)
  if (booking) {
    selectedBooking.value = booking
    showToast(`Pass verified: ${booking.reference}`)
  } else {
    showToast(`No booking found for ref: ${scannedCode}`)
  }
}

function handleCheckIn(bookingId: string) {
  data.setCheckedIn(bookingId)
  if (selectedBooking.value && selectedBooking.value.id === bookingId) {
    selectedBooking.value.checked_in = true
    selectedBooking.value.checked_in_at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  showToast('Guest checked in successfully!')
}

async function handleCancelBooking(bookingId: string) {
  await data.updateBookingStatus(bookingId, 'cancelled')
  if (selectedBooking.value && selectedBooking.value.id === bookingId) {
    selectedBooking.value.status = 'cancelled'
  }
  showToast('Booking cancelled.')
}

function showToast(msg: string) {
  notification.value = msg
  setTimeout(() => {
    notification.value = null
  }, 3500)
}
</script>
