<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon name="mdi:account-plus" class="h-12 w-12 text-white" />
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Medarbejder Registrering</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Bliv en del af vores talentfulde team og start din professionelle rejse med os i dag</p>
            </div>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                <div class="flex items-center justify-center">
                    <Icon name="clarity:success-standard-line" class="h-7 w-7 text-green-500 mr-4" />
                    <span class="text-green-800 font-semibold text-lg">Medarbejder registreret succesfuldt!</span>
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
            <div v-if="countriesLoading" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg">
                <div class="flex items-center justify-center">
                    <Icon name="eos-icons:three-dots-loading" class="h-7 w-7 text-blue-500 mr-4" />
                    <span class="text-blue-800 font-semibold text-lg">Indlæser data...</span>
                </div>
            </div>

            <!-- Registration Form -->
            <div class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                <form class="p-12 space-y-12" @submit.prevent="submitEmployee">
                    <!-- Personal Information -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Personlige Oplysninger</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Fulde Navn <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast dit fulde navn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> E-mail Adresse <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.email"
                                    type="email"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="din.email@eksempel.dk"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Nøglekode (Land) <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="employee.key_code_id"
                                    required
                                    :disabled="countriesLoading"
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Vælg et land for nøglekode</option>
                                    <option v-for="country in countries" :key="country.id" :value="country.id" class="flex items-center space-x-3 py-2">
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
                                <label class="block text-lg font-semibold text-gray-800"> Telefonnummer <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.phone"
                                    type="tel"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Dit telefonnummer"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Nationalitet <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.nationality"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                    placeholder="Din nationalitet"
                                />
                            </div>

 <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Komplet Adresse <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="employee.address"
                                required
                                rows="1"
                                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                placeholder="Din komplette adresse"
                            ></textarea>
                        </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> By <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="employee.city"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                                >
                                    <option value="">Vælg en by</option>
                                    <option v-for="city in danishCities" :key="city" :value="city">
                                        {{ city }}
                                    </option>
                                </select>
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Postnummer <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="employee.post_nummer"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                                >
                                    <option value="">Vælg postnummer</option>
                                    <option v-for="postal in danishPostalCodes" :key="postal.code" :value="postal.code">
                                        {{ postal.code }} - {{ postal.city }}
                                    </option>
                                </select>
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Brugernavn <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.user_name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Vælg et brugernavn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Adgangskode <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="employee.password"
                                    type="password"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast din adgangskode"
                                />
                            </div>
                        </div>

                    
                    </div>

                    <!-- Job Information -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-green-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Joboplysninger</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Jobtype <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="employee.type_job"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                                >
                                    <option value="full_time">Fuldtid</option>
                                    <option value="part_time">Deltid</option>
                                </select>
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Erfaringsbevis </label>
                                <input
                                    v-model="employee.experience_certificate"
                                    type="text"
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Detaljer om erfaringsbevis"
                                />
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Færdigheder <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="employee.skills"
                                required
                                rows="4"
                                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                placeholder="Beskriv dine færdigheder og ekspertise..."
                            ></textarea>
                        </div>
                    </div>

                    <!-- Languages -->
                    <div class="space-y-8">
                        <div class="flex items-center justify-between pb-6 border-b border-gray-200">
                            <div class="flex items-center space-x-4">
                                <div class="w-3 h-10 bg-purple-500 rounded-full"></div>
                                <h2 class="text-3xl font-bold text-gray-900">Sprog</h2>
                            </div>
                            <button
                                type="button"
                                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                                @click="addLanguage"
                            >
                                <Icon name="clarity:add-line" class="h-6 w-6 mr-3" />
                                Tilføj Sprog
                            </button>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="(language, index) in employee.languages" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <select
                                    v-model="employee.languages[index]"
                                    class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white appearance-none"
                                >
                                    <option value="">Vælg et sprog</option>
                                    <option v-for="lang in languagesList" :key="lang" :value="lang">
                                        {{ lang }}
                                    </option>
                                </select>
                                <button v-if="employee.languages.length > 1" type="button" class="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300" @click="removeLanguage(index)">
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
                                <h2 class="text-3xl font-bold text-gray-900">Foretrukne Job</h2>
                            </div>
                            <button
                                type="button"
                                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                                @click="addFavoriteWork"
                            >
                                <Icon name="clarity:add-line" class="h-6 w-6 mr-3" />
                                Tilføj Jobpræference
                            </button>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="(work, index) in employee.favorite_work" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <select
                                    v-model="employee.favorite_work[index]"
                                    class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white appearance-none"
                                >
                                    <option value="">Vælg et job</option>
                                    <option v-for="job in danishJobs" :key="job" :value="job">
                                        {{ job }}
                                    </option>
                                </select>
                                <button
                                    v-if="employee.favorite_work.length > 1"
                                    type="button"
                                    class="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                                    @click="removeFavoriteWork(index)"
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
                            <h2 class="text-3xl font-bold text-gray-900">Dokumenter & Filer</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <!-- CV Upload -->
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> CV/Resume <span class="text-red-500">*</span> </label>
                                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group h-full">
                                    <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleFileUpload($event, 'cv')" />
                                    <label for="cv-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                                        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                                            <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-red-500" />
                                        </div>
                                        <p class="text-lg font-semibold text-gray-700 mb-2">Upload Dit CV</p>
                                        <p class="text-sm text-gray-500">PDF, DOC, DOCX (Maks 10MB)</p>
                                        <p v-if="employee.cv" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ employee.cv.name }}</p>
                                    </label>
                                </div>
                            </div>

                            <!-- Application Upload -->
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Ansøgningsdokument </label>
                                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 cursor-pointer group h-full">
                                    <input id="application-upload" type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleFileUpload($event, 'application')" />
                                    <label for="application-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                                        <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                            <Icon name="mdi:file-document" class="h-8 w-8 text-green-500" />
                                        </div>
                                        <p class="text-lg font-semibold text-gray-700 mb-2">Upload Ansøgning</p>
                                        <p class="text-sm text-gray-500">PDF, DOC, DOCX (Maks 10MB)</p>
                                        <p v-if="employee.application" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ employee.application.name }}</p>
                                    </label>
                                </div>
                            </div>

                            <!-- Image Upload -->
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Profilbillede </label>
                                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group h-full">
                                    <input id="image-upload" type="file" accept="image/*" class="hidden" @change="handleFileUpload($event, 'image')" />
                                    <label for="image-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                                        <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                            <Icon name="mdi:camera" class="h-8 w-8 text-blue-500" />
                                        </div>
                                        <p class="text-lg font-semibold text-gray-700 mb-2">Upload Billede</p>
                                        <p class="text-sm text-gray-500">JPG, PNG, WEBP (Maks 5MB)</p>
                                        <p v-if="employee.image" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ employee.image.name }}</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="pt-10 border-t border-gray-200">
                        <button
                            type="submit"
                            :disabled="formLoading || countriesLoading"
                            class="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-2xl rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            <Icon v-if="formLoading" name="eos-icons:three-dots-loading" class="h-7 w-7 mr-4" />
                            <span>{{ formLoading ? 'Behandler Registrering...' : 'Fuldfør Registrering' }}</span>
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
    country_id: '', // سيتم إرساله فارغاً ولكن لن يظهر في الـ UI
    type_job: 'part_time',
    languages: [''],
    cv: null as File | null,
    image: null as File | null,
    application: null as File | null,
    user_name: '',
    phone: '',
    post_nummer: '',
    experience_certificate: '',
    favorite_work: [''],
    password: '',
    skills: '',
    key_code_id: '',
});

