<template>
  <div class="bg-white rounded-[24px] border border-line shadow-sm overflow-hidden">
    <!-- Filter & Search Bar -->
    <div class="p-4 sm:p-5 border-b border-line bg-cream/30 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80">
        <span class="mdi mdi-magnify text-[18px] text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, ref, court, or phone..."
          class="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-line text-[13px] text-ink placeholder-ink-soft/60 focus:outline-none focus:border-relish transition-colors shadow-2xs"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
          @click="searchQuery = ''"
        >
          <span class="mdi mdi-close text-[16px]"></span>
        </button>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-sold/50 rounded-xl border border-line/60">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          type="button"
          class="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer"
          :class="currentFilter === tab.value ? 'bg-relish-dark text-white shadow-2xs' : 'text-ink-soft hover:text-ink hover:bg-white/50'"
          @click="currentFilter = tab.value"
        >
          {{ tab.label }}
          <span class="ml-1 text-[10px] opacity-75 font-mono">({{ getTabCount(tab.value) }})</span>
        </button>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-[13px] border-collapse min-w-[700px]">
        <thead>
          <tr class="bg-sold/30 border-b border-line text-ink-soft text-[11px] font-bold uppercase tracking-wider">
            <th class="py-3 px-4">Reference</th>
            <th class="py-3 px-4">Guest Booker</th>
            <th class="py-3 px-4">Court & Schedule</th>
            <th class="py-3 px-4">Total</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/60">
          <tr
            v-for="b in filteredBookings"
            :key="b.id"
            class="hover:bg-cream/40 transition-colors cursor-pointer group"
            @click="$emit('select-booking', b)"
          >
            <!-- Reference -->
            <td class="py-3.5 px-4 font-mono font-bold text-ink">
              <span class="group-hover:text-relish-dark transition-colors">{{ b.reference }}</span>
              <span v-if="b.id_photo_url" class="ml-1.5 mdi mdi-card-account-details-outline text-[13px] text-relish-dark" title="ID Attached"></span>
            </td>

            <!-- Booker -->
            <td class="py-3.5 px-4">
              <div class="font-bold text-ink">{{ b.guest_name }}</div>
              <div class="text-[11.5px] text-ink-soft font-mono">{{ b.guest_mobile || '—' }}</div>
            </td>

            <!-- Schedule -->
            <td class="py-3.5 px-4">
              <div class="font-semibold text-ink">{{ b.court_names }}</div>
              <div class="text-[11.5px] text-ink-soft">
                {{ b.start_time.slice(0, 5) }} – {{ b.end_time.slice(0, 5) }} · {{ b.booking_date }}
              </div>
            </td>

            <!-- Total Paid -->
            <td class="py-3.5 px-4">
              <div class="font-bold text-ink font-display">₱{{ Number(b.total_amount).toLocaleString() }}</div>
              <div v-if="b.payment_method" class="text-[10.5px] text-ink-soft uppercase">
                {{ b.payment_method }}
              </div>
            </td>

            <!-- Status Badge -->
            <td class="py-3.5 px-4">
              <span
                v-if="b.checked_in"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px]"
              >
                <span class="mdi mdi-check text-[12px]"></span>
                Checked In
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] border"
                :class="statusBadgeClass(b.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(b.status)"></span>
                {{ b.status === 'confirmed' ? 'Confirmed' : b.status }}
              </span>
            </td>

            <!-- Inspect Button -->
            <td class="py-3.5 px-4 text-right">
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-cream hover:bg-sold text-ink font-bold text-[12px] border border-line transition-all cursor-pointer shadow-2xs group-hover:border-relish-dark"
                @click.stop="$emit('select-booking', b)"
              >
                Verify Pass
              </button>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="filteredBookings.length === 0">
            <td colspan="6" class="py-12 text-center text-ink-soft">
              <div class="w-12 h-12 rounded-2xl bg-sold mx-auto mb-2 flex items-center justify-center text-relish-dark">
                <span class="mdi mdi-text-box-search-outline text-[24px]"></span>
              </div>
              <div class="font-bold text-[14px] text-ink">No bookings found</div>
              <div class="text-[12px] mt-0.5">Try adjusting your search query or status filter.</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AdminBooking } from '~/composables/useAdminData'

const props = defineProps<{
  bookings: AdminBooking[]
}>()

defineEmits<{
  'select-booking': [booking: AdminBooking]
}>()

const searchQuery = ref('')
const currentFilter = ref('all')

const filterTabs = [
  { label: 'All Records', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Pending', value: 'pending_payment' },
  { label: 'Cancelled', value: 'cancelled' },
]

function getTabCount(tabVal: string): number {
  if (tabVal === 'all') return props.bookings.length
  if (tabVal === 'checked_in') return props.bookings.filter((b) => b.checked_in).length
  return props.bookings.filter((b) => b.status === tabVal).length
}

const filteredBookings = computed(() => {
  let list = props.bookings

  // Status filter
  if (currentFilter.value === 'checked_in') {
    list = list.filter((b) => b.checked_in)
  } else if (currentFilter.value !== 'all') {
    list = list.filter((b) => b.status === currentFilter.value)
  }

  // Search filter
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter((b) => {
      return (
        b.reference.toLowerCase().includes(q) ||
        b.guest_name.toLowerCase().includes(q) ||
        b.guest_mobile.toLowerCase().includes(q) ||
        b.court_names.toLowerCase().includes(q) ||
        b.booking_date.includes(q)
      )
    })
  }

  return list
})

function statusBadgeClass(status: string): string {
  if (status === 'confirmed') return 'bg-[#EBF5DC] border-[#B7DD85] text-relish-dark'
  if (status === 'pending_payment') return 'bg-amber-50 border-amber-200 text-amber-900'
  return 'bg-red-50 border-red-200 text-red-800'
}

function statusDotClass(status: string): string {
  if (status === 'confirmed') return 'bg-relish-dark'
  if (status === 'pending_payment') return 'bg-amber-500'
  return 'bg-red-500'
}
</script>
