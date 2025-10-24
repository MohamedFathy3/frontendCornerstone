<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <Icon name="mdi:office-building-plus" class="h-12 w-12 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Virksomhed</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Registrér din virksomhed og bliv en del af vores partnernetværk
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="submitSuccess"
        class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg"
      >
        <div class="flex items-center justify-center">
          <Icon
            name="clarity:success-standard-line"
            class="h-7 w-7 text-green-500 mr-4"
          />
          <span class="text-green-800 font-semibold text-lg">
            Virksomheden blev registreret med succes!
          </span>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="submitError"
        class="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl shadow-lg"
      >
        <div class="flex items-center justify-center">
          <Icon
            name="clarity:error-standard-line"
            class="h-7 w-7 text-red-500 mr-4"
          />
          <span class="text-red-800 font-semibold text-lg">{{ submitError }}</span>
        </div>
      </div>

      <!-- Registration Form -->
      <div
        class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
      >
        <form class="p-12 space-y-12" @submit.prevent="submitCompany">
          <!-- Company Information -->
          <div class="space-y-8">
            <div
              class="flex items-center space-x-4 pb-6 border-b border-gray-200"
            >
              <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">
                Virksomhedsoplysninger
              </h2>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Virksomhedsnavn <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="company.name"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Indtast virksomhedsnavn"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Ansvarlig persons navn <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="company.responsible_name"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Indtast ansvarlig persons navn"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  E-mailadresse <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="company.email"
                  type="email"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="virksomhed@example.com"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Telefonnummer <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="company.phone"
                  type="tel"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Indtast telefonnummer"
                />
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="space-y-8">
            <div
              class="flex items-center space-x-4 pb-6 border-b border-gray-200"
            >
              <div class="w-3 h-10 bg-green-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">
                Lokationsoplysninger
              </h2>
            </div>

            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-800">
                Kommentar <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="company.address"
                required
                rows="3"
                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Skriv din kommentar her"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-10 border-t border-gray-200">
            <button
              type="submit"
              :disabled="formLoading"
              class="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-2xl rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Icon
                v-if="formLoading"
                name="eos-icons:three-dots-loading"
                class="h-7 w-7 mr-4"
              />
              <span>
                {{ formLoading ? 'Behandler registrering...' : 'Registrér virksomhed' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Company data structure based on your API fields
const company = reactive({
    name: '',
    responsible_name: '',
    email: '',
    phone: '',
    country_id: '1',
    city: '',
    address: '',
    image: null as File | null,
});

const formLoading = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

// دالة لإعادة تعيين النموذج بالكامل
function resetForm() {
    Object.assign(company, {
        name: '',
        responsible_name: '',
        email: '',
        phone: '',
        country_id: '1',
        city: '',
        address: '',
        image: null,
    });
    submitError.value = '';
}

// File upload handler
function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        company.image = input.files[0];
    }
}

// دالة لتنظيف ومعالجة الأخطاء القادمة من الباكند
function handleBackendError(error: any): string {
    console.log('🔍 Backend error details:', error);
    
    if (!error) {
        return 'Ukendt fejl opstod. Prøv venligst igen.';
    }

    // إذا كان الخطأ فيه data (من useApiFetch)
    if (error.data) {
        const errorData = error.data;
        
        // Laravel validation errors
        if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
                return firstError[0];
            }
        }
        
        // Laravel error message
        if (errorData.message) {
            return errorData.message;
        }
        
        // General error
        if (errorData.error) {
            return errorData.error;
        }
    }
    
    // إذا كان الخطأ فيه message مباشرة
    if (error.message) {
        // تجنب عرض الأخطاء التقنية للمستخدم
        const technicalErrors = [
            'SQLSTATE',
            'connection',
            'database',
            'server',
            'timeout',
            'network'
        ];
        
        const lowerMessage = error.message.toLowerCase();
        if (technicalErrors.some(techError => lowerMessage.includes(techError))) {
            return 'Server fejl. Prøv venligst igen om et øjeblik.';
        }
        
        return error.message;
    }
    
    // خطأ افتراضي
    return 'Noget gik galt. Kontroller dine oplysninger og prøv igen.';
}