const formLoading = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');
const countriesLoading = ref(false);

// مدن الدنمارك
const danishCities = ref([
    'København',
    'Aarhus',
    'Odense',
    'Aalborg',
    'Esbjerg',
    'Randers',
    'Kolding',
    'Horsens',
    'Vejle',
    'Roskilde',
    'Herning',
    'Hørsholm',
    'Helsingør',
    'Silkeborg',
    'Næstved',
    'Fredericia',
    'Viborg',
    'Køge',
    'Holstebro',
    'Taastrup'
]);

// الرموز البريدية الدنماركية
const danishPostalCodes = ref([
    { code: '1000', city: 'København K' },
    { code: '1050', city: 'København K' },
    { code: '1100', city: 'København K' },
    { code: '1200', city: 'København K' },
    { code: '1300', city: 'København K' },
    { code: '1400', city: 'København K' },
    { code: '1450', city: 'København K' },
    { code: '1500', city: 'København K' },
    { code: '1550', city: 'København K' },
    { code: '1600', city: 'København V' },
    { code: '1650', city: 'København V' },
    { code: '1700', city: 'København V' },
    { code: '1800', city: 'Frederiksberg C' },
    { code: '2000', city: 'Frederiksberg' },
    { code: '2100', city: 'København Ø' },
    { code: '2200', city: 'København N' },
    { code: '2300', city: 'København S' },
    { code: '2400', city: 'København NV' },
    { code: '2450', city: 'København SV' },
    { code: '2500', city: 'Valby' }
]);

