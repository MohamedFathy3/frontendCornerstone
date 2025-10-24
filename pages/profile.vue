<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="relative inline-block">
                    <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white">
                        <img 
                            v-if="employeeData?.image" 
                            :src="employeeData.image" 
                            :alt="employeeData.name"
                            :key="employeeData.image"
                            class="w-full h-full rounded-full object-cover"
                            @error="employeeData.image = null"
                        />
                        <Icon v-else name="mdi:account" class="h-16 w-16 text-white" />
                    </div>
                    <div class="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                        <Icon name="mdi:check-circle" class="h-6 w-6 text-white" />
                    </div>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ employeeData?.name || 'Indlæser...' }}</h1>
                <p class="text-xl text-gray-600 mb-4">{{ getJobTypeText(employeeData?.type_job) || 'Medarbejder' }}</p>
                <div class="flex justify-center items-center space-x-6 text-gray-500">
                    <div class="flex items-center">
                        <Icon name="mdi:email" class="h-5 w-5 mr-2" />
                        <span>{{ employeeData?.email || 'Indlæser...' }}</span>
                    </div>
                    <div class="flex items-center">
                        <Icon name="mdi:phone" class="h-5 w-5 mr-2" />
                        <span>{{ employeeData?.phone || 'Indlæser...' }}</span>
                    </div>
                </div>
                <div class="flex justify-center space-x-4 mt-6">
                    <button
                        @click="toggleEditMode"
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon name="mdi:pencil" class="h-5 w-5 mr-2" />
                        {{ isEditMode ? 'Annuller Redigering' : 'Rediger Profil' }}
                    </button>
                    <button
                        @click="logout"
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon name="mdi:logout" class="h-5 w-5 mr-2" />
                        Log Ud
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p class="ml-4 text-gray-600">Indlæser profildata...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                    <Icon name="mdi:alert-circle-outline" class="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-red-800 mb-2">Fejl ved indlæsning af profil</h3>
                    <p class="text-red-600 mb-4">{{ error }}</p>
                    <button 
                        @click="fetchEmployeeData"
                        class="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                        <Icon name="mdi:reload" class="h-5 w-5 mr-2" />
                        Prøv Igen
                    </button>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-else-if="isEditMode && employeeData" class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                <form class="p-12 space-y-12" @submit.prevent="updateProfile">
                    <!-- Personal Information -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Personlige Oplysninger</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <!-- جميع الحقول الشخصية هنا (نفس الكود السابق) -->
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Fulde Navn <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="editForm.name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast dit fulde navn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> E-mail Adresse <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="editForm.email"
                                    type="email"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="din.email@eksempel.dk"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Nøglekode (Land) <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="editForm.key_code_id"
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
                                    v-model="editForm.phone"
                                    type="tel"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Dit telefonnummer"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Nationalitet <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="editForm.nationality"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                    placeholder="Din nationalitet"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> By <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="editForm.city"
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
                                    v-model="editForm.post_nummer"
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
                                    v-model="editForm.user_name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Vælg et brugernavn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Adgangskode </label>
                                <input
                                    v-model="editForm.password"
                                    type="password"
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast ny adgangskode (valgfri)"
                                />
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Komplet Adresse <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="editForm.address"
                                required
                                rows="3"
                                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                placeholder="Din komplette adresse"
                            ></textarea>
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
                                    v-model="editForm.type_job"
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
                                    v-model="editForm.experience_certificate"
                                    type="text"
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Detaljer om erfaringsbevis"
                                />
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Færdigheder <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="editForm.skills"
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
                            <div v-for="(language, index) in editForm.languages" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <select
                                    v-model="editForm.languages[index]"
                                    class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white appearance-none"
                                >
                                    <option value="">Vælg et sprog</option>
                                    <option v-for="lang in languagesList" :key="lang" :value="lang">
                                        {{ lang }}
                                    </option>
                                </select>
                                <button v-if="editForm.languages.length > 1" type="button" class="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300" @click="removeLanguage(index)">
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
                            <div v-for="(work, index) in editForm.favorite_work" :key="index" class="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <select
                                    v-model="editForm.favorite_work[index]"
                                    class="flex-1 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white appearance-none"
                                >
                                    <option value="">Vælg et job</option>
                                    <option v-for="job in danishJobs" :key="job" :value="job">
                                        {{ job }}
                                    </option>
                                </select>
                                <button
                                    v-if="editForm.favorite_work.length > 1"
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
                                <label class="block text-lg font-semibold text-gray-800"> CV/Resume </label>
                                <div class="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group h-full">
                                    <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleFileUpload($event, 'cv')" />
                                    <label for="cv-upload" class="cursor-pointer flex flex-col items-center justify-center h-full">
                                        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                                            <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-red-500" />
                                        </div>
                                        <p class="text-lg font-semibold text-gray-700 mb-2">Upload Dit CV</p>
                                        <p class="text-sm text-gray-500">PDF, DOC, DOCX (Maks 10MB)</p>
                                        <p v-if="editForm.cv" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ editForm.cv.name }}</p>
                                        <p v-else-if="employeeData?.cv" class="text-blue-600 font-semibold mt-3 text-sm">📄 Eksisterende fil</p>
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
                                        <p v-if="editForm.application" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ editForm.application.name }}</p>
                                        <p v-else-if="employeeData?.application" class="text-blue-600 font-semibold mt-3 text-sm">📄 Eksisterende fil</p>
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
                                        <p v-if="editForm.image" class="text-green-600 font-semibold mt-3 text-sm">✓ {{ editForm.image.name }}</p>
                                        <p v-else-if="employeeData?.image" class="text-blue-600 font-semibold mt-3 text-sm">🖼️ Eksisterende billede</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="pt-10 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            type="button"
                            @click="toggleEditMode"
                            class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300"
                        >
                            Annuller
                        </button>
                        <button
                            type="submit"
                            :disabled="updating || countriesLoading"
                            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            <Icon v-if="updating" name="eos-icons:three-dots-loading" class="h-6 w-6 mr-3" />
                            <span>{{ updating ? 'Opdaterer Profil...' : 'Gem Ændringer' }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Profile Display -->
            <div v-else-if="employeeData" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column - Personal Info -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Personal Information Card -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Icon name="mdi:account-details" class="h-6 w-6 mr-3 text-blue-500" />
                            Personlige Oplysninger
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Fulde Navn</label>
                                <p class="text-lg text-gray-900">{{ employeeData.name }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">E-mail</label>
                                <p class="text-lg text-gray-900">{{ employeeData.email }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Telefon</label>
                                <p class="text-lg text-gray-900">{{ employeeData.phone }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Brugernavn</label>
                                <p class="text-lg text-gray-900">{{ employeeData.user_name }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Nationalitet</label>
                                <p class="text-lg text-gray-900">{{ employeeData.nationality }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">By</label>
                                <p class="text-lg text-gray-900">{{ employeeData.city }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Postnummer</label>
                                <p class="text-lg text-gray-900">{{ employeeData.post_nummer }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Land</label>
                                <p class="text-lg text-gray-900">{{ getCountryName(employeeData.key_code_id) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Address & Skills -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Address -->
                        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Icon name="mdi:map-marker" class="h-5 w-5 mr-2 text-green-500" />
                                Adresse
                            </h3>
                            <p class="text-gray-700">{{ employeeData.address }}</p>
                        </div>

                        <!-- Skills -->
                        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Icon name="mdi:tools" class="h-5 w-5 mr-2 text-purple-500" />
                                Færdigheder
                            </h3>
                            <p class="text-gray-700">{{ employeeData.skills }}</p>
                        </div>
                    </div>

                    <!-- Experience Certificate -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Icon name="mdi:certificate" class="h-5 w-5 mr-2 text-orange-500" />
                            Erfaringsbevis
                        </h3>
                        <p class="text-gray-700">{{ employeeData.experience_certificate || 'Ikke angivet' }}</p>
                    </div>
                </div>

                <!-- Right Column - Additional Info -->
                <div class="space-y-8">
                    <!-- Job Information -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Icon name="mdi:briefcase" class="h-5 w-5 mr-2 text-blue-500" />
                            Job Information
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-semibold text-gray-600">Job Type</label>
                                <p class="text-gray-900">{{ getJobTypeText(employeeData.type_job) }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600">Medlem Siden</label>
                                <p class="text-gray-900">{{ formatDate(employeeData.created_at) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Languages -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Icon name="mdi:translate" class="h-5 w-5 mr-2 text-green-500" />
                            Sprog
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span 
                                v-for="language in formattedLanguages" 
                                :key="language"
                                class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                            >
                                {{ language }}
                            </span>
                        </div>
                    </div>

                    <!-- Favorite Work -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Icon name="mdi:heart" class="h-5 w-5 mr-2 text-red-500" />
                            Foretrukne Job
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span 
                                v-for="work in formattedFavoriteWork" 
                                :key="work"
                                class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                            >
                                {{ work }}
                            </span>
                        </div>
                    </div>

                    <!-- Documents -->
                    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Icon name="mdi:file-document" class="h-5 w-5 mr-2 text-indigo-500" />
                            Dokumenter
                        </h3>
                        <div class="space-y-3">
                            <div v-if="employeeData.cv" class="flex items-center justify-between">
                                <span class="text-gray-700">CV/Resume</span>
                                <a :href="employeeData.cv" target="_blank" class="text-blue-500 hover:text-blue-700">
                                    <Icon name="mdi:download" class="h-5 w-5" />
                                </a>
                            </div>
                            <div v-if="employeeData.application" class="flex items-center justify-between">
                                <span class="text-gray-700">Ansøgning</span>
                                <a :href="employeeData.application" target="_blank" class="text-blue-500 hover:text-blue-700">
                                    <Icon name="mdi:download" class="h-5 w-5" />
                                </a>
                            </div>
                            <div v-if="!employeeData.cv && !employeeData.application">
                                <p class="text-gray-500 text-sm">Ingen dokumenter uploadet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// استيراد الـ store
const settingStore = useSettingsStore();

// البيانات والمتغيرات
const loading = ref(true)
const error = ref('')
const isEditMode = ref(false)
const updating = ref(false)
const countriesLoading = ref(false)
const employeeData = ref<any>(null)

// نموذج التعديل
const editForm = reactive({
    name: '',
    email: '',
    phone: '',
    user_name: '',
    nationality: '',
    city: '',
    post_nummer: '',
    key_code_id: '',
    address: '',
    skills: '',
    experience_certificate: '',
    type_job: 'part_time',
    languages: [''],
    favorite_work: [''],
    password: '',
    cv: null as File | null,
    image: null as File | null,
    application: null as File | null
})

// نفس البيانات من ملف التسجيل
const danishCities = ref([
    'København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde',
    'Herning', 'Hørsholm', 'Helsingør', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge', 'Holstebro', 'Taastrup'
]);

const danishPostalCodes = ref([
    { code: '1000', city: 'København K' }, { code: '1050', city: 'København K' }, { code: '1100', city: 'København K' },
    { code: '1200', city: 'København K' }, { code: '1300', city: 'København K' }, { code: '1400', city: 'København K' },
    { code: '1450', city: 'København K' }, { code: '1500', city: 'København K' }, { code: '1550', city: 'København K' },
    { code: '1600', city: 'København V' }, { code: '1650', city: 'København V' }, { code: '1700', city: 'København V' },
    { code: '1800', city: 'Frederiksberg C' }, { code: '2000', city: 'Frederiksberg' }, { code: '2100', city: 'København Ø' },
    { code: '2200', city: 'København N' }, { code: '2300', city: 'København S' }, { code: '2400', city: 'København NV' },
    { code: '2450', city: 'København SV' }, { code: '2500', city: 'Valby' }
]);

const danishJobs = ref([
    'Lagermedarbjder', 'Rengøring', 'Andet'
]);

const languagesList = ref([
    'Dansk', 'English', 'Svenska', 'Norsk', 'Deutsch', 'Français', 'Español', 'Italiano', 'Arabic', 'Chinese',
    'Russian', 'Polish', 'Turkish', 'Hindi', 'Japanese', 'Korean', 'Portuguese', 'Dutch', 'Greek', 'Hebrew'
]);

// computed للحصول على قائمة الدول
const countries = computed(() => settingStore.countries);

// computed للغات والعمل المفضل
const formattedLanguages = computed(() => {
    if (!employeeData.value?.languages) return []
    return Array.isArray(employeeData.value.languages) 
        ? employeeData.value.languages.filter((lang: string) => lang && lang.trim())
        : [employeeData.value.languages].filter((lang: string) => lang && lang.trim())
})

const formattedFavoriteWork = computed(() => {
    if (!employeeData.value?.favorite_work) return []
    return Array.isArray(employeeData.value.favorite_work) 
        ? employeeData.value.favorite_work.filter((work: string) => work && work.trim())
        : [employeeData.value.favorite_work].filter((work: string) => work && work.trim())
})

// دالة للحصول على اسم الدولة
function getCountryName(countryId: string) {
    const country = countries.value.find(c => c.id === countryId)
    return country?.name || 'Ikke angivet'
}

// دالة للحصول على نص نوع العمل
function getJobTypeText(type: string) {
    const types: { [key: string]: string } = {
        'full_time': 'Fuldtid',
        'part_time': 'Deltid'
    }
    return types[type] || type
}

// التحقق من المصادقة
function checkAuth() {
    const tokenCookie = useCookie('auth_token')
    const userTypeCookie = useCookie('user_type')
    const employeeIdCookie = useCookie('employee_id')
    
    console.log('🔐 Authentication check:')
    console.log('   Token:', tokenCookie.value ? 'Exists' : 'Missing')
    console.log('   User Type:', userTypeCookie.value)
    console.log('   Employee ID:', employeeIdCookie.value)
    
    if (!tokenCookie.value || userTypeCookie.value !== 'employee') {
        console.log('🚫 Not authenticated, redirecting to login...')
        navigateTo('/login')
        return false
    }
    
    return true
}

// جلب الدول
async function loadCountries() {
    countriesLoading.value = true;
    try {
        console.log('🌍 Loading countries...')
        const success = await settingStore.fetchCountries();
        console.log('🌍 Countries loaded:', success)
        if (!success) {
            console.error('❌ Failed to load countries');
        }
    } catch (err) {
        console.error('❌ Error loading countries:', err);
    } finally {
        countriesLoading.value = false;
    }
}

// دالة لجلب بيانات الموظف
async function fetchEmployeeData() {
    console.log('🚀 بدء جلب بيانات الموظف...')
    
    if (!checkAuth()) return
    
    loading.value = true
    error.value = ''
    
    try {
        const employeeIdCookie = useCookie('employee_id')
        const employeeId = employeeIdCookie.value
        
        if (!employeeId) {
            throw new Error('Employee ID not found in cookies')
        }

        console.log('📋 جلب بيانات الموظف بالـ ID:', employeeId)

        const { data, error: fetchError } = await useApiFetch(`/api/employee/${employeeId}`)
        
        console.log('📊 Fetch response - data:', data.value)
        console.log('📊 Fetch response - error:', fetchError.value)
        
        if (fetchError.value) {
            console.error('❌ Fetch error details:', fetchError.value.data)
            throw new Error(fetchError.value.data?.message || 'Failed to fetch employee data')
        }
        
        console.log('📦 API Response:', data.value)
        
        if (data.value) {
            employeeData.value = data.value.data
            console.log('👤 Employee data set:', employeeData.value)
            
            // تعبئة نموذج التعديل
            Object.assign(editForm, {
                name: employeeData.value.name || '',
                email: employeeData.value.email || '',
                phone: employeeData.value.phone || '',
                user_name: employeeData.value.user_name || '',
                nationality: employeeData.value.nationality || '',
                city: employeeData.value.city || '',
                post_nummer: employeeData.value.post_nummer || '',
                key_code_id: employeeData.value.key_code_id || '',
                address: employeeData.value.address || '',
                skills: employeeData.value.skills || '',
                experience_certificate: employeeData.value.experience_certificate || '',
                type_job: employeeData.value.type_job || 'part_time',
                languages: Array.isArray(employeeData.value.languages) 
                    ? [...employeeData.value.languages] 
                    : [employeeData.value.languages || ''],
                favorite_work: Array.isArray(employeeData.value.favorite_work) 
                    ? [...employeeData.value.favorite_work] 
                    : [employeeData.value.favorite_work || ''],
                password: ''
            })
            
            console.log('📝 Edit form filled:', editForm)
            console.log('✅ Employee data loaded successfully')
        } else {
            error.value = 'No data received from API'
            console.error('❌ No data received from API')
        }

    } catch (err: any) {
        console.error('💥 خطأ غير متوقع:', err)
        console.error('💥 Error stack:', err.stack)
        error.value = err.message || 'Failed to load profile data'
        
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
            console.log('🔐 Unauthorized, redirecting to auth...')
            navigateTo('/auth')
        }
    } finally {
        loading.value = false
        console.log('🏁 Fetch employee data completed')
    }
}

// دالة التحديث المحسنة
async function updateProfile() {
    console.log('🔄 Starting profile update...')
    
    if (!checkAuth()) return
    
    updating.value = true
    
    try {
        const employeeIdCookie = useCookie('employee_id')
        const employeeId = employeeIdCookie.value
        
        if (!employeeId) {
            throw new Error('Employee ID not found')
        }

        console.log('🆔 Updating profile for employee ID:', employeeId)

        // إعداد FormData
        const formData = new FormData()

        // البيانات الأساسية
        formData.append('name', editForm.name)
        formData.append('email', editForm.email)
        formData.append('phone', editForm.phone)
        formData.append('user_name', editForm.user_name)
        formData.append('nationality', editForm.nationality)
        formData.append('city', editForm.city)
        formData.append('post_nummer', editForm.post_nummer)
        formData.append('key_code_id', editForm.key_code_id)
        formData.append('address', editForm.address)
        formData.append('skills', editForm.skills)
        formData.append('experience_certificate', editForm.experience_certificate || '')
        formData.append('type_job', editForm.type_job)

        // كلمة المرور (اختياري)
        if (editForm.password) {
            formData.append('password', editForm.password)
        }

        // تنظيف اللغات من القيم الفارغة
        const cleanLanguages = editForm.languages.filter(lang => lang && lang.trim())
        cleanLanguages.forEach((lang, index) => {
            formData.append(`languages[${index}]`, lang.trim())
        })

        // تنظيف العمل المفضل من القيم الفارغة
        const cleanFavoriteWork = editForm.favorite_work.filter(work => work && work.trim())
        cleanFavoriteWork.forEach((work, index) => {
            formData.append(`favorite_work[${index}]`, work.trim())
        })

        // الملفات
        if (editForm.cv) formData.append('cv', editForm.cv)
        if (editForm.image) formData.append('image', editForm.image)
        if (editForm.application) formData.append('application', editForm.application)

        console.log('📤 البيانات المرسلة:')
        console.log('🔹 اللغات:', cleanLanguages)
        console.log('🔹 العمل المفضل:', cleanFavoriteWork)

        const { data, error } = await useApiFetch(`/api/employee/profile/update/${employeeId}`, {
            method: 'POST',
            body: formData,
        })

        console.log('📦 Update response data:', data.value)
        console.log('❌ Update error:', error.value)

        if (error.value) {
            console.error('🚨 API Error:', error.value)
            throw new Error(error.value.data?.message || error.value.message || 'Kunne ikke opdatere profil')
        }

        const responseData = data.value
        console.log('🔍 Response data analysis:', responseData)

        if (responseData && responseData.result === 'Success') {
            // تحديث فوري للـ UI
            if (employeeData.value && responseData.data) {
                // تحديث كل الحقول
                Object.assign(employeeData.value, responseData.data)
                
                // تحديث خاص للصورة
                if (responseData.data.image) {
                    employeeData.value.image = responseData.data.image + '?t=' + new Date().getTime()
                }
                
                // تحديث المصفوفات
                employeeData.value.languages = cleanLanguages
                employeeData.value.favorite_work = cleanFavoriteWork
            }

            // إظهار نجاح
            useToast({
                title: 'Succes',
                message: responseData.message || 'Profil opdateret succesfuldt!',
                type: 'success',
                duration: 3000,
            })

            // إغلاق وضع التعديل فوراً
            isEditMode.value = false
            
            // إعادة تحميل البيانات بعد ثانية علشان الملفات
            setTimeout(() => {
                fetchEmployeeData()
            }, 1500)
            
        } else {
            throw new Error(responseData?.message || 'Uventet svar fra serveren')
        }

    } catch (err: any) {
        console.error('💥 خطأ في التحديث:', err)
        useToast({
            title: 'Fejl',
            message: err.message || 'Noget gik galt. Prøv venligst igen.',
            type: 'error',
            duration: 5000,
        })
    } finally {
        updating.value = false
    }
}

// إدارة اللغات
function addLanguage() {
    console.log('➕ Adding new language field')
    editForm.languages.push('')
    console.log('🗣️ Languages array:', editForm.languages)
}

function removeLanguage(index: number) {
    console.log('➖ Removing language at index:', index)
    if (editForm.languages.length > 1) {
        editForm.languages.splice(index, 1)
        console.log('🗣️ Updated languages array:', editForm.languages)
    }
}

// إدارة العمل المفضل
function addFavoriteWork() {
    console.log('➕ Adding new favorite work field')
    editForm.favorite_work.push('')
    console.log('💼 Favorite work array:', editForm.favorite_work)
}

function removeFavoriteWork(index: number) {
    console.log('➖ Removing favorite work at index:', index)
    if (editForm.favorite_work.length > 1) {
        editForm.favorite_work.splice(index, 1)
        console.log('💼 Updated favorite work array:', editForm.favorite_work)
    }
}

// رفع الملفات - معدلة
function handleFileUpload(event: Event, type: 'cv' | 'image' | 'application') {
    console.log(`📁 Handling file upload for: ${type}`)
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        const file = input.files[0]
        console.log(`📄 File selected:`, file.name, `Size:`, file.size, `Type:`, file.type)
        
        if (type === 'cv') {
            editForm.cv = file
            console.log('📄 CV file set:', editForm.cv)
        } else if (type === 'image') {
            editForm.image = file
            
            // معاينة الصورة فوراً قبل الرفع
            const reader = new FileReader()
            reader.onload = (e) => {
                if (employeeData.value && e.target?.result) {
                    employeeData.value.image = e.target.result as string
                    console.log('🖼️ Image preview updated instantly')
                }
            }
            reader.readAsDataURL(file)
            
            console.log('🖼️ Image file set:', editForm.image)
        } else if (type === 'application') {
            editForm.application = file
            console.log('📑 Application file set:', editForm.application)
        }
    } else {
        console.log('❌ No file selected')
    }
}

// دالة تسجيل الخروج
function logout() {
    console.log('🚪 Logging out...')
    const tokenCookie = useCookie('auth_token')
    const userCookie = useCookie('user_data')
    const userTypeCookie = useCookie('user_type')
    const employeeIdCookie = useCookie('employee_id')

    // مسح الكوكيز
    tokenCookie.value = null
    userCookie.value = null
    userTypeCookie.value = null
    employeeIdCookie.value = null

    console.log('🍪 Cookies cleared, redirecting to login...')
    
    // الانتقال لصفحة login
    navigateTo('/login')
}

// دالة تبديل وضع التعديل
function toggleEditMode() {
    console.log('🔄 Toggling edit mode. Current:', isEditMode.value)
    isEditMode.value = !isEditMode.value
    
    if (isEditMode.value && employeeData.value) {
        console.log('📝 Entering edit mode, filling form...')
        
        // تعبئة المصفوفات بشكل صحيح
        const currentLanguages = Array.isArray(employeeData.value.languages) 
            ? employeeData.value.languages.filter((lang: string) => lang && lang.trim())
            : employeeData.value.languages 
                ? [employeeData.value.languages].filter((lang: string) => lang && lang.trim())
                : ['']

        const currentFavoriteWork = Array.isArray(employeeData.value.favorite_work) 
            ? employeeData.value.favorite_work.filter((work: string) => work && work.trim())
            : employeeData.value.favorite_work 
                ? [employeeData.value.favorite_work].filter((work: string) => work && work.trim())
                : ['']

        // تعبئة النموذج بالبيانات الحالية
        Object.assign(editForm, {
            name: employeeData.value.name || '',
            email: employeeData.value.email || '',
            phone: employeeData.value.phone || '',
            user_name: employeeData.value.user_name || '',
            nationality: employeeData.value.nationality || '',
            city: employeeData.value.city || '',
            post_nummer: employeeData.value.post_nummer || '',
            key_code_id: employeeData.value.key_code_id || '',
            address: employeeData.value.address || '',
            skills: employeeData.value.skills || '',
            experience_certificate: employeeData.value.experience_certificate || '',
            type_job: employeeData.value.type_job || 'part_time',
            languages: currentLanguages.length > 0 ? [...currentLanguages] : [''],
            favorite_work: currentFavoriteWork.length > 0 ? [...currentFavoriteWork] : [''],
            password: ''
        })
        
        console.log('📝 Edit form filled with current data:', editForm)
        console.log('🗣️ Languages in form:', editForm.languages)
        console.log('💼 Favorite work in form:', editForm.favorite_work)
    } else {
        console.log('👀 Exiting edit mode, showing profile view')
    }
}

// دالة لتنسيق التاريخ
function formatDate(dateString: string | undefined) {
    if (!dateString) return 'Ikke angivet'
    return new Date(dateString).toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// جلب البيانات عند تحميل الصفحة
onMounted(async () => {
    console.log('🏁 Component mounted, starting initialization...')
    await loadCountries()
    await fetchEmployeeData()
    console.log('🎉 Component initialization completed')
})
</script>