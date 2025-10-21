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

      <!-- Loading States -->
      <div v-if="countriesLoading || keyCodesLoading" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg">
        <div class="flex items-center justify-center">
          <Icon name="eos-icons:three-dots-loading" class="h-7 w-7 text-blue-500 mr-4" />
          <span class="text-blue-800 font-semibold text-lg">Loading data...</span>
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
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.user_name"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Choose a username"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.phone"
                  type="tel"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Your phone number"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.password"
                  type="password"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
                />
              </div>

            <div class="space-y-4">
    <label class="block text-lg font-semibold text-gray-800">
      Key Code (Country) <span class="text-red-500">*</span>
    </label>
    <select
      v-model="employee.key_code_id"
      required
      :disabled="countriesLoading"
      class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Select a country for key code</option>
      <option 
        v-for="country in countries" 
        :key="country.id" 
        :value="country.id"
        class="flex items-center space-x-3 py-2"
      >
        <div class="flex items-center space-x-3">
          <img 
            v-if="country.image_url || country.flag || country.imageUrl" 
            :src="country.image_url || country.flag || country.imageUrl" 
            :alt="country.name"
            class="w-6 h-4 rounded object-cover"
            onerror="this.style.display='none'"
          />
          <span>{{ country.name }}</span>
        </div>
      </option>
    </select>
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
                </select>
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Country <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="employee.country_id"
                  required
                  :disabled="countriesLoading"
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a country</option>
                  <option 
                    v-for="country in countries" 
                    :key="country.id" 
                    :value="country.id"
                    class="flex items-center space-x-3 py-2"
                  >
                    <div class="flex items-center space-x-3">
                      <img 
                        v-if="country.imageUrl" 
                        :src="country.imageUrl" 
                        :alt="country.name"
                        class="w-6 h-4 rounded object-cover"
                      />
                      <span>{{ country.name }}</span>
                    </div>
                  </option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Postal Code <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="employee.post_nummer"
                  type="text"
                  required
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Your postal code"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Experience Certificate
                </label>
                <input
                  v-model="employee.experience_certificate"
                  type="text"
                  class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Experience certificate details"
                />
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-800">
                Skills <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="employee.skills"
                required
                rows="4"
                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Describe your skills and expertise..."
              ></textarea>
            </div>

            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-800">
                Professional Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="employee.description"
                required
                rows="6"
                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Describe your professional experience, qualifications, and career objectives in detail..."
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

          <!-- Favorite Work -->
          <div class="space-y-8">
            <div class="flex items-center justify-between pb-6 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="w-3 h-10 bg-yellow-500 rounded-full"></div>
                <h2 class="text-3xl font-bold text-gray-900">Preferred Jobs</h2>
              </div>
              <button
                type="button"
                @click="addFavoriteWork"
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                <Icon name="clarity:add-line" class="h-6 w-6 mr-3" />
                Add Job Preference
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div v-for="(work, index) in employee.favorite_work" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <select
                  v-model="employee.favorite_work[index]"
                  class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white appearance-none"
                >
                  <option value="">Select a job</option>
                  <option 
                    v-for="job in popularJobs" 
                    :key="job.id" 
                    :value="job.name"
                  >
                    {{ job.name }}
                  </option>
                </select>
                <button
                  v-if="employee.favorite_work.length > 1"
                  type="button"
                  @click="removeFavoriteWork(index)"
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
            
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <!-- CV Upload -->
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  CV/Resume <span class="text-red-500">*</span>
                </label>
                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group h-full">
                  <input
                    type="file"
                    @change="handleFileUpload($event, 'cv')"
                    accept=".pdf,.doc,.docx"
                    class="hidden"
                    id="cv-upload"
                  />
                  <label for="cv-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                    <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-red-500" />
                    </div>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Upload Your CV</p>
                    <p class="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                    <p v-if="employee.cv" class="text-green-600 font-semibold mt-3 text-sm">
                      ✓ {{ employee.cv.name }}
                    </p>
                  </label>
                </div>
              </div>

              <!-- Application Upload -->
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Application Document
                </label>
                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 cursor-pointer group h-full">
                  <input
                    type="file"
                    @change="handleFileUpload($event, 'application')"
                    accept=".pdf,.doc,.docx"
                    class="hidden"
                    id="application-upload"
                  />
                  <label for="application-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                    <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Icon name="mdi:file-document" class="h-8 w-8 text-green-500" />
                    </div>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Upload Application</p>
                    <p class="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                    <p v-if="employee.application" class="text-green-600 font-semibold mt-3 text-sm">
                      ✓ {{ employee.application.name }}
                    </p>
                  </label>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="space-y-4">
                <label class="block text-lg font-semibold text-gray-800">
                  Profile Photo
                </label>
                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group h-full">
                  <input
                    type="file"
                    @change="handleFileUpload($event, 'image')"
                    accept="image/*"
                    class="hidden"
                    id="image-upload"
                  />
                  <label for="image-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                    <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <Icon name="mdi:camera" class="h-8 w-8 text-blue-500" />
                    </div>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Upload Photo</p>
                    <p class="text-sm text-gray-500">JPG, PNG, WEBP (Max 5MB)</p>
                    <p v-if="employee.image" class="text-green-600 font-semibold mt-3 text-sm">
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
              :disabled="formLoading || countriesLoading || keyCodesLoading"
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
// استيراد الـ store
const settingStore = useSettingsStore();

