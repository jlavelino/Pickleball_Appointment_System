<template>
  <div v-if="isAdminRoute" class="min-h-screen font-sans text-[#14231C] bg-[#FAF9F1]">
    <NuxtPage />
  </div>
  <div v-else class="min-h-screen flex justify-center py-6 px-2 sm:px-4 font-sans text-[#14231C]">
    <div class="app-shell flex flex-col">
      <AppHeader />
      <main class="flex-1 px-5 pt-3 pb-0 overflow-y-auto no-scrollbar">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppHeader from '~/components/ui/AppHeader.vue'
import { useBookingStore } from '~/stores/booking'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

useHead({
  title: 'PickleBook — Premium Court Booking',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ],
})

const store = useBookingStore()
onMounted(() => {
  store.fetchCatalogs()
  store.fetchAvailability()
})
</script>
