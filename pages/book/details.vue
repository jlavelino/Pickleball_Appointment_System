<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-4">
      <!-- Page header -->
      <div class="mb-1">
        <h1 class="page-title">Player registration</h1>
        <p class="page-subtitle">
          {{ store.dateLabel }} · {{ store.slotRangeLabel }}
        </p>
      </div>

      <!-- Hold Timer -->
      <HoldTimer :seconds="store.holdSeconds" />

      <!-- ── Section 01: Primary Booker ─────────── -->
      <div class="form-section mb-4">
        <div class="section-heading">
          <div class="section-number section-number--dark">01</div>
          <div>
            <h2 class="section-title">Primary Booker</h2>
            <p class="section-desc">The match pass will be issued under this name</p>
          </div>
        </div>

        <!-- Full Name -->
        <div class="field-group">
          <label class="field-label" for="booker-name">
            Full name <span class="required-star">*</span>
          </label>
          <input
            id="booker-name"
            v-model="store.bookerName"
            type="text"
            class="field-input"
            placeholder="e.g. Juan Dela Cruz"
            autocomplete="name"
          />
        </div>

        <!-- Mobile Number -->
        <div class="field-group">
          <label class="field-label" for="booker-mobile">
            Mobile number <span class="required-star">*</span>
          </label>
          <input
            id="booker-mobile"
            v-model="store.bookerMobile"
            type="tel"
            class="field-input font-mono"
            placeholder="09xx xxx xxxx"
            autocomplete="tel"
            inputmode="numeric"
          />
          <p class="field-hint">Used for SMS confirmation and emergency court updates.</p>
        </div>

        <!-- Facebook Account -->
        <div class="field-group mb-0">
          <label class="field-label" for="booker-fb">
            Facebook account / Messenger <span class="required-star">*</span>
          </label>
          <input
            id="booker-fb"
            v-model="store.bookerFacebook"
            type="text"
            class="field-input"
            placeholder="Your profile name or profile URL"
          />
          <p class="field-hint">Required by venue administration for booking coordination.</p>
        </div>
      </div>

      <!-- ── Section 02: Co-Players ─────────────── -->
      <div class="form-section mb-4">
        <div class="section-heading">
          <div class="section-number section-number--light">02</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h2 class="section-title">Co-Players / Squad</h2>
              <span
                v-if="store.players.length > 0"
                class="players-badge"
              >
                {{ store.players.length }} added
              </span>
            </div>
            <p class="section-desc">Optional list of players joining your session</p>
          </div>
        </div>

        <!-- Player list -->
        <div
          v-for="(player, idx) in store.players"
          :key="idx"
          class="player-row"
        >
          <span class="player-index">#{{ idx + 1 }}</span>
          <input
            v-model="player.name"
            type="text"
            class="field-input flex-1"
            :placeholder="`Player ${idx + 1} name`"
          />
          <button
            type="button"
            class="remove-btn"
            aria-label="Remove player"
            @click="removePlayer(idx)"
          >
            <span class="mdi mdi-close text-[15px]"></span>
          </button>
        </div>

        <!-- Add player button -->
        <button
          type="button"
          class="add-player-btn"
          @click="addPlayer"
        >
          <span class="mdi mdi-plus text-[15px]"></span>
          Add another player
        </button>
      </div>

      <!-- ── Section 03: Government ID ─────────── -->
      <div class="form-section mb-2">
        <div class="section-heading">
          <div class="section-number section-number--dark">03</div>
          <div>
            <h2 class="section-title">
              Valid Government ID <span class="required-star">*</span>
            </h2>
            <p class="section-desc">Required for venue security check-in</p>
          </div>
        </div>

        <label
          for="booker-id"
          class="id-upload-zone group"
          :class="{ 'id-upload-zone--has-file': !!store.idPhotoName }"
        >
          <input
            id="booker-id"
            type="file"
            accept="image/*,.pdf"
            class="sr-only"
            @change="handleIdFile"
          />

          <!-- File uploaded state -->
          <div v-if="store.idPhotoName" class="flex items-center justify-between w-full gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-10 h-10 rounded-full bg-[#E8F4D8] flex items-center justify-center text-[#0B6623] shrink-0">
                <span class="mdi mdi-check-circle text-[22px]"></span>
              </div>
              <div class="min-w-0">
                <div class="text-[13.5px] font-bold text-[#14231C] truncate">
                  {{ store.idPhotoName }}
                </div>
                <div class="text-[11.5px] text-[#0B6623] font-medium">Ready for verification</div>
              </div>
            </div>
            <button
              type="button"
              class="text-[12px] font-bold text-[#D94A4A] hover:underline shrink-0"
              @click.prevent="clearId"
            >
              Remove
            </button>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-3">
            <div class="w-12 h-12 rounded-full bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <span class="mdi mdi-cloud-upload-outline text-[24px]"></span>
            </div>
            <div class="text-[13.5px] font-bold text-[#14231C]">Tap to upload valid ID</div>
            <div class="text-[11.5px] text-[#66756D] mt-1">JPG, PNG, or PDF up to 10MB</div>
          </div>
        </label>
      </div>
    </div>

    <BottomCTA
      :label="canProceed ? 'Proceed to Payment' : 'Complete details to continue'"
      :disabled="!canProceed"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import HoldTimer from '~/components/ui/HoldTimer.vue'
