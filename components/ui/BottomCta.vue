<template>
  <footer class="bottom-cta">
    <!-- Soft gradient fade so content disappears cleanly above sticky bar -->
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
  position: sticky;
  bottom: 0;
  z-index: 20;
  pointer-events: none;
}

.bottom-cta__fade {
  height: 20px;
  background: linear-gradient(to bottom, transparent, #FAF9F1);
  pointer-events: none;
}

.bottom-cta__inner {
  background: #FAF9F1;
  padding: 4px 20px calc(18px + env(safe-area-inset-bottom, 0px));
  pointer-events: all;
}

/* ── Primary button (Forest green #0B6623, 18-20px radius, 54px height) ── */
.bottom-cta__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  border-radius: 18px;
  height: 54px;
  padding: 0 22px;
  font-family: 'Inter', sans-serif;
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease;
}

.bottom-cta__btn--primary {
  background: #0B6623;
  color: #FFFFFF;
  box-shadow: 0 4px 18px -4px rgba(11, 102, 35, 0.45);
}

.bottom-cta__btn--primary:hover:not(:disabled) {
  background: #08521C;
  box-shadow: 0 6px 22px -4px rgba(11, 102, 35, 0.55);
}

.bottom-cta__btn--primary:disabled {
  background: #D9DEDA;
  color: #8A938D;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 1;
}

.bottom-cta__btn--ghost {
  background: transparent;
  color: #0B6623;
  border: 1.5px solid #0B6623;
  box-shadow: none;
}

.bottom-cta__btn--ghost:hover:not(:disabled) {
  background: #E8F4D8;
}
</style>
