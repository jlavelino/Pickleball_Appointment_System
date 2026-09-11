import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

export function useHoldTimer(expiresAt: Ref<string | Date | null> | (() => string | Date | null)) {
  const secondsLeft = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  function getExpiresAt(): string | Date | null {
    return typeof expiresAt === 'function' ? expiresAt() : expiresAt.value
  }

  function update() {
    const target = getExpiresAt()
    if (!target) {
      secondsLeft.value = 0
      return
    }
    const diff = Math.floor((new Date(target).getTime() - Date.now()) / 1000)
    secondsLeft.value = Math.max(diff, 0)
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  const minutes = computed(() => Math.floor(secondsLeft.value / 60))
  const seconds = computed(() => secondsLeft.value % 60)
  const isExpired = computed(() => secondsLeft.value <= 0)
  const formatted = computed(() => `${minutes.value}:${String(seconds.value).padStart(2, '0')}`)

  return {
    secondsLeft,
    minutes,
    seconds,
    isExpired,
    formatted,
  }
}
