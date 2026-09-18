<template>
  <div class="bg-white rounded-[20px] sm:rounded-[28px] border border-[#DCE6D8] shadow-subtle overflow-hidden">
    <!-- Filter & Search Bar -->
    <div class="p-3.5 sm:p-5 border-b border-[#DCE6D8] bg-[#FAF9F1]/60 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 sm:gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80 md:w-96 shrink-0">
        <span class="mdi mdi-magnify text-[18px] sm:text-[20px] text-[#66756D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search guest, ref, phone, court..."
          class="w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-10 rounded-2xl bg-white border border-[#DCE6D8] text-[13px] sm:text-[13.5px] text-[#14231C] placeholder-[#66756D]/60 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/10 transition-all shadow-2xs"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#66756D] hover:text-[#14231C] p-0.5 cursor-pointer"
          @click="searchQuery = ''"
          aria-label="Clear search"
        >
          <span class="mdi mdi-close-circle text-[17px] sm:text-[18px]"></span>
        </button>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar w-full xl:w-auto p-1 bg-[#E8F4D8]/60 rounded-2xl border border-[#DCE6D8] shrink-0">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          type="button"
          class="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11.5px] sm:text-[12.5px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0"
          :class="currentFilter === tab.value
            ? 'bg-[#0B6623] text-white shadow-xs'
            : 'text-[#66756D] hover:text-[#14231C] hover:bg-white/60'"
          @click="currentFilter = tab.value"
        >
          {{ tab.label }}
          <span class="ml-1 text-[10.5px] sm:text-[11px] opacity-80 font-mono">({{ getTabCount(tab.value) }})</span>
        </button>
      </div>
    </div>

    <!-- Mobile View: Booking Cards (Phone screens) -->
    <div class="sm:hidden">
      <div v-if="filteredBookings.length > 0" class="divide-y divide-[#DCE6D8]/60">
        <div
          v-for="b in filteredBookings"
          :key="b.id"
          class="p-3.5 hover:bg-[#E8F4D8]/20 transition-colors cursor-pointer"
          @click="$emit('select-booking', b)"
        >
          <!-- Top Row: Reference + Status -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5 font-mono font-bold text-[13px] text-[#14231C]">
              <span>{{ b.reference }}</span>
              <span
                v-if="b.id_photo_url"
                class="mdi mdi-card-account-details text-[13px] text-[#0B6623]"
                title="Government ID Attached"
              ></span>
            </div>

            <!-- Status Pill -->
            <span
              v-if="b.checked_in"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D1FAE5] border border-[#6EE7B7] text-[#065F46] font-bold text-[10.5px] shadow-2xs"
            >
              <span class="mdi mdi-check-circle text-[12px] text-[#059669]"></span>
              <span>Checked In</span>
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10.5px] border shadow-2xs"
              :class="statusBadgeClass(b.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(b.status)"></span>
              <span>{{ formatStatus(b.status) }}</span>
            </span>
          </div>

          <!-- Middle Row: Guest Details + Amount -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-7 h-7 rounded-full bg-[#E8F4D8] text-[#0B6623] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#DCE6D8]">
                {{ getInitials(b.guest_name) }}
              </div>
              <div class="min-w-0">
                <div class="font-bold text-[13.5px] text-[#14231C] truncate">{{ b.guest_name }}</div>
                <div class="text-[11px] text-[#66756D] font-mono">{{ b.guest_mobile || '—' }}</div>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="font-display font-bold text-[15px] text-[#14231C]">
                ₱{{ Number(b.total_amount).toLocaleString() }}
              </div>
              <div v-if="b.payment_method" class="text-[9.5px] font-bold text-[#66756D] uppercase">
                {{ b.payment_method }}
              </div>
            </div>
          </div>

          <!-- Bottom Row: Court & Schedule + Action Button -->
          <div class="flex items-center justify-between pt-2 border-t border-[#DCE6D8]/50 text-[11.5px]">
            <div class="text-[#66756D]">
              <strong class="text-[#14231C]">{{ b.court_names }}</strong> · {{ b.start_time.slice(0, 5) }}–{{ b.end_time.slice(0, 5) }}
            </div>
            <button
              type="button"
              class="px-2.5 py-1 rounded-lg bg-[#FAF9F1] hover:bg-[#E8F4D8] text-[#0B6623] font-bold text-[11px] border border-[#DCE6D8] transition-all cursor-pointer shadow-2xs"
              @click.stop="$emit('select-booking', b)"
            >
              Verify Pass
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Empty State -->
      <div v-else class="py-12 text-center text-[#66756D] px-4">
        <div class="w-12 h-12 rounded-2xl bg-[#E8F4D8] text-[#0B6623] mx-auto mb-2.5 flex items-center justify-center border border-[#DCE6D8]">
          <span class="mdi mdi-text-box-search-outline text-[24px]"></span>
        </div>
        <div class="font-display font-bold text-[15px] text-[#14231C]">No bookings found</div>
        <div class="text-[12px] mt-1 text-[#66756D]">Try adjusting your search terms or filter selections.</div>
      </div>
    </div>

    <!-- Desktop / Tablet View: Bookings Table -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="w-full text-left text-[13px] border-collapse min-w-[760px]">
        <thead>
          <tr class="bg-[#FAF9F1] border-b border-[#DCE6D8] text-[#66756D] text-[11px] font-bold uppercase tracking-wider">
            <th class="py-3.5 px-5">Reference</th>
            <th class="py-3.5 px-5">Guest Booker</th>
            <th class="py-3.5 px-5">Court & Schedule</th>
            <th class="py-3.5 px-5">Amount</th>
            <th class="py-3.5 px-5">Status</th>
            <th class="py-3.5 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#DCE6D8]/60">
          <tr
            v-for="b in filteredBookings"
            :key="b.id"
            class="hover:bg-[#E8F4D8]/20 transition-colors cursor-pointer group"
            @click="$emit('select-booking', b)"
          >
            <!-- Reference -->
            <td class="py-4 px-5 font-mono font-bold text-[#14231C]">
              <div class="flex items-center gap-1.5">
                <span class="group-hover:text-[#0B6623] transition-colors">{{ b.reference }}</span>
                <span
                  v-if="b.id_photo_url"
                  class="mdi mdi-card-account-details text-[14px] text-[#0B6623]"
                  title="Government ID Attached"
                ></span>
              </div>
            </td>

            <!-- Booker with Avatar Initials -->
            <td class="py-4 px-5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-[#E8F4D8] text-[#0B6623] font-bold text-[12px] flex items-center justify-center shrink-0 border border-[#DCE6D8]">
                  {{ getInitials(b.guest_name) }}
                </div>
                <div>
                  <div class="font-bold text-[#14231C]">{{ b.guest_name }}</div>
                  <div class="text-[11.5px] text-[#66756D] font-mono">{{ b.guest_mobile || '—' }}</div>
                </div>
              </div>
            </td>

            <!-- Court & Schedule -->
            <td class="py-4 px-5">
              <div class="font-bold text-[#14231C]">{{ b.court_names }}</div>
              <div class="text-[11.5px] text-[#66756D] mt-0.5">
                {{ b.start_time.slice(0, 5) }} – {{ b.end_time.slice(0, 5) }} · <span class="font-medium text-[#14231C]">{{ b.booking_date }}</span>
              </div>
            </td>

            <!-- Amount Paid -->
            <td class="py-4 px-5">
              <div class="font-display font-bold text-[15px] text-[#14231C]">
                ₱{{ Number(b.total_amount).toLocaleString() }}
              </div>
              <div v-if="b.payment_method" class="text-[10.5px] font-bold text-[#66756D] uppercase">
                {{ b.payment_method }}
              </div>
            </td>

            <!-- Status Badge -->
            <td class="py-4 px-5">
              <span
                v-if="b.checked_in"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] border border-[#6EE7B7] text-[#065F46] font-bold text-[11px] shadow-2xs"
              >
                <span class="mdi mdi-check-circle text-[13px] text-[#059669]"></span>
                <span>Checked In</span>
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] border shadow-2xs"
                :class="statusBadgeClass(b.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(b.status)"></span>
                <span>{{ formatStatus(b.status) }}</span>
              </span>
            </td>

            <!-- Action Button -->
            <td class="py-4 px-5 text-right">
              <button
                type="button"
                class="px-3.5 py-1.5 rounded-xl bg-[#FAF9F1] hover:bg-[#E8F4D8] text-[#14231C] hover:text-[#0B6623] font-bold text-[12px] border border-[#DCE6D8] transition-all cursor-pointer shadow-2xs group-hover:border-[#0B6623]/40"
                @click.stop="$emit('select-booking', b)"
              >
                Verify Pass
              </button>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="filteredBookings.length === 0">
            <td colspan="6" class="py-14 text-center text-[#66756D]">
              <div class="w-13 h-13 rounded-2xl bg-[#E8F4D8] text-[#0B6623] mx-auto mb-3 flex items-center justify-center border border-[#DCE6D8]">
                <span class="mdi mdi-text-box-search-outline text-[26px]"></span>
              </div>
              <div class="font-display font-bold text-[16px] text-[#14231C]">No bookings found</div>
              <div class="text-[12.5px] mt-1 text-[#66756D]">Try adjusting your search terms or filter selections.</div>
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
  { label: 'Pending Hold', value: 'pending_payment' },
  { label: 'Cancelled', value: 'cancelled' },
]

function getTabCount(tabVal: string): number {
  if (tabVal === 'all') return props.bookings.length
  if (tabVal === 'checked_in') return props.bookings.filter((b) => b.checked_in).length
  return props.bookings.filter((b) => b.status === tabVal).length
}

function getInitials(name: string): string {
  if (!name) return 'PB'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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

function formatStatus(status: string): string {
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'pending_payment') return 'Hold'
  if (status === 'cancelled') return 'Cancelled'
  return status
}

function statusBadgeClass(status: string): string {
  if (status === 'confirmed') return 'bg-[#E8F4D8] border-[#B8DC9E] text-[#0B6623]'
  if (status === 'pending_payment') return 'bg-[#FFF4E5] border-[#FED7AA] text-[#9A3412]'
  return 'bg-[#FDE8E8] border-[#FECACA] text-[#991B1B]'
}

function statusDotClass(status: string): string {
  if (status === 'confirmed') return 'bg-[#0B6623]'
  if (status === 'pending_payment') return 'bg-[#D98216]'
  return 'bg-[#D94A4A]'
}
</script>