// Employee data structure
const employee = reactive({
  name: '',
  email: '',
  address: '',
  description: '',
  nationality: '',
  city: '',
  country_id: '',
  type_job: 'part_time',
  languages: [''],
  cv: null as File | null,
  image: null as File | null,
  application: null as File | null,
  // الحقول الجديدة
  user_name: '',
  phone: '',
  post_nummer: '',
  experience_certificate: '',
  favorite_work: [''],
  password: '01062206359',
  // الحقول الناقصة
  skills: '',
  key_code_id: ''
});

const formLoading = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');
const countriesLoading = ref(false);
const keyCodesLoading = ref(false);

// قائمة الوظائف الشائعة حول العالم
const popularJobs = ref([
  { id: 1, name: 'Software Developer' },
  { id: 2, name: 'Data Scientist' },
  { id: 3, name: 'Project Manager' },
  { id: 4, name: 'Marketing Specialist' },
  { id: 5, name: 'Sales Representative' },
  { id: 6, name: 'Graphic Designer' },
  { id: 7, name: 'Accountant' },
  { id: 8, name: 'HR Manager' },
  { id: 9, name: 'Customer Service' },
  { id: 10, name: 'Teacher' },
  { id: 11, name: 'Nurse' },
  { id: 12, name: 'Doctor' },
  { id: 13, name: 'Engineer' },
  { id: 14, name: 'Architect' },
  { id: 15, name: 'Chef' },
  { id: 16, name: 'Electrician' },
  { id: 17, name: 'Plumber' },
  { id: 18, name: 'Mechanic' },
  { id: 19, name: 'Driver' },
  { id: 20, name: 'Security Guard' },
  { id: 21, name: 'Receptionist' },
  { id: 22, name: 'Administrative Assistant' },
  { id: 23, name: 'Financial Analyst' },
  { id: 24, name: 'Web Developer' },
  { id: 25, name: 'IT Support' },
  { id: 26, name: 'Content Writer' },
  { id: 27, name: 'Social Media Manager' },
  { id: 28, name: 'Photographer' },
  { id: 29, name: 'Videographer' },
  { id: 30, name: 'Translator' },
  { id: 31, name: 'Interpreter' },
  { id: 32, name: 'Lawyer' },
  { id: 33, name: 'Paralegal' },
  { id: 34, name: 'Real Estate Agent' },
  { id: 35, name: 'Insurance Agent' },
  { id: 36, name: 'Bank Teller' },
  { id: 37, name: 'Loan Officer' },
  { id: 38, name: 'Pharmacist' },
  { id: 39, name: 'Dental Hygienist' },
  { id: 40, name: 'Physical Therapist' },
  { id: 41, name: 'Occupational Therapist' },
  { id: 42, name: 'Veterinarian' },
  { id: 43, name: 'Zoologist' },
  { id: 44, name: 'Biologist' },
  { id: 45, name: 'Chemist' },
  { id: 46, name: 'Physicist' },
  { id: 47, name: 'Astronomer' },
  { id: 48, name: 'Geologist' },
  { id: 49, name: 'Meteorologist' },
  { id: 50, name: 'Environmental Scientist' }
]);