import BottomCTA from '~/components/ui/BottomCta.vue'

useHead({ title: 'Player details — PickleBook' })

const store = useBookingStore()

const canProceed = computed(() => {
  return (
    store.bookerName.trim().length >= 2 &&
    store.bookerMobile.trim().length >= 7 &&
    store.bookerFacebook.trim().length >= 2 &&
    !!store.idPhotoName
  )
})

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
/* ── Page Header ──────────────────────────────── */
.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: 30px;
  font-weight: 700;
  color: #14231C;
  margin: 0;
  line-height: 1.15;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #66756D;
  margin: 6px 0 0;
  line-height: 1.5;
}

/* ── Form Section Card ────────────────────────── */
.form-section {
  background: #FFFFFF;
  border: 1.5px solid #DCE6D8;
  border-radius: 20px;
  padding: 18px 18px;
  box-shadow: 0 2px 10px -2px rgba(20, 35, 28, 0.04);
}

/* ── Section Heading ─────────────────────────── */
.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.section-number {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  flex-shrink: 0;
  margin-top: 1px;
}

.section-number--dark {
  background: #14231C;
  color: #FFFFFF;
}

.section-number--light {
  background: #E8F4D8;
  color: #0B6623;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #14231C;
  margin: 0;
}

.section-desc {
  font-size: 11.5px;
  color: #66756D;
  margin: 2px 0 0;
  font-family: 'Inter', sans-serif;
}

/* ── Fields ──────────────────────────────────── */
.field-group {
  margin-bottom: 14px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #14231C;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
}

.required-star {
  color: #D94A4A;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1.5px solid #DCE6D8;
  border-radius: 12px;
  padding: 12px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #14231C;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  height: 50px;
}

.field-input::placeholder {
  color: #9AA39E;
}

.field-input:focus {
  border-color: #0B6623;
  box-shadow: 0 0 0 3px rgba(11, 102, 35, 0.1);
}

.field-hint {
  margin: 5px 0 0;
  font-size: 11.5px;
  color: #66756D;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
}

/* ── Players Badge ───────────────────────────── */
.players-badge {
  font-size: 11px;
  font-weight: 700;
  color: #0B6623;
  background: #E8F4D8;
  padding: 2px 10px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}

/* ── Player Row ──────────────────────────────── */
.player-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.player-index {
  width: 24px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #66756D;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

/* ── Add Player Button ───────────────────────── */
.add-player-btn {
  width: 100%;
  border: 1.5px dashed #DCE6D8;
  border-radius: 12px;
  background: transparent;
  padding: 11px;
  font-size: 13px;
  font-weight: 700;
  color: #0B6623;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
}

.add-player-btn:hover {
  border-color: #0B6623;
  background: #E8F4D8;
}

/* ── Remove Button ───────────────────────────── */
.remove-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1.5px solid #DCE6D8;
  background: #FFFFFF;
  color: #66756D;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.remove-btn:hover {
  background: #FDE8E8;
  border-color: #D94A4A;
  color: #D94A4A;
}

/* ── ID Upload Zone ──────────────────────────── */
.id-upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 104px;
  border: 2px dashed #DCE6D8;
  border-radius: 16px;
  background: #FAF9F1;
  cursor: pointer;
  padding: 16px;
  transition: all 0.15s ease;
}

.id-upload-zone:hover {
  border-color: #0B6623;
  background: #F4FAF0;
}

.id-upload-zone--has-file {
  border-style: solid;
  border-color: #0B6623;
  background: #F6FAF2;
}
</style>
