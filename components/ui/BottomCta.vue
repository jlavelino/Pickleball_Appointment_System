<template>
  <footer class="p-[14px_22px_22px_22px]">
    <slot name="above" />
    <button
      type="button"
      :disabled="disabled"
      @click="$emit('click')"
      class="w-full rounded-[14px] p-[16px_18px] font-semibold text-base cursor-pointer btn-press border-none transition-all shadow-md"
      :class="[
        ghost
          ? 'bg-transparent border border-ink text-ink hover:bg-ink/5'
          : 'bg-orange text-white hover:bg-orange-dark disabled:opacity-40 disabled:cursor-not-allowed shadow-orange/20'
      ]"
    >
      {{ label }}
    </button>
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