// الوظائف الدنماركية
const danishJobs = ref([
    'Lagermedarbjder',
    'Rengøring',
    'Andet'
]);

// قائمة اللغات العالمية
const languagesList = ref([
    'Dansk',
    'English',
    'Svenska',
    'Norsk',
    'Deutsch',
    'Français',
    'Español',
    'Italiano',
    'Arabic',
    'Chinese',
    'Russian',
    'Polish',
    'Turkish',
    'Hindi',
    'Japanese',
    'Korean',
    'Portuguese',
    'Dutch',
    'Greek',
    'Hebrew'
]);

// computed للحصول على قائمة الدول
const countries = computed(() => settingStore.countries);

// جلب الدول عند تحميل الكومبوننت
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
// Form submission
async function submitEmployee() {
    formLoading.value = true;
    submitError.value = '';

    console.log('🚀 بدء عملية التسجيل...');

    // التحقق من اختيار key code
    if (!employee.key_code_id) {
        submitError.value = 'Vælg venligst et land for nøglekode';
        formLoading.value = false;
        return;
    }

    try {
        console.log('🔐 جلب CSRF token...');
        
        // أولاً: جهز CSRF token
        await useApiFetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
        });
        console.log('✅ CSRF token جلب بنجاح');

        // ثانياً: جهز FormData
        const formData = new FormData();

        // البيانات الأساسية
        formData.append('name', employee.name);
        formData.append('email', employee.email);
        formData.append('address', employee.address);
        formData.append('description', employee.description || '');
        formData.append('nationality', employee.nationality);
        formData.append('city', employee.city);
        formData.append('country_id', '');
        formData.append('type_job', employee.type_job);

        // الحقول الجديدة
        formData.append('user_name', employee.user_name);
        formData.append('phone', employee.phone);
        formData.append('post_nummer', employee.post_nummer);
        formData.append('experience_certificate', employee.experience_certificate || '');
        formData.append('password', employee.password || 'defaultPassword123');

        // الحقول الناقصة
        formData.append('skills', employee.skills);
        formData.append('key_code_id', employee.key_code_id);

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

        console.log('📤 البيانات المرسلة:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`   ${key}: [File] ${value.name}`);
            } else {
                console.log(`   ${key}: ${value}`);
            }
        }

        console.log('🌐 إرسال الطلب إلى API باستخدام useApiFetch...');

        // ثالثاً: إرسال البيانات باستخدام useApiFetch
        const { data, error } = await useApiFetch('/api/employee/store', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('📨 Response from useApiFetch:', {
            data: data.value,
            error: error.value
        });

        if (error.value) {
            console.error('❌ API Error:', error.value);
            
            // إذا كان الـ error فيه HTML
            if (error.value.data && typeof error.value.data === 'string' && error.value.data.includes('<!DOCTYPE html>')) {
                throw new Error('Serveren returnerede HTML i stedet for JSON. Tjek API endpoint.');
            }
            
            throw new Error(error.value.data?.message || error.value.message || 'API fejl');
        }

        if (data.value) {
            console.log('✅ API Success:', data.value);
            
            // ✅ النجاح - إظهار Toast
            useToast({
                title: 'Succes',
                message: 'Medarbejder registreret succesfuldt!',
                type: 'success',
                duration: 3000,
            });

            submitSuccess.value = true;

            // الانتقال إلى صفحة /auth بعد 2 ثانية
            setTimeout(() => {
                navigateTo('/auth');
            }, 2000);

        } else {
            throw new Error('Intet data modtaget fra serveren');
        }

    } catch (err: any) {
        console.error('💥 خطأ في التقديم:', err);
        
        let errorMessage = 'Noget gik galt. Prøv venligst igen.';
        
        if (err.message) {
            errorMessage = err.message;
        }

        // ❌ خطأ في الشبكة أو الخادم
        useToast({
            title: 'Fejl',
            message: errorMessage,
            type: 'error',
            duration: 5000,
        });
        
        submitError.value = errorMessage;
    } finally {
        formLoading.value = false;
    }
}
// دالة لإعادة تعيين النموذج
function resetForm() {
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
        password: '',
        skills: '',
        key_code_id: '',
    });

    // إعادة تعيين حقول الملفات
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
        (input as HTMLInputElement).value = '';
    });
}
</script>