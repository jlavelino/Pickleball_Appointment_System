<template>
  <div class="bg-white rounded-[20px] sm:rounded-[28px] border border-[#DCE6D8] shadow-subtle p-3.5 sm:p-7 overflow-hidden">
    <!-- Header & Live Status Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3.5 sm:pb-4 border-b border-[#DCE6D8]">
      <div>
        <h2 class="font-display font-bold text-[17px] sm:text-[20px] text-[#14231C] m-0 flex items-center gap-2">
          <span>Court Schedule Grid</span>
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-[#E8F4D8] text-[#0B6623] border border-[#DCE6D8] font-sans">
            8:00 AM – 11:00 PM
          </span>
        </h2>
        <p class="text-[12px] sm:text-[13px] text-[#66756D] m-0 mt-0.5 sm:mt-1">
          Live court assignments and schedule for <strong class="text-[#14231C]">{{ selectedDateLabel }}</strong>
        </p>
      </div>

      <!-- Refined Legend -->
      <div class="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11.5px] font-semibold text-[#66756D] flex-wrap">
        <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#E8F4D8] text-[#0B6623] border border-[#DCE6D8]">
          <span class="w-2 h-2 rounded-full bg-[#0B6623]"></span>
          <span>Confirmed</span>
        </span>
        <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
          <span class="w-2 h-2 rounded-full bg-[#059669]"></span>
          <span>Checked In</span>
        </span>
        <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FFF4E5] text-[#9A3412] border border-[#FED7AA]">
          <span class="w-2 h-2 rounded-full bg-[#D98216]"></span>
          <span>Hold</span>
        </span>
        <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FAF9F1] text-[#66756D] border border-[#DCE6D8]">
          <span class="w-2 h-2 rounded-full border border-[#66756D] border-dashed"></span>
          <span>Available</span>
        </span>
        <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FDE8E8] text-[#991B1B] border border-[#FECACA]">
          <span class="w-2 h-2 rounded-full bg-[#D94A4A]"></span>
          <span>Maintenance</span>
        </span>
      </div>
    </div>

    <!-- Mobile horizontal swipe hint -->
    <div class="sm:hidden flex items-center justify-end gap-1 text-[11px] text-[#66756D] mb-2 px-1">
      <span class="mdi mdi-arrow-left-right text-[12px] text-[#0B6623]"></span>
      <span>Swipe horizontally to view courts</span>
    </div>

    <!-- Timeline Grid Table -->
    <div class="overflow-x-auto pb-2 no-scrollbar">
      <div class="min-w-[520px] sm:min-w-[680px]">
        <!-- Court Columns Header -->
        <div
          class="grid gap-2.5 mb-3 text-center text-[13px] font-bold text-[#14231C]"
          :style="gridColumnsStyle"
        >
          <div class="flex flex-col justify-end text-left text-[#66756D] text-[10.5px] font-mono uppercase tracking-wider pb-1 pl-1">
            <span>Time Slot</span>
          </div>
          <div
            v-for="court in courtHeaders"
            :key="court.id"
            class="px-3.5 py-2.5 rounded-xl bg-[#FAF9F1] border border-[#DCE6D8] flex items-center justify-between gap-2 shadow-2xs"
          >
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="court.status === 'active' ? 'bg-[#0B6623] ring-2 ring-[#0B6623]/20' : 'bg-[#D94A4A]'"></span>
              <div class="text-left">
                <div class="font-display font-bold text-[#14231C] text-[14px] leading-tight">{{ court.name }}</div>
                <div class="text-[10px] text-[#66756D] font-mono leading-none mt-0.5">₱{{ court.price_per_hour || 250 }}/hr</div>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <span
                v-if="court.status === 'maintenance'"
                class="text-[9px] uppercase font-bold text-[#991B1B] px-2 py-0.5 rounded-full bg-[#FDE8E8] border border-[#FECACA]"
              >
                Maintenance
              </span>
              <span
                v-else
                class="text-[9.5px] font-semibold text-[#0B6623] px-2 py-0.5 rounded-full bg-[#E8F4D8] border border-[#DCE6D8]"
              >
                {{ getAvailableHoursCount(court.id) }} open
              </span>
            </div>
          </div>
        </div>

        <!-- Hourly Rows -->
        <div class="space-y-2">
          <div
            v-for="hour in hours"
            :key="hour.startStr"
            class="grid gap-2.5 items-center"
            :style="gridColumnsStyle"
          >
            <!-- Time label -->
            <div class="text-left font-mono pl-1 leading-tight select-none">
              <div class="font-bold text-[12px] text-[#14231C]">{{ hour.label }}</div>
              <div class="text-[9.5px] text-[#66756D]/60 mt-0.5">{{ hour.endLabel }}</div>
            </div>

            <!-- Court Slots -->
            <template v-for="court in courtHeaders" :key="court.id">
              <!-- CASE 1: Booked Slot -->
              <div
                v-if="getBookingForSlot(court.id, hour.startStr)"
                class="h-14 rounded-xl border transition-all duration-150 relative overflow-hidden shadow-2xs select-none"
                :class="getSlotClass(court.id, hour.startStr)"
              >
                <div
                  class="w-full h-full p-2.5 flex flex-col justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
                  @click="onSelectBooking(getBookingForSlot(court.id, hour.startStr)!)"
                >
                  <div class="flex items-center justify-between gap-1.5 leading-none">
                    <span class="font-bold text-[12.5px] text-[#14231C] truncate">
                      {{ getBookingForSlot(court.id, hour.startStr)!.guest_name }}
                    </span>
                    <span
                      v-if="getBookingForSlot(court.id, hour.startStr)!.checked_in"
                      class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#059669] text-white flex items-center gap-0.5 shrink-0 shadow-xs"
                    >
                      <span class="mdi mdi-check text-[10px]"></span>
                      <span>IN</span>
                    </span>
                    <span
                      v-else
                      class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 shadow-xs"
                      :class="getBookingForSlot(court.id, hour.startStr)!.status === 'confirmed'
                        ? 'bg-[#0B6623] text-white'
                        : 'bg-[#D98216] text-white'"
                    >
                      {{ getBookingForSlot(court.id, hour.startStr)!.status === 'confirmed' ? 'PAID' : 'HOLD' }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between text-[10.5px] text-[#66756D] font-mono mt-0.5">
                    <span class="truncate">{{ getBookingForSlot(court.id, hour.startStr)!.reference }}</span>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <span class="text-[9.5px] font-sans font-bold text-[#0B6623] bg-[#0B6623]/10 px-1.5 py-0.2 rounded-md">
                        {{ formatBookingTimeSpan(getBookingForSlot(court.id, hour.startStr)!) }}
                      </span>
                      <span
                        v-if="getBookingForSlot(court.id, hour.startStr)!.paddles && getBookingForSlot(court.id, hour.startStr)!.paddles.length"
                        class="mdi mdi-racquetball text-[13px] text-[#0B6623]"
                        title="Paddles rented"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CASE 2: Maintenance Slot -->
              <div
                v-else-if="court.status === 'maintenance'"
                class="h-14 rounded-xl border border-dashed border-[#FECACA] bg-[#FDE8E8]/40 flex items-center justify-center gap-1.5 text-[#991B1B]/70 select-none text-[11px] font-medium"
              >
                <span class="mdi mdi-wrench-clock-outline text-[13px]"></span>
                <span>Maintenance</span>
              </div>

              <!-- CASE 3: Clean, Single-border Open Slot -->
              <div
                v-else
                class="h-14 rounded-xl border border-dashed border-[#DCE6D8]/80 bg-[#FAF9F1]/30 hover:bg-[#E8F4D8]/40 hover:border-[#0B6623]/40 transition-all duration-150 flex items-center justify-center cursor-pointer group select-none"
              >
                <div class="flex items-center gap-1.5 text-[#66756D]/40 group-hover:text-[#0B6623] transition-colors">
                  <span class="mdi mdi-plus text-[13px] opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-transform"></span>
                  <span class="text-[11px] font-medium tracking-wide">Open Slot</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdminBooking, AdminCourt } from '~/composables/useAdminData'

const props = defineProps<{
  courts: AdminCourt[]
  bookings: AdminBooking[]
  selectedDateLabel: string
}>()

const emit = defineEmits<{
  'select-booking': [booking: AdminBooking]
}>()

const defaultCourts = [
  { id: 'c1', name: 'Court 1', type: 'indoor', price_per_hour: 250, status: 'active' as const },
  { id: 'c2', name: 'Court 2', type: 'indoor', price_per_hour: 250, status: 'active' as const },
]

const courtHeaders = computed(() => {
  if (props.courts && props.courts.length > 0) {
    return props.courts
  }
  return defaultCourts
})

const gridColumnsStyle = computed(() => {
  const count = courtHeaders.value.length || 2
  return {
    gridTemplateColumns: `85px repeat(${count}, minmax(180px, 1fr))`,
  }
})

// 8 AM to 11 PM
const hours = computed(() => {
  const list = []
  for (let h = 8; h <= 22; h++) {
    const nextH = h + 1
    const formatHour = (hour: number) => {
      const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM'
      const displayH = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayH}:00 ${ampm}`
    }
    const startStr = `${String(h).padStart(2, '0')}:00:00`
    list.push({
      startStr,
      hourNum: h,
      label: formatHour(h),
      endLabel: formatHour(nextH),
    })
  }
  return list
})

function formatBookingTimeSpan(b: AdminBooking): string {
  const formatH = (tStr: string) => {
    const h = parseInt(tStr.split(':')[0])
    const ampm = h >= 12 && h < 24 ? 'PM' : 'AM'
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${displayH}${ampm}`
  }
  return `${formatH(b.start_time)}–${formatH(b.end_time)}`
}

function getBookingForSlot(courtId: string, startStr: string): AdminBooking | undefined {
  const courtObj = props.courts.find((c) => c.id === courtId)
  const courtName = courtObj ? courtObj.name : courtId === 'c1' ? 'Court 1' : courtId === 'c2' ? 'Court 2' : 'Court 3'
  const slotHour = parseInt(startStr.split(':')[0])

  return props.bookings.find((b) => {
    const courtMatch = b.court_ids.includes(courtId) || b.court_names.toLowerCase().includes(courtName.toLowerCase())
    if (!courtMatch) return false

    const bStartH = parseInt(b.start_time.split(':')[0])
    let bEndH = parseInt(b.end_time.split(':')[0])
    if (bEndH === 0) bEndH = 24

    return slotHour >= bStartH && slotHour < bEndH
  })
}

function getSlotClass(courtId: string, startStr: string): string {
  const b = getBookingForSlot(courtId, startStr)
  if (!b) return ''
  if (b.checked_in) {
    return 'bg-[#D1FAE5] border-[#6EE7B7] text-[#065F46] hover:border-[#059669]'
  }
  if (b.status === 'confirmed') {
    return 'bg-[#E8F4D8] border-[#B8DC9E] text-[#14231C] hover:border-[#0B6623]'
  }
  if (b.status === 'pending_payment') {
    return 'bg-[#FFF4E5] border-[#FED7AA] text-[#9A3412] hover:border-[#D98216]'
  }
  return 'bg-[#FDE8E8] border-[#FECACA] text-[#991B1B]'
}

function getAvailableHoursCount(courtId: string): number {
  let count = 0
  for (const h of hours.value) {
    if (!getBookingForSlot(courtId, h.startStr)) count++
  }
  return count
}

function onSelectBooking(booking: AdminBooking) {
  emit('select-booking', booking)
}
</script>
