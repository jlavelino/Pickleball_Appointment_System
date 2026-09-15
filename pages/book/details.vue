<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Step tracker pill -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-card border border-line text-[11.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-relish-dark"></span>
        <span>Step 4 of 4 · Booker Details</span>
      </div>

      <h1 class="font-display font-bold text-[28px] text-ink m-0 leading-tight">
        Player registration
      </h1>
      <p class="text-ink-soft text-[14px] m-0 mb-3.5 leading-relaxed">
        {{ store.dateLabel }} · {{ store.slotRangeLabel }}
      </p>

      <!-- Hold timer card -->
      <div class="mb-4">
        <HoldTimer :seconds="store.holdSeconds" />
      </div>

      <!-- Section 1: Primary Booker Card -->
      <div class="form-section-card mb-4">
        <div class="flex items-center gap-2 mb-3.5">
          <div class="w-7 h-7 rounded-lg bg-ink text-cream flex items-center justify-center text-[12px] font-bold">
            1
          </div>
          <div>
            <h2 class="text-[14px] font-bold text-ink uppercase tracking-wider m-0">
              Primary Booker
            </h2>
            <p class="text-[11.5px] text-ink-soft m-0">The match pass will be issued under this name</p>
          </div>
        </div>

        <!-- Full Name -->
        <div class="field-group">
          <label class="field-label" for="booker-name">
            Full name <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="booker-name"
              v-model="store.bookerName"
              type="text"
              class="field-input"
              placeholder="e.g. Juan Dela Cruz"
              autocomplete="name"
            />
          </div>
        </div>

        <!-- Mobile Number -->
        <div class="field-group">
          <label class="field-label" for="booker-mobile">
            Mobile number <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="booker-mobile"
              v-model="store.bookerMobile"
              type="tel"
              class="field-input font-mono"
              placeholder="09xx xxx xxxx"
              autocomplete="tel"
              inputmode="numeric"
            />
          </div>
          <p class="field-hint">Used for SMS confirmation and emergency court updates.</p>
        </div>

        <!-- Facebook Account -->
        <div class="field-group mb-0">
          <label class="field-label" for="booker-fb">
            Facebook account / Messenger <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="booker-fb"
              v-model="store.bookerFacebook"
              type="text"
              class="field-input"
              placeholder="Your profile name or profile URL"
            />
          </div>
          <p class="field-hint">Required by venue administration for booking coordination.</p>
        </div>
      </div>

      <!-- Section 2: Playing Squad / Co-Players Card -->
      <div class="form-section-card mb-4">
        <div class="flex items-center justify-between mb-3.5">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-sold text-relish-dark flex items-center justify-center text-[12px] font-bold">
              2
            </div>
            <div>
              <h2 class="text-[14px] font-bold text-ink uppercase tracking-wider m-0">
                Co-Players / Squad
              </h2>
              <p class="text-[11.5px] text-ink-soft m-0">Optional list of players joining your session</p>
            </div>
          </div>
          <span class="text-[11.5px] font-semibold text-ink-soft px-2 py-0.5 rounded bg-cream border border-line">
            {{ store.players.length }} added
          </span>
        </div>

        <div
          v-for="(player, idx) in store.players"
          :key="idx"
          class="flex items-center gap-2 mb-2.5"
        >
          <div class="w-6 text-center font-mono text-[12px] font-bold text-ink-soft">
            #{{ idx + 1 }}
          </div>
          <input
            v-model="player.name"
            type="text"
            class="field-input flex-1 !py-2.5 !text-[14px]"
            :placeholder="`Player ${idx + 1} name`"
          />
          <button
            type="button"
            class="remove-btn"
            aria-label="Remove player"
            @click="removePlayer(idx)"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <button
          type="button"
          class="add-player-btn"
          @click="addPlayer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add another player
        </button>
      </div>

      <!-- Section 3: Facility Gate Pass & Valid ID Upload -->
      <div class="form-section-card mb-2">
        <div class="flex items-center gap-2 mb-3.5">
          <div class="w-7 h-7 rounded-lg bg-ink text-cream flex items-center justify-center text-[12px] font-bold">
            3
          </div>
          <div>
            <h2 class="text-[14px] font-bold text-ink uppercase tracking-wider m-0">
              Valid Government ID <span class="text-red-500">*</span>
            </h2>
            <p class="text-[11.5px] text-ink-soft m-0">Required for venue security check-in</p>
          </div>
        </div>

        <label
          class="id-upload-zone"
          :class="{ 'id-upload-zone--has-file': store.idPhotoName }"
          for="booker-id"
        >
          <!-- Empty State -->
          <div v-if="!store.idPhotoName" class="flex flex-col items-center gap-2 text-center py-2">
            <div class="w-12 h-12 rounded-2xl bg-sold flex items-center justify-center text-relish-dark shadow-xs">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="3"/>
                <circle cx="9" cy="10" r="2"/>
                <line x1="15" y1="8" x2="17" y2="8"/>
                <line x1="15" y1="12" x2="17" y2="12"/>
                <line x1="7" y1="16" x2="17" y2="16"/>
              </svg>
            </div>
            <div>
              <div class="text-[14px] font-bold text-ink">Tap to upload ID photo</div>
              <div class="text-[12px] text-ink-soft mt-0.5">Driver's License, Passport, UMID, National ID, etc.</div>
            </div>
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-relish-dark px-2.5 py-1 rounded-full bg-sold">
              Supports JPG, PNG · Max 10MB
            </span>
          </div>

          <!-- File Uploaded State -->
          <div v-else class="flex items-center justify-between w-full gap-3 p-1">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="text-[13.5px] font-bold text-ink truncate">ID attached successfully</div>
                <div class="text-[11.5px] text-ink-soft font-mono truncate max-w-[200px]">{{ store.idPhotoName }}</div>
              </div>
            </div>

            <button
              type="button"
              class="shrink-0 text-[12px] font-bold text-red-600 hover:text-red-700 underline px-2 py-1"
              @click.prevent="clearId"
            >
              Replace
            </button>
          </div>
        </label>

        <input
          id="booker-id"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="handleIdFile"
        />

        <div class="flex items-center gap-1.5 mt-2.5 text-[11px] text-ink-soft">
          <svg class="w-3.5 h-3.5 text-relish-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>IDs are securely processed and verified solely for gate admission.</span>
        </div>
      </div>
    </div>

    <BottomCTA
      label="Proceed to Payment"
      :disabled="!canProceed"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBookingStore } from '~/stores/booking'