// computed للحصول على قائمة الدول
const countries = computed(() => settingStore.countries);

// قائمة Key Codes
const keyCodes = ref([]);

// جلب الدول و Key Codes عند تحميل الكومبوننت
onMounted(async () => {
  await loadCountries();
 
});

// دالة لجلب الدول
async function loadCountries() {
  countriesLoading.value = true;
  
  try {
    const success = await settingStore.fetchCountries();
    if (!success) {
      console.error('Failed to load countries');
    }
  } catch (err) {
    console.error('Error loading countries:', err);
  } finally {
    countriesLoading.value = false;
  }
}

// دالة لجلب Key Codes

// Language management
function addLanguage() {
  employee.languages.push('');
}

function removeLanguage(index: number) {
  if (employee.languages.length > 1) {
    employee.languages.splice(index, 1);
  }
}

// Favorite work management
function addFavoriteWork() {
  employee.favorite_work.push('');
}

function removeFavoriteWork(index: number) {
  if (employee.favorite_work.length > 1) {
    employee.favorite_work.splice(index, 1);
  }
}

// File upload handler
function handleFileUpload(event: Event, type: 'cv' | 'image' | 'application') {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (type === 'cv') {
      employee.cv = input.files[0];
    } else if (type === 'image') {
      employee.image = input.files[0];
    } else if (type === 'application') {
      employee.application = input.files[0];
    }
  }
}

// Form submission
async function submitEmployee() {
  formLoading.value = true;
  submitError.value = '';

  // التحقق من اختيار دولة
  if (!employee.country_id) {
    submitError.value = 'Please select a country';
    formLoading.value = false;
    return;
  }

  // التحقق من اختيار key code
if (!employee.key_code_id) {
    submitError.value = 'Please select a key code country';
    formLoading.value = false;
    return;
  }
  try {
    // أولاً: جهز CSRF token
    await useApiFetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include'
    });

    // ثانياً: جهز FormData
    const formData = new FormData();
    
    // البيانات الأساسية
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('address', employee.address);
    formData.append('description', employee.description);
    formData.append('nationality', employee.nationality);
    formData.append('city', employee.city);
    formData.append('country_id', employee.country_id);
    formData.append('type_job', employee.type_job);
    
    // الحقول الجديدة
    formData.append('user_name', employee.user_name);
    formData.append('phone', employee.phone);
    formData.append('post_nummer', employee.post_nummer);
    formData.append('experience_certificate', employee.experience_certificate || '');
    formData.append('password', employee.password);
    
    // الحقول الناقصة
    formData.append('skills', employee.skills);
    formData.append('key_code_id', employee.key_code_id); // هذا سيكون ID الدولة
    
    // المصفوفات
    employee.languages.forEach((lang, index) => {
      if (lang && lang.trim()) {
        formData.append(`languages[${index}]`, lang.trim());
      }
    });
    
    employee.favorite_work.forEach((work, index) => {
      if (work && work.trim()) {
        formData.append(`favorite_work[${index}]`, work.trim());
      }
    });
    
    // الملفات
    if (employee.cv) formData.append('cv', employee.cv);
    if (employee.image) formData.append('image', employee.image);
    if (employee.application) formData.append('application', employee.application);

    // ثالثاً: إرسال البيانات باستخدام $fetch مباشرة
    const response = await useApiFetch('/api/employee/store', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('✅ Success:', response);
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
        country_id: '',
        type_job: 'part_time',
        languages: [''],
        cv: null,
        image: null,
        application: null,
        user_name: '',
        phone: '',
        post_nummer: '',
        experience_certificate: '',
        favorite_work: [''],
        password: '01062206359',
        skills: '',
        key_code_id: ''
      });
      
      // إعادة تعيين حقول الملفات
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        (input as HTMLInputElement).value = '';
      });
      
      submitSuccess.value = false;
    }, 4000);

  } catch (err: any) {
    console.error('❌ Submission error:', err);
    submitError.value = err.data?.message || err.message || 'Something went wrong. Please try again.';
  } finally {
    formLoading.value = false;
  }
}
</script>