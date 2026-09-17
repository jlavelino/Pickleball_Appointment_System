import { ref } from 'vue'

const isAuthenticated = ref<boolean>(false)

export function useAdminAuth() {
  const config = useRuntimeConfig()
  const defaultPin = (config.public?.adminPin as string) || '2026'

  function checkSession(): boolean {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('dink_admin_auth')
      if (stored === 'true') {
        isAuthenticated.value = true
        return true
      }
    }
    return false
  }

  function verifyPin(inputPin: string): boolean {
    if (inputPin.trim() === defaultPin) {
      isAuthenticated.value = true
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dink_admin_auth', 'true')
      }
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dink_admin_auth')
    }
  }

  return {
    isAuthenticated,
    checkSession,
    verifyPin,
    logout,
  }
}
