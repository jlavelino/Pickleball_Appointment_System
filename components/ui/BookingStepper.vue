<template>
  <div class="booking-stepper flex items-center justify-between w-full py-1">
    <div
      v-for="(step, idx) in steps"
      :key="step.num"
      class="flex items-center flex-1 last:flex-none"
    >
      <!-- Step Item -->
      <div class="flex flex-col items-center relative z-10">
        <!-- Circle indicator -->
        <div
          class="step-circle transition-all duration-200"
          :class="[
            step.num < currentStep
              ? 'step-circle--done'
              : step.num === currentStep
                ? 'step-circle--active'
                : 'step-circle--future'
          ]"
        >
          <span v-if="step.num < currentStep" class="mdi mdi-check text-[12px] leading-none"></span>
          <span v-else>{{ step.num }}</span>
        </div>

        <!-- Step label -->
        <span
          class="step-label transition-colors"
          :class="[
            step.num === currentStep
              ? 'step-label--active'
              : step.num < currentStep
                ? 'step-label--done'
                : 'step-label--future'
          ]"
        >
          {{ step.label }}
        </span>
      </div>

      <!-- Connector line -->
      <div
        v-if="idx < steps.length - 1"
        class="step-connector"
        :class="step.num < currentStep ? 'step-connector--done' : 'step-connector--future'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface StepItem {
  num: number
  label: string
}

withDefaults(
  defineProps<{
    currentStep?: number
    steps?: StepItem[]
  }>(),
  {
    currentStep: 1,
    steps: () => [
      { num: 1, label: 'Date' },
      { num: 2, label: 'Court' },
      { num: 3, label: 'Paddles' },
      { num: 4, label: 'Snacks' },
      { num: 5, label: 'Review' },
      { num: 6, label: 'Confirm' },
    ],
  }
)
</script>

<style scoped>
.booking-stepper {
  user-select: none;
}

/* ── Step circle ──────────────────────────────── */
.step-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  flex-shrink: 0;
}

.step-circle--done {
  background: #0B6623;
  color: #FFFFFF;
}

.step-circle--active {
  background: #14231C;
  color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(11, 102, 35, 0.22);
}

.step-circle--future {
  background: #E8F4D8;
  color: #66756D;
}

/* ── Step label ───────────────────────────────── */
.step-label {
  font-size: 8.5px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  margin-top: 3px;
  text-align: center;
  white-space: nowrap;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.step-label--active  { color: #14231C; }
.step-label--done    { color: #0B6623; }
.step-label--future  { color: #66756D; }

/* ── Connector line ───────────────────────────── */
.step-connector {
  flex: 1;
  height: 2px;
  margin: 0 4px;
  margin-top: -13px;
  border-radius: 2px;
  transition: background 0.2s ease;
}

.step-connector--done   { background: #0B6623; }
.step-connector--future { background: #DCE6D8; }
</style>
