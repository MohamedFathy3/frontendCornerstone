<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Kort -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon name="mdi:account" class="h-10 w-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Medarbejder Login</h1>
          <p class="text-gray-600">Log ind på din konto</p>
        </div>

        <!-- Login Formular -->
        <form @submit.prevent="login" class="space-y-6">
          <!-- Brugernavn Felt -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <Icon name="mdi:account" class="h-4 w-4 inline mr-2 text-blue-500" />
              Brugernavn
            </label>
            <input
              v-model="loginForm.user_name"
              type="text"
              required
              :disabled="formLoading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Indtast dit brugernavn"
            />
          </div>

          <!-- Adgangskode Felt -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <Icon name="mdi:lock" class="h-4 w-4 inline mr-2 text-blue-500" />
              Adgangskode
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              :disabled="formLoading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Indtast din adgangskode"
            />
          </div>

          <!-- Login Knap -->
          <button
            type="submit"
            :disabled="formLoading"
            class="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <Icon 
              v-if="formLoading" 
              name="svg-spinners:3-dots-fade" 
              class="h-5 w-5 mr-2" 
            />
            <span>{{ formLoading ? 'Logger ind...' : 'Log ind' }}</span>
          </button>
        </form>

        <!-- Demo Legitimationsoplysninger -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Icon name="mdi:information" class="h-4 w-4 mr-2 text-blue-500" />
            Demo Legitimationsoplysninger
          </h3>
          <div class="text-xs text-gray-600 space-y-1">
            <p><span class="font-medium">Brugernavn:</span> demo_medarbejder</p>
            <p><span class="font-medium">Adgangskode:</span> kodeord123</p>
          </div>
        </div>

        <!-- Fejlmeddelelse -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <Icon name="mdi:alert-circle" class="h-5 w-5 text-red-500 mr-2" />
            <span class="text-red-700 text-sm">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-gray-600 text-sm">
          &copy; 2024 Medarbejder Portal. Alle rettigheder forbeholdes.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Formular tilstand
const loginForm = reactive({
  user_name: '',
  password: ''
})

// Indlæsning og fejl tilstand
const formLoading = ref(false)
const error = ref('')

// Tjek om brugeren allerede er logget ind
onMounted(async () => {
  const tokenCookie = useCookie('auth_token')
  
  if (tokenCookie.value) {
    await navigateTo('/employee/profile')
  }
})

// Login funktion
async function login() {
  // Nulstil fejl
  error.value = ''
  
  // Simpel feltvalidering
  if (!loginForm.user_name || !loginForm.password) {
    error.value = 'Udfyld venligst alle felter'
    return
  }

  formLoading.value = true

  try {
    console.log('🚀 Starter login proces...')

    // Brug useApiFetch direkte
    const { data, error: apiError } = await useApiFetch('/api/employee/login', {
      method: 'POST',
      body: loginForm
    })

    if (apiError.value) {
      throw new Error(apiError.value.data?.message || 'Login mislykkedes')
    }

    if (data.value) {
      console.log('✅ Login succesfuldt:', data.value)
      
      // Gem data i cookies - fra den korrekte placering!
      const tokenCookie = useCookie('auth_token', { 
        maxAge: 60 * 60 * 24 * 7 // 7 dage
      })
      const userCookie = useCookie('user_data', {
        maxAge: 60 * 60 * 24 * 7 // 7 dage
      })
      const userTypeCookie = useCookie('user_type', {
        maxAge: 60 * 60 * 24 * 7 // 7 dage
      })
      const employeeIdCookie = useCookie('employee_id', {
        maxAge: 60 * 60 * 24 * 7 // 7 dage
      })

      // Gem token - fra data.data.token
      tokenCookie.value = data.value.data.token
      
      // Gem brugerdata - fra data.data.user
      userCookie.value = data.value.data.user
      
      // Gem bruger type
      userTypeCookie.value = 'employee'
      
      // Gem ID - fra data.data.user.id
      employeeIdCookie.value = data.value.data.user.id

      console.log('📦 Data gemt i cookies:', {
        token: tokenCookie.value,
        user: userCookie.value,
        userType: userTypeCookie.value,
        employeeId: employeeIdCookie.value
      })

      // Succes besked
      useToast({
        title: 'Succes',
        message: 'Velkommen tilbage!',
        type: 'success',
        duration: 3000
      })

      // Naviger til profil - den korrekte sti
      await navigateTo('/profile')
    }

  } catch (err: any) {
    console.error('❌ Login fejl:', err)
    error.value = err.message || 'En uventet fejl opstod'
  } finally {
    formLoading.value = false
  }
}

// Tillad indtastning med Enter-tasten
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !formLoading.value) {
    login()
  }
}

// Tilføj event lytter for tastatur
onMounted(() => {
  document.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeyPress)
})
</script>