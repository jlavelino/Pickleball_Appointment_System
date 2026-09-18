<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
    <!-- Modal Dialog -->
    <div class="w-full max-w-[440px] bg-[#14231C] rounded-[24px] sm:rounded-[28px] border border-[#243D2F] text-white shadow-2xl overflow-hidden flex flex-col max-h-[min(88vh,680px)] my-auto">
      <!-- Header -->
      <div class="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#243D2F] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#E8F4D8] text-[#0B6623] flex items-center justify-center shadow-xs shrink-0">
            <span class="mdi mdi-qrcode-scan text-[18px]"></span>
          </div>
          <div>
            <h3 class="font-display font-bold text-[16px] sm:text-[17px] text-white m-0 leading-tight">
              Scan Match Pass
            </h3>
            <p class="text-[11.5px] text-white/60 m-0 mt-0.5">Point camera at guest's booking QR pass</p>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          @click="close"
          aria-label="Close scanner"
        >
          <span class="mdi mdi-close text-[17px]"></span>
        </button>
      </div>

      <!-- Scanner Viewport Area -->
      <div class="relative bg-black flex-1 min-h-[220px] max-h-[300px] flex items-center justify-center overflow-hidden">
        <!-- Html5Qrcode video container -->
        <div id="admin-qr-reader" class="w-full h-full"></div>

        <!-- Scanning Overlay with Animated Laser -->
        <div v-if="cameraActive" class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="relative w-[200px] h-[200px]">
            <!-- Corner Brackets in Pickle Volt -->
            <div class="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-[#9ACD32] rounded-tl-lg"></div>
            <div class="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-[#9ACD32] rounded-tr-lg"></div>
            <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-[#9ACD32] rounded-bl-lg"></div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-[#9ACD32] rounded-br-lg"></div>

            <!-- Sweeping laser bar -->
            <div class="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-[#9ACD32] to-transparent shadow-[0_0_12px_#9ACD32] animate-scan-laser"></div>
          </div>
        </div>

        <!-- Camera Loading or Error State -->
        <div v-if="!cameraActive" class="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-black/90">
          <div v-if="cameraError" class="text-[#D94A4A] text-[12.5px] mb-2 max-w-[280px]">
            <span class="mdi mdi-camera-off text-[32px] block mb-1"></span>
            <span>{{ cameraError }}</span>
          </div>
          <div v-else class="text-white/80 text-[12.5px]">
            <div class="w-7 h-7 border-2.5 border-[#9ACD32] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Starting camera feed...</span>
          </div>
        </div>
      </div>

      <!-- Scanner Controls & Status Bar -->
      <div class="px-5 py-2.5 bg-[#0F1B15] border-t border-[#243D2F] flex items-center justify-between text-[11.5px] text-white/70 shrink-0">
        <div class="flex items-center gap-2">
          <button
            v-if="hasTorch"
            type="button"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            @click="toggleTorch"
          >
            <span class="mdi" :class="torchOn ? 'mdi-flashlight' : 'mdi-flashlight-off'"></span>
            <span>{{ torchOn ? 'Flashlight On' : 'Flashlight Off' }}</span>
          </button>
          <span v-else class="text-white/40 text-[11px] flex items-center gap-1">
            <span class="mdi mdi-camera-iris text-[13px]"></span>
            <span>Active Camera</span>
          </span>
        </div>

        <span class="text-[#9ACD32] text-[11.5px] font-bold flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#9ACD32] animate-pulse"></span>
          <span>Ready to scan</span>
        </span>
      </div>

      <!-- Manual Reference Code Input Fallback -->
      <div class="p-4 sm:p-5 bg-[#14231C] border-t border-[#243D2F] shrink-0">
        <div class="text-[10.5px] font-bold uppercase tracking-wider text-white/60 mb-2">
          Or Enter Reference Code Manually
        </div>
        <form class="flex gap-2" @submit.prevent="submitManualCode">
          <div class="relative flex-1">
            <input
              v-model="manualCode"
              type="text"
              placeholder="e.g. PB-20260915-..."
              class="w-full h-10 px-3.5 rounded-xl bg-[#0F1B15] border border-[#243D2F] text-white font-mono text-[12.5px] placeholder-white/40 focus:outline-none focus:border-[#9ACD32] transition-colors"
            />
          </div>
          <button
            type="submit"
            :disabled="!manualCode.trim()"
            class="h-10 px-4 rounded-xl bg-[#0B6623] hover:bg-[#08521C] text-white font-bold text-[12.5px] hover:opacity-95 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer whitespace-nowrap shadow-sm border border-[#237A3B]"
          >
            Locate Pass
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  'close': []
  'scanned': [reference: string]
}>()

const manualCode = ref('')
const cameraActive = ref(false)
const cameraError = ref<string | null>(null)
const hasTorch = ref(false)
const torchOn = ref(false)

let scannerInstance: any = null

onMounted(async () => {
  await startScanner()
})

onUnmounted(() => {
  stopScanner()
})

function close() {
  stopScanner()
  emit('close')
}

async function startScanner() {
  if (typeof window === 'undefined') return

  try {
    const { Html5Qrcode } = await import('html5-qrcode')
    scannerInstance = new Html5Qrcode('admin-qr-reader')

    const config = {
      fps: 10,
      qrbox: { width: 200, height: 200 },
      aspectRatio: 1.0,
    }

    await scannerInstance.start(
      { facingMode: 'environment' },
      config,
      (decodedText: string) => {
        handleDetected(decodedText)
      },
      () => {
        // scan failure/empty frames - normal
      }
    )

    cameraActive.value = true
    cameraError.value = null

    // Check torch capabilities
    try {
      const track = scannerInstance.getRunningTrackCameraCapabilities()
      if (track && track.torchFeature && track.torchFeature().isSupported()) {
        hasTorch.value = true
      }
    } catch {
      // Torch check fallback
    }
  } catch (err: any) {
    console.warn('QR camera start failed:', err)
    cameraError.value = err.message || 'Camera permission denied or camera unavailable.'
    cameraActive.value = false
  }
}

async function stopScanner() {
  if (scannerInstance && scannerInstance.isScanning) {
    try {
      await scannerInstance.stop()
      scannerInstance.clear()
    } catch (err) {
      console.warn('Scanner stop error:', err)
    }
    scannerInstance = null
    cameraActive.value = false
  }
}

async function toggleTorch() {
  if (!scannerInstance) return
  try {
    torchOn.value = !torchOn.value
    await scannerInstance.applyVideoConstraints({
      advanced: [{ torch: torchOn.value }],
    })
  } catch (err) {
    console.warn('Torch toggle error:', err)
  }
}

function handleDetected(rawText: string) {
  // Beep/haptic feedback
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(100)
  }

  // Extract reference (e.g. from PB-20260915-12345 or https://.../lookup?ref=PB-...)
  let cleanRef = rawText.trim()
  if (cleanRef.includes('ref=')) {
    const match = cleanRef.match(/ref=([^&]+)/i)
    if (match && match[1]) {
      cleanRef = match[1]
    }
  }

  stopScanner()
  emit('scanned', cleanRef)
}

function submitManualCode() {
  const code = manualCode.value.trim()
  if (code) {
    stopScanner()
    emit('scanned', code)
  }
}
</script>

<style scoped>
@keyframes scanLaser {
  0% { top: 8px; opacity: 0.8; }
  50% { top: 184px; opacity: 1; }
  100% { top: 8px; opacity: 0.8; }
}

.animate-scan-laser {
  animation: scanLaser 2s ease-in-out infinite;
}
</style>
