<template>
  <div class="min-h-screen bg-[#F5F1DE] text-ink font-sans">
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
      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Quick KPI Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Day Revenue -->
          <div class="p-4 rounded-2xl bg-white border border-line shadow-xs">
            <div class="flex items-center justify-between text-ink-soft mb-1">
              <span class="text-[11.5px] font-bold uppercase tracking-wider">Day Revenue</span>
              <span class="mdi mdi-cash text-[18px] text-relish-dark"></span>
            </div>
            <div class="font-display font-extrabold text-[22px] sm:text-[24px] text-ink leading-tight">
              ₱{{ dayRevenue.toLocaleString() }}
            </div>
            <div class="text-[11.5px] text-ink-soft mt-1 font-medium">
              From {{ dayConfirmedCount }} paid bookings
            </div>
          </div>

          <!-- Total Bookings -->
          <div class="p-4 rounded-2xl bg-white border border-line shadow-xs">
            <div class="flex items-center justify-between text-ink-soft mb-1">
              <span class="text-[11.5px] font-bold uppercase tracking-wider">Bookings</span>
              <span class="mdi mdi-calendar-check text-[18px] text-relish-dark"></span>
            </div>
            <div class="font-display font-extrabold text-[22px] sm:text-[24px] text-ink leading-tight">
              {{ dayBookings.length }}
            </div>
            <div class="text-[11.5px] text-ink-soft mt-1 font-medium">
              {{ dayConfirmedCount }} confirmed · {{ dayPendingCount }} pending
            </div>
          </div>

          <!-- Checked In Players -->
          <div class="p-4 rounded-2xl bg-white border border-line shadow-xs">
            <div class="flex items-center justify-between text-ink-soft mb-1">
              <span class="text-[11.5px] font-bold uppercase tracking-wider">Gate Check-Ins</span>
              <span class="mdi mdi-account-check text-[18px] text-emerald-600"></span>
            </div>
            <div class="font-display font-extrabold text-[22px] sm:text-[24px] text-emerald-800 leading-tight">
              {{ dayCheckedInCount }}
            </div>
            <div class="text-[11.5px] text-ink-soft mt-1 font-medium">
              {{ dayCheckedInCount }} of {{ dayConfirmedCount }} arrived
            </div>
          </div>

          <!-- Active Courts -->
          <div class="p-4 rounded-2xl bg-white border border-line shadow-xs">
            <div class="flex items-center justify-between text-ink-soft mb-1">
              <span class="text-[11.5px] font-bold uppercase tracking-wider">Active Courts</span>
              <span class="mdi mdi-court text-[18px] text-relish-dark"></span>
            </div>
            <div class="font-display font-extrabold text-[22px] sm:text-[24px] text-ink leading-tight">
              {{ activeCourtsCount }} / {{ data.courts.value.length || 2 }}
            </div>
            <div class="text-[11.5px] text-ink-soft mt-1 font-medium">
              Available for play today
            </div>
          </div>
        </div>

        <!-- Tab Selector Navigation -->
        <div class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-line shadow-2xs overflow-x-auto">
          <button
            v-for="tab in mainTabs"
            :key="tab.id"
            type="button"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all whitespace-nowrap cursor-pointer"
            :class="activeTab === tab.id ? 'bg-relish-dark text-white shadow-2xs' : 'text-ink-soft hover:text-ink hover:bg-cream/60'"
            @click="activeTab = tab.id"
          >
            <span class="mdi" :class="tab.icon"></span>
            <span>{{ tab.label }}</span>
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
      <div
        v-if="notification"
        class="fixed bottom-6 right-6 z-60 px-4 py-3 rounded-2xl bg-[#1E3314] text-white border border-[#38591A] shadow-xl text-[13px] font-bold flex items-center gap-2 animate-fade-in"
      >
        <span class="mdi mdi-information-outline text-lime text-[18px]"></span>
        <span>{{ notification }}</span>
      </div>
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

useHead({ title: 'Admin & Front Desk — DINK' })

const auth = useAdminAuth()
const data = useAdminData()

const activeTab = ref<'timeline' | 'bookings' | 'facility'>('timeline')
const showScanner = ref(false)
const selectedBooking = ref<AdminBooking | null>(null)
const notification = ref<string | null>(null)

const mainTabs = [
  { id: 'timeline', label: 'Court Timeline Grid', icon: 'mdi-calendar-clock' },
  { id: 'bookings', label: 'All Reservations', icon: 'mdi-format-list-bulleted' },
  { id: 'facility', label: 'Facility & Equipment', icon: 'mdi-cog-outline' },
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
  return dayBookings.value.filter((b) => b.status === 'pending_payment').length
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
