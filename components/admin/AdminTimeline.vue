<template>
  <div class="bg-white rounded-[24px] border border-line shadow-sm p-4 sm:p-6 overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-line">
      <div>
        <h2 class="font-display font-bold text-[18px] text-ink m-0 flex items-center gap-2">
          <span>Court Schedule Grid</span>
          <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sold text-relish-dark font-sans">
            8:00 AM – 11:00 PM
          </span>
        </h2>
        <p class="text-[12.5px] text-ink-soft m-0 mt-0.5">
          Live court timeline for {{ selectedDateLabel }}
        </p>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-3 text-[11.5px] font-medium text-ink-soft flex-wrap">
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-md bg-[#E8F3D6] border border-[#C5E19A]"></span>
          Confirmed
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-md bg-[#D1FAE5] border border-[#6EE7B7]"></span>
          Checked In
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-md bg-[#FEF3C7] border border-[#FDE68A]"></span>
          Pending
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-md bg-cream border border-line"></span>
          Available
        </span>
      </div>
    </div>

    <!-- Timeline Grid Table -->
    <div class="overflow-x-auto">
      <div class="min-w-[620px]">
        <!-- Court Columns Header -->
        <div
          class="grid gap-2 mb-2 pb-2 text-center text-[13px] font-bold text-ink"
          :style="gridColumnsStyle"
        >
          <div class="text-left text-ink-soft text-[11px] font-mono uppercase tracking-wider py-1 pl-1">
            Time
          </div>
          <div
            v-for="court in courtHeaders"
            :key="court.id"
            class="p-2 rounded-xl bg-lime-soft/60 border border-lime/20 flex items-center justify-center gap-1.5"
          >
            <span class="font-display font-bold text-ink">{{ court.name }}</span>
            <span class="text-[10px] uppercase font-bold text-lime-text px-1.5 py-0.5 rounded bg-white/70 border border-lime/20">
              {{ court.type.includes('covered') ? 'Covered' : 'Indoor' }}
            </span>
          </div>
        </div>

        <!-- Hourly Rows -->
        <div class="space-y-1.5">
          <div
            v-for="hour in hours"
            :key="hour.startStr"
            class="grid gap-2 items-center"
            :style="gridColumnsStyle"
          >
            <!-- Time label -->
            <div class="text-left font-mono text-[11px] text-ink-soft pl-1 leading-tight">
              <div class="font-bold text-ink">{{ hour.label }}</div>
              <div class="text-[9px] text-ink-soft/70">to {{ hour.endLabel }}</div>
            </div>

            <!-- Court Slots (Dynamically matches courts from database) -->
            <div
              v-for="court in courtHeaders"
              :key="court.id"
              class="h-14 rounded-xl border transition-all duration-150 relative overflow-hidden"
              :class="getSlotClass(court.id, hour.startStr)"
            >
              <!-- If slot has booking -->
              <div
                v-if="getBookingForSlot(court.id, hour.startStr)"
                class="w-full h-full p-2 flex flex-col justify-between cursor-pointer hover:opacity-90 active:scale-[0.99]"
                @click="onSelectBooking(getBookingForSlot(court.id, hour.startStr)!)"
              >
                <div class="flex items-center justify-between gap-1 leading-none">
                  <span class="font-bold text-[12px] truncate">
                    {{ getBookingForSlot(court.id, hour.startStr)!.guest_name }}
                  </span>
                  <span
                    v-if="getBookingForSlot(court.id, hour.startStr)!.checked_in"
                    class="text-[9.5px] font-extrabold uppercase px-1 py-0.2 rounded bg-emerald-600 text-white leading-tight shrink-0"
                  >
                    IN
                  </span>
                  <span
                    v-else
                    class="text-[9.5px] font-bold uppercase px-1 py-0.2 rounded shrink-0"
                    :class="getBookingForSlot(court.id, hour.startStr)!.status === 'confirmed' ? 'bg-[#38591A] text-white' : 'bg-amber-600 text-white'"
                  >
                    {{ getBookingForSlot(court.id, hour.startStr)!.status === 'confirmed' ? 'PAID' : 'HOLD' }}
                  </span>
                </div>

                <div class="flex items-center justify-between text-[10px] text-ink-soft/90 font-mono mt-0.5">
                  <span class="truncate">{{ getBookingForSlot(court.id, hour.startStr)!.reference }}</span>
                  <div class="flex items-center gap-1 shrink-0">
                    <span class="text-[9px] font-sans font-bold text-relish-dark/90 bg-black/5 px-1 py-0.2 rounded">
                      {{ formatBookingTimeSpan(getBookingForSlot(court.id, hour.startStr)!) }}
                    </span>
                    <span v-if="getBookingForSlot(court.id, hour.startStr)!.paddles.length" class="mdi mdi-racquetball text-[11px] text-relish-dark" title="Paddles rented"></span>
                  </div>
                </div>
              </div>

              <!-- Available / Open slot -->
              <div
                v-else
                class="w-full h-full flex items-center justify-center transition-all duration-150 text-[11px] font-medium border-2 border-dashed rounded-xl border-transparent text-ink-soft/30 hover:text-lime-text hover:border-lime/40 hover:bg-lime-soft/30"
              >
                <span>Open</span>
              </div>
            </div>
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
    // Check court match
    const courtMatch = b.court_ids.includes(courtId) || b.court_names.toLowerCase().includes(courtName.toLowerCase())
    if (!courtMatch) return false

    // Check time overlap
    const bStartH = parseInt(b.start_time.split(':')[0])
    let bEndH = parseInt(b.end_time.split(':')[0])
    if (bEndH === 0) bEndH = 24

    return slotHour >= bStartH && slotHour < bEndH
  })
}

function getSlotClass(courtId: string, startStr: string): string {
  const b = getBookingForSlot(courtId, startStr)
  if (!b) {
    return 'bg-cream/40 border-line/40'
  }
  if (b.checked_in) {
    return 'bg-[#E1F7EC] border-[#86EFAC] text-emerald-950 shadow-2xs'
  }
  if (b.status === 'confirmed') {
    return 'bg-[#EBF5DC] border-[#B7DD85] text-relish-dark shadow-2xs'
  }
  if (b.status === 'pending_payment') {
    return 'bg-[#FEF8E7] border-[#FDE68A] text-amber-900 shadow-2xs'
  }
  return 'bg-red-50 border-red-200 text-red-900'
}

function onSelectBooking(booking: AdminBooking) {
  emit('select-booking', booking)
}
</script>
