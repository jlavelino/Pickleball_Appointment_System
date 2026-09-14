<template>
  <div class="flex flex-col min-h-full">
    <div class="flex-1 pb-2">
      <h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5">
        Your details
      </h1>
      <p class="text-ink-soft text-[14px] m-0 mb-5">{{ store.dateLabel }}</p>

      <!-- Hold timer -->
      <HoldTimer :seconds="store.holdSeconds" />


      <!-- Full name -->
      <div class="field-group">
        <label class="field-label" for="booker-name">Full name <span class="text-red-500">*</span></label>
        <input
          id="booker-name"
          v-model="store.bookerName"
          type="text"
          class="field-input"
          placeholder="Juan Dela Cruz"
          autocomplete="name"
        />
      </div>

      <!-- Mobile number -->
      <div class="field-group">
        <label class="field-label" for="booker-mobile">Mobile number <span class="text-red-500">*</span></label>
        <input
          id="booker-mobile"
          v-model="store.bookerMobile"
          type="tel"
          class="field-input"
          placeholder="09xx xxx xxxx"
          autocomplete="tel"
          inputmode="numeric"
        />
      </div>

      <!-- Facebook account -->
      <div class="field-group">
        <label class="field-label" for="booker-fb">Facebook account <span class="text-red-500">*</span></label>
        <input
          id="booker-fb"
          v-model="store.bookerFacebook"
          type="text"
          class="field-input"
          placeholder="Your Facebook name"
        />
        <p class="field-hint">Required. The venue uses this to reach you about your booking.</p>
      </div>

      <!-- Players -->
      <div class="field-group">
        <label class="field-label">Who is playing with you</label>
        <div
          v-for="(player, idx) in store.players"
          :key="idx"
          class="flex gap-2 mb-2"
        >
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
          >✕</button>
        </div>
        <button
          type="button"
          class="add-player-btn"
          @click="addPlayer"
        >
          + Add another player
        </button>
      </div>

      <!-- Valid ID photo -->
      <div class="field-group">
        <label class="field-label" for="booker-id">Valid ID photo <span class="text-red-500">*</span></label>
        <label class="id-upload-zone" :class="{ 'id-upload-zone--has-file': store.idPhotoName }" for="booker-id">
          <div v-if="!store.idPhotoName" class="flex flex-col items-center gap-1.5">
            <span class="text-[26px]">🪪</span>
            <span class="text-[13.5px] font-semibold text-[var(--ink)]">Tap to upload your ID</span>
            <span class="text-[12px] text-[var(--ink-soft)]">Photo of any valid government ID</span>
          </div>
          <div v-else class="flex items-center gap-3">
            <span class="text-[22px]">✅</span>
            <div>
              <div class="text-[13.5px] font-semibold text-[var(--ink)]">ID uploaded</div>
              <div class="text-[12px] text-[var(--ink-soft)] truncate max-w-[180px]">{{ store.idPhotoName }}</div>
            </div>
            <button
              type="button"
              class="ml-auto text-[12px] font-semibold text-[var(--relish-dark)] underline"
              @click.prevent="clearId"
            >Change</button>
          </div>
        </label>
        <input
          id="booker-id"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="handleIdFile"
        />
        <p class="field-hint">Required. The gate checks this against your entry pass.</p>
      </div>
    </div>

    <BottomCTA
      label="Continue to payment"
      :disabled="!canProceed"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBookingStore, type PlayerEntry } from '~/stores/booking'
import HoldTimer from '~/components/ui/HoldTimer.vue'
import BottomCTA from '~/components/ui/BottomCTA.vue'

useHead({ title: 'Your details — PickleBook' })

const store = useBookingStore()

if (store.courtId === null && store.courtIds.length === 0) {
  navigateTo('/book/court')
}

// Ensure hold timer is running when user lands on details
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
/* ── Field groups ─────────────────────────────────────────── */
.field-group {
  margin-bottom: 18px;
}

.field-label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  background: var(--cream-card);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input::placeholder {
  color: rgba(34, 51, 24, 0.35);
}
.field-input:focus {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(34, 51, 24, 0.08);
}

.field-hint {
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.4;
}

/* ── Add player button ────────────────────────────────────── */
.add-player-btn {
  width: 100%;
  border: 1.5px dashed var(--line);
  border-radius: 12px;
  background: transparent;
  padding: 11px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  font-family: 'Inter', sans-serif;
}
.add-player-btn:hover {
  border-color: var(--ink);
  color: var(--ink);
  background: rgba(34, 51, 24, 0.04);
}

/* ── Remove player button ─────────────────────────────────── */
.remove-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  align-self: center;
  border-radius: 50%;
  border: 1.5px solid rgba(34, 51, 24, 0.2);
  background: transparent;
  font-size: 12px;
  color: var(--ink-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.remove-btn:hover {
  background: rgba(224, 144, 47, 0.1);
  border-color: var(--relish);
  color: var(--relish-dark);
}

/* ── ID upload zone ───────────────────────────────────────── */
.id-upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 90px;
  border: 2px dashed var(--line);
  border-radius: 14px;
  background: var(--cream-card);
  cursor: pointer;
  padding: 16px;
  transition: border-color 0.15s, background 0.15s;
}
.id-upload-zone:hover {
  border-color: var(--ink);
  background: rgba(34, 51, 24, 0.03);
}
.id-upload-zone--has-file {
  border-style: solid;
  border-color: var(--lime);
  background: var(--lime-soft);
}
</style>