import HoldTimer from '~/components/ui/HoldTimer.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'Player details — PickleBook' })

const store = useBookingStore()

if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

onMounted(() => {
  store.startHold()
})

const canProceed = computed(() =>
  store.bookerName.trim().length > 0 &&
  store.bookerMobile.trim().length >= 10 &&
  store.bookerFacebook.trim().length > 0 &&
  store.idPhotoName !== null
)

function addPlayer() {
  store.players.push({ name: '', mobile: '' })
}

function removePlayer(idx: number) {
  store.players.splice(idx, 1)
}

function handleIdFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    store.idPhotoName = file.name
    store.idPhotoFile = file
  }
}

function clearId() {
  store.idPhotoName = null
  store.idPhotoFile = null
  const input = document.getElementById('booker-id') as HTMLInputElement
  if (input) input.value = ''
}

function goNext() {
  if (canProceed.value) {
    navigateTo('/book/payment')
  }
}
</script>

<style scoped>
.form-section-card {
  background: var(--cream-card, #FDFCF5);
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 2px 8px -3px rgba(34, 51, 24, 0.05);
}

.field-group {
  margin-bottom: 14px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink, #223318);
  margin-bottom: 5px;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1.5px solid var(--line, #DDDDB8);
  border-radius: 12px;
  padding: 11px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  color: var(--ink, #223318);
  outline: none;
  transition: all 0.15s ease-out;
}
.field-input::placeholder {
  color: rgba(34, 51, 24, 0.35);
}
.field-input:focus {
  border-color: var(--ink, #223318);
  box-shadow: 0 0 0 3px rgba(34, 51, 24, 0.08);
}

.field-hint {
  margin: 4px 0 0;
  font-size: 11.5px;
  color: var(--ink-soft, #5A6650);
  line-height: 1.35;
}

.add-player-btn {
  width: 100%;
  border: 1.5px dashed var(--line, #DDDDB8);
  border-radius: 12px;
  background: transparent;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink, #223318);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease-out;
  font-family: 'Inter', sans-serif;
}
.add-player-btn:hover {
  border-color: var(--ink, #223318);
  background: rgba(34, 51, 24, 0.04);
}

.remove-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line, #DDDDB8);
  background: #FFFFFF;
  color: var(--ink-soft, #5A6650);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease-out;
}
.remove-btn:hover {
  background: #FEECEB;
  border-color: #E5484D;
  color: #E5484D;
}

.id-upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
  border: 2px dashed var(--line, #DDDDB8);
  border-radius: 14px;
  background: #FFFFFF;
  cursor: pointer;
  padding: 14px;
  transition: all 0.15s ease-out;
}
.id-upload-zone:hover {
  border-color: var(--ink, #223318);
  background: rgba(34, 51, 24, 0.02);
}
.id-upload-zone--has-file {
  border-style: solid;
  border-color: #10B981;
  background: #F0FDF4;
}
</style>
