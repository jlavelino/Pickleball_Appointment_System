<template>
  <div class="hold-timer">
    <div class="hold-timer__dot"></div>
    <span class="hold-timer__text">
      Court held for
      <strong class="hold-timer__countdown">{{ formattedTime }}</strong>
      more
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seconds: number
}>()

const formattedTime = computed(() => {
  const m = Math.floor(props.seconds / 60)
  const s = props.seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
})
</script>

<style scoped>
.hold-timer {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FEF7EC;
  border: 1px solid #FDDEA0;
  border-radius: 14px;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.hold-timer__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D98216;
  flex-shrink: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.hold-timer__text {
  font-size: 13.5px;
  font-weight: 500;
  color: #14231C;
  font-family: 'Inter', sans-serif;
}

.hold-timer__countdown {
  color: #D98216;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
}
</style>