// دالة لعرض رسائل الخطأ بشكل مناسب للمستخدم
function showUserFriendlyError(error: any) {
    const userMessage = handleBackendError(error);
    submitError.value = userMessage;
    
    // ✅ إظهار toast error
    useToast({ 
        title: 'Fejl', 
        message: userMessage, 
        type: 'error', 
        duration: 5000 
    });
    
    // إخفاء الخطأ تلقائياً بعد 10 ثواني
    setTimeout(() => {
        submitError.value = '';
    }, 10000);
}

// Form submission - معدلة بالكامل
async function submitCompany() {
    // ✅ منع إرسال متعدد
    if (formLoading.value) {
        console.log('⏳ Form is already submitting, skipping...');
        return;
    }

    formLoading.value = true;
    submitError.value = '';

    try {
        console.log('🚀 Starting company registration...');
        console.log('📝 Form data:', { ...company });

        // ✅ إنشاء FormData جديد في كل مرة
        const formData = new FormData();

        // ✅ إضافة الحقول الأساسية
        formData.append('name', company.name.trim());
        formData.append('responsible_name', company.responsible_name.trim());
        formData.append('email', company.email.trim());
        formData.append('phone', company.phone.trim());
        formData.append('country_id', company.country_id);
        formData.append('city', company.city.trim());
        formData.append('address', company.address.trim());

        // ✅ إضافة الصورة إذا كانت موجودة
        if (company.image) {
            formData.append('image', company.image);
            console.log('🖼️ Image attached:', company.image.name);
        }

        // ✅ Debug: طباعة محتويات FormData
        console.log('📤 FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`   ${key}:`, value);
        }

        // ✅ إرسال البيانات مباشرة بدون CSRF token (لأن useApiFetch بتهتم بيها)
        const { data, error } = await useApiFetch('/api/company/store', {
            method: 'POST',
            body: formData,
        });

        console.log('📦 API Response - data:', data.value);
        console.log('❌ API Response - error:', error.value);

        if (error.value) {
            console.error('🚨 API Error:', error.value);
            throw error.value;
        }

        if (data.value) {
            console.log('✅ Company registered successfully:', data.value);
            
            // ✅ النجاح - إظهار رسالة النجاح
            submitSuccess.value = true;
            
            // ✅ إظهار toast success
            useToast({ 
                title: 'Succes', 
                message: 'Virksomheden blev registreret med succes!', 
                type: 'success', 
                duration: 5000 
            });
            
            // ✅ إعادة تعيين النموذج بالكامل
            resetForm();
            
            // ✅ إخفاء رسالة النجاح بعد 5 ثواني
            setTimeout(() => {
                submitSuccess.value = false;
            }, 5000);

        } else {
            throw new Error('Ingen data modtaget fra serveren');
        }

    } catch (err: any) {
        console.error('💥 Submission error:', err);
        
        // ✅ معالجة الخطأ وعرض رسالة مناسبة للمستخدم
        showUserFriendlyError(err);
        
    } finally {
        formLoading.value = false;
        console.log('🏁 Form submission completed');
    }
}

// ✅ منع إعادة إرسال النموذج بالخطأ
let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN = 3000; // 3 ثواني

// إضافة حماية إضافية
watch(formLoading, (newVal) => {
    if (newVal) {
        lastSubmissionTime = Date.now();
    }
});

// ✅ تأكد من إعادة تعيين النموذج عند ترك الصفحة
onBeforeUnmount(() => {
    resetForm();
});
</script>


<style scoped>
/* Enhanced animations */
input,
textarea,
select,
button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom focus styles with larger shadow */
input:focus,
textarea:focus,
select:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
    border-color: #3b82f6;
}

/* Enhanced hover effects */
button:hover:not(:disabled) {
    transform: translateY(-3px);
}

/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
    width: 8px;
}

textarea::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* File upload area enhancements */
input[type='file'] + label {
    transition: all 0.3s ease;
}

input[type='file'] + label:hover {
    transform: scale(1.02);
}

/* Loading state for form */
.form-loading {
    pointer-events: none;
    opacity: 0.7;
}
</style>