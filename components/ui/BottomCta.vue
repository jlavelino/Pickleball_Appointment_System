<template>
  <footer class="bottom-cta">
    <!-- soft fade so content visually "disappears" under the bar -->
    <div class="bottom-cta__fade" aria-hidden="true" />

    <div class="bottom-cta__inner">
      <slot name="above" />

      <button
        type="button"
        :disabled="disabled"
        @click="$emit('click')"
        class="bottom-cta__btn btn-press"
        :class="ghost ? 'bottom-cta__btn--ghost' : 'bottom-cta__btn--primary'"
      >
        <span>{{ label }}</span>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
  ghost?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.bottom-cta {
  /* Stick to bottom of the nearest positioned ancestor (app-shell) */
  position: sticky;
  bottom: 0;
  z-index: 20;
  /* No horizontal padding here — handled by __inner */
  pointer-events: none; /* let the fade be non-interactive */
}

.bottom-cta__fade {
  height: 32px;
  background: linear-gradient(to bottom, transparent, var(--cream));
  pointer-events: none;
}

.bottom-cta__inner {
  background: var(--cream);
  padding: 4px 22px 22px;
  pointer-events: all;
  border-top: 1px solid rgba(34, 51, 24, 0.08);
}

/* ── Primary button ── */
.bottom-cta__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 17px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease;
}

.bottom-cta__btn--primary {
  background: var(--ink);          /* #223318  — deep forest green, very legible */
  color: #F5F1DE;                  /* cream text — max contrast */
  box-shadow: 0 4px 18px -4px rgba(34, 51, 24, 0.45);
}

.bottom-cta__btn--primary:hover:not(:disabled) {
  background: #2e4a1a;             /* slightly lighter shade */
  box-shadow: 0 6px 22px -4px rgba(34, 51, 24, 0.55);
}

.bottom-cta__btn--primary:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  box-shadow: none;
}

.bottom-cta__btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 2px solid var(--ink);
  box-shadow: none;
}

.bottom-cta__btn--ghost:hover:not(:disabled) {
  background: rgba(34, 51, 24, 0.06);
}
</style>
