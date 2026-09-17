<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
    <!-- Modal Dialog -->
    <div class="w-full max-w-[440px] bg-[#1E3314] rounded-[26px] border border-[#38591A] text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="p-4 px-5 border-b border-[#2E4F1E] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-lime text-ink flex items-center justify-center">
            <span class="mdi mdi-qrcode-scan text-[18px]"></span>
          </div>
          <div>
            <h3 class="font-display font-bold text-[16px] text-white m-0 leading-tight">
              Scan Match Pass
            </h3>
            <p class="text-[11.5px] text-white/60 m-0">Point camera at guest's QR code</p>
          </div>
        </div>

        <button
          type="button"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          @click="close"
        >
          <span class="mdi mdi-close text-[18px]"></span>
        </button>
      </div>

      <!-- Scanner Viewport Area -->
      <div class="relative bg-black flex-1 min-h-[300px] flex items-center justify-center overflow-hidden">
        <!-- Html5Qrcode video container -->
        <div id="admin-qr-reader" class="w-full h-full"></div>

        <!-- Scanning Overlay with Animated Laser -->
        <div v-if="cameraActive" class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="relative w-[230px] h-[230px]">
            <!-- Corner Brackets -->
            <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-lime rounded-tl-lg"></div>
            <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-lime rounded-tr-lg"></div>
            <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-lime rounded-bl-lg"></div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-lime rounded-br-lg"></div>

            <!-- Sweeping laser bar -->
            <div class="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_12px_#96C33E] animate-scan-laser"></div>
          </div>
        </div>

        <!-- Camera Loading or Error State -->
        <div v-if="!cameraActive" class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/90">
          <div v-if="cameraError" class="text-red-400 text-[13px] mb-3 max-w-[280px]">
            <span class="mdi mdi-camera-off text-[36px] block mb-1"></span>
            {{ cameraError }}
          </div>
          <div v-else class="text-white/80 text-[13px]">
            <div class="w-8 h-8 border-3 border-lime border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
            Starting camera feed...
          </div>
        </div>
      </div>

      <!-- Scanner Controls & Torch -->
      <div v-if="cameraActive" class="px-5 py-2.5 bg-[#172710] border-t border-[#263D18] flex items-center justify-between text-[12px] text-white/70">
        <button
          v-if="hasTorch"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          @click="toggleTorch"
        >
          <span class="mdi" :class="torchOn ? 'mdi-flashlight' : 'mdi-flashlight-off'"></span>
          <span>{{ torchOn ? 'Torch On' : 'Torch Off' }}</span>
        </button>

        <span class="text-lime text-[11px] font-medium flex items-center gap-1 ml-auto">
          <span class="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
          Ready to scan
        </span>
      </div>

      <!-- Manual Reference Code Input Fallback -->
      <div class="p-4 bg-[#1E3314] border-t border-[#2E4F1E]">
        <div class="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
          Or Enter Reference Code Manually
        </div>
        <form class="flex gap-2" @submit.prevent="submitManualCode">
          <div class="relative flex-1">
            <input
              v-model="manualCode"
              type="text"
              placeholder="e.g. PB-20260915-..."
              class="w-full h-10 px-3.5 rounded-xl bg-black/30 border border-white/20 text-white font-mono text-[13px] placeholder-white/40 focus:outline-none focus:border-lime"
            />
          </div>
          <button
            type="submit"
            :disabled="!manualCode.trim()"
            class="h-10 px-4 rounded-xl bg-lime text-ink font-bold text-[12.5px] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer whitespace-nowrap shadow-xs"
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
      qrbox: { width: 220, height: 220 },
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
  0% { top: 10px; opacity: 0.8; }
  50% { top: 210px; opacity: 1; }
  100% { top: 10px; opacity: 0.8; }
}

.animate-scan-laser {
  animation: scanLaser 2s ease-in-out infinite;
}
</style>
