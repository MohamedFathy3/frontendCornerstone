<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Icon name="mdi:account-plus" class="h-12 w-12 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Employee Registration</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Join our talented team and start your professional journey with us today</p>
      </div>

      <!-- Success Message -->
      <div v-if="submitSuccess" class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
        <div class="flex items-center justify-center">
          <Icon name="clarity:success-standard-line" class="h-7 w-7 text-green-500 mr-4" />
          <span class="text-green-800 font-semibold text-lg">Employee registered successfully!</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl shadow-lg">
        <div class="flex items-center justify-center">
          <Icon name="clarity:error-standard-line" class="h-7 w-7 text-red-500 mr-4" />
          <span class="text-red-800 font-semibold text-lg">{{ submitError }}</span>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <form @submit.prevent="submitEmployee" class="p-12 space-y-12">
          
          <!-- Personal Information -->
          <div class="space-y-8">
            <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">Personal Information</h2>
            </div>
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.name"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.email"
                  type="email"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Nationality <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.nationality"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Your nationality"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  City <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.city"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Your city"
                />
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-800">
                Complete Address <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="employee.address"
                required
                rows="3"
                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Enter your complete address"
              ></textarea>
            </div>
          </div>

          <!-- Job Information -->
          <div class="space-y-8">
            <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <div class="w-3 h-10 bg-green-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">Job Information</h2>
            </div>
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Job Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="employee.type_job"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Country <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="employee.country_id"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="1">Egypt</option>
                  <option value="2">Saudi Arabia</option>
                  <option value="3">UAE</option>
                  <option value="4">Other</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-800">
                Skills & Professional Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="employee.description"
                required
                rows="6"
                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Describe your professional skills, experience, qualifications, and career objectives in detail..."
              ></textarea>
              <p class="text-sm text-gray-500 mt-3">Please provide detailed information about your professional background and expertise</p>
            </div>
          </div>

          <!-- Languages -->
          <div class="space-y-8">
            <div class="flex items-center justify-between pb-6 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="w-3 h-10 bg-purple-500 rounded-full"></div>
                <h2 class="text-3xl font-bold text-gray-900">Languages</h2>
              </div>
              <button
                type="button"
                @click="addLanguage"
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                <Icon name="clarity:add-line" class="h-6 w-6 mr-3" />
                Add Language
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div v-for="(language, index) in employee.languages" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <input
                  v-model="employee.languages[index]"
                  type="text"
                  class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                  placeholder="Language"
                />
                <button
                  v-if="employee.languages.length > 1"
                  type="button"
                  @click="removeLanguage(index)"
                  class="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  <Icon name="clarity:remove-line" class="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <!-- File Uploads -->
          <div class="space-y-8">
            <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <div class="w-3 h-10 bg-orange-500 rounded-full"></div>
              <h2 class="text-3xl font-bold text-gray-900">Documents & Files</h2>
            </div>
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <!-- CV Upload -->
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  CV/Resume <span class="text-red-500">*</span>
                </label>
                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                  <input
                    type="file"
                    @change="handleFileUpload($event, 'cv')"
                    accept=".pdf,.doc,.docx"
                    class="hidden"
                    id="cv-upload"
                  />
                  <label for="cv-upload" class="cursor-pointer">
                    <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                      <Icon name="mdi:file-pdf-box" class="h-10 w-10 text-red-500" />
                    </div>
                    <p class="text-xl font-semibold text-gray-700 mb-3">Upload Your CV</p>
                    <p class="text-base text-gray-500">PDF, DOC, DOCX files (Maximum 10MB)</p>
                    <p v-if="employee.cv" class="text-green-600 font-semibold mt-4 text-lg">
                      ✓ {{ employee.cv.name }}
                    </p>
                  </label>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Profile Photo
                </label>
                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                  <input
                    type="file"
                    @change="handleFileUpload($event, 'image')"
                    accept="image/*"
                    class="hidden"
                    id="image-upload"
                  />
                  <label for="image-upload" class="cursor-pointer">
                    <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                      <Icon name="mdi:camera" class="h-10 w-10 text-blue-500" />
                    </div>
                    <p class="text-xl font-semibold text-gray-700 mb-3">Upload Profile Photo</p>
                    <p class="text-base text-gray-500">JPG, PNG, WEBP (Maximum 5MB)</p>
                    <p v-if="employee.image" class="text-green-600 font-semibold mt-4 text-lg">
                      ✓ {{ employee.image.name }}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-10 border-t border-gray-200">
            <button
              type="submit"
              :disabled="formLoading"
              class="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-2xl rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Icon v-if="formLoading" name="eos-icons:three-dots-loading" class="h-7 w-7 mr-4" />
              <span>{{ formLoading ? 'Processing Registration...' : 'Complete Registration' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Employee data structure
const employee = reactive({
  name: '',
  email: '',
  address: '',
  description: '',
  nationality: '',
  city: '',
  country_id: '1',
  type_job: 'part_time',
  languages: [''],
  cv: null as File | null,
  image: null as File | null,
});

const formLoading = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

// Language management
function addLanguage() {
  employee.languages.push('');
}

function removeLanguage(index: number) {
  if (employee.languages.length > 1) {
    employee.languages.splice(index, 1);
  }
}

// File upload handler
function handleFileUpload(event: Event, type: 'cv' | 'image') {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (type === 'cv') {
      employee.cv = input.files[0];
    } else {
      employee.image = input.files[0];
    }
  }
}

// Form submission - بدون authentication
async function submitEmployee() {
  formLoading.value = true;
  submitError.value = '';

  try {
    const formData = new FormData();
    
    // Add all text fields
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('address', employee.address);
    formData.append('description', employee.description);
    formData.append('nationality', employee.nationality);
    formData.append('city', employee.city);
    formData.append('country_id', employee.country_id);
    formData.append('type_job', employee.type_job);
    
    // Add languages
    employee.languages.forEach((lang, index) => {
      if (lang.trim()) {
        formData.append(`languages[${index}]`, lang);
      }
    });
    
    // Add files
    if (employee.cv) formData.append('cv', employee.cv);
    if (employee.image) formData.append('image', employee.image);

    // استخدام fetch مباشرة بدون أي authentication
    const response = await fetch('https://job.professionalacademyedu.com/api/employee/store', {
      method: 'POST',
      body: formData
      // لا نضيف أي headers خالص
    });

    if (!response.ok) {
      // حاول تجيب الرسالة من ال response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // إذا مفيش JSON نستخدم status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Success
    submitSuccess.value = true;
    
    // Reset form
    setTimeout(() => {
      Object.assign(employee, {
        name: '',
        email: '',
        address: '',
        description: '',
        nationality: '',
        city: '',
        country_id: '1',
        type_job: 'part_time',
        languages: [''],
        cv: null,
        image: null,
      });
      submitSuccess.value = false;
    }, 4000);

  } catch (err: any) {
    console.error('Submission error:', err);
    submitError.value = err.message || 'Something went wrong. Please try again.';
  } finally {
    formLoading.value = false;
  }
}
</script>
<style scoped>
/* Enhanced animations */
input, textarea, select, button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom focus styles with larger shadow */
input:focus, textarea:focus, select:focus {
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
input[type="file"] + label {
  transition: all 0.3s ease;
}

input[type="file"] + label:hover {
  transform: scale(1.02);
}
</style>