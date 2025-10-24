<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon name="mdi:office-building-plus" class="h-12 w-12 text-white" />
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Virksomhed</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Registrer din virksomhed og tilslut dig vores netværk af partnere</p>
            </div>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                <div class="flex items-center justify-center">
                    <Icon name="clarity:success-standard-line" class="h-7 w-7 text-green-500 mr-4" />
                    <span class="text-green-800 font-semibold text-lg">Virksomhed registreret succesfuldt!</span>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl shadow-lg">
                <div class="flex items-center justify-center">
                    <Icon name="clarity:error-standard-line" class="h-7 w-7 text-red-500 mr-4" />
                    <span class="text-red-800 font-semibold text-lg">{{ submitError }}</span>
                </div>
            </div>

            <!-- Registreringsformular -->
            <div class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                <form class="p-12 space-y-12" @submit.prevent="submitCompany">
                    <!-- Virksomhedsoplysninger -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Virksomhedsoplysninger</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Virksomhedsnavn <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast virksomhedsnavn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Ansvarlig persons navn <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.responsible_name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast ansvarlig persons navn"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> E-mail-adresse <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.email"
                                    type="email"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="virksomhed@eksempel.dk"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Telefonnummer <span class="text-red-500">*</span> </label>
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

                    <!-- Beliggenhedsoplysninger -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-green-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Beliggenhedsoplysninger</h2>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Adresse <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="company.address"
                                required
                                rows="3"
                                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                placeholder="Indtast din adresse"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Land og by -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-purple-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Land og by</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Land <span class="text-red-500">*</span> </label>
                                <select
                                    v-model="company.country_id"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                >
                                    <option value="1">Danmark</option>
                                    <option value="2">Sverige</option>
                                    <option value="3">Norge</option>
                                </select>
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> By <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.city"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Indtast by"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Virksomhedslogo -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-orange-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Virksomhedslogo</h2>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800">Logo</label>
                            <div class="flex items-center space-x-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    @change="handleFileUpload"
                                    class="hidden"
                                    id="file-upload"
                                />
                                <label 
                                    for="file-upload"
                                    class="px-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors text-lg font-medium"
                                >
                                    Vælg fil
                                </label>
                                <span class="text-gray-600 text-lg" v-if="company.image">
                                    {{ company.image.name }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Send knap -->
                    <div class="pt-10 border-t border-gray-200">
                        <button
                            type="submit"
                            :disabled="formLoading"
                            class="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-2xl rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            <Icon v-if="formLoading" name="eos-icons:three-dots-loading" class="h-7 w-7 mr-4" />
                            <span>{{ formLoading ? 'Behandler registrering...' : 'Registrer virksomhed' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Virksomhedsdatastruktur baseret på dine API-felter
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

// Filupload-håndtering
function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        company.image = input.files[0];
    }
}

// Funktion til at nulstille formularen
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
    
    // Nulstil filinput hvis det findes
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
}

// Valideringsfunktion
function validerFormular() {
    const fejl = [];
    
    if (!company.name.trim()) fejl.push('Virksomhedsnavn er påkrævet');
    if (!company.email.trim() || !/\S+@\S+\.\S+/.test(company.email)) 
        fejl.push('Gyldig e-mail er påkrævet');
    if (!company.phone.trim()) fejl.push('Telefonnummer er påkrævet');
    if (!company.responsible_name.trim()) fejl.push('Ansvarlig persons navn er påkrævet');
    if (!company.address.trim()) fejl.push('Adresse er påkrævet');
    if (!company.city.trim()) fejl.push('By er påkrævet');
    
    return fejl;
}

// Formularindsendelse
async function submitCompany() {
    // Valider før indsendelse
    const valideringsFejl = validerFormular();
    if (valideringsFejl.length > 0) {
        submitError.value = valideringsFejl[0];
        return;
    }

    formLoading.value = true;
    submitError.value = '';

    try {
        // Forbered CSRF-token
        await useApiFetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
        });

        // Forbered FormData
        const formData = new FormData();

        formData.append('name', company.name);
        formData.append('responsible_name', company.responsible_name);
        formData.append('email', company.email);
        formData.append('phone', company.phone);
        formData.append('country_id', company.country_id);
        formData.append('city', company.city);
        formData.append('address', company.address);

        if (company.image) formData.append('image', company.image);

        // Send data
        const { data, error } = await useApiFetch('/api/company/store', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (data.value) {
            // ✅ Succes - vis toast og nulstil formular
            useToast({
                title: 'Succes',
                message: 'Virksomhed registreret succesfuldt!',
                type: 'success',
                duration: 5000,
            });

            submitSuccess.value = true;

            // Nulstil formular efter 3 sekunder
            setTimeout(() => {
                resetForm();
                submitSuccess.value = false;
            }, 3000);

        } else if (error.value) {
            // ❌ Fejl - vis toast med fejl
            useToast({
                title: 'Fejl',
                message: error.value.message || 'Kunne ikke registrere virksomhed',
                type: 'error',
                duration: 5000,
            });
            
            submitError.value = error.value.message || 'Kunne ikke registrere virksomhed';
        }

    } catch (err: any) {
        console.error('Indsendelsesfejl:', err);
        
        let fejlBesked = 'Noget gik galt. Prøv venligst igen.';
        
        if (err.data?.errors) {
            // Vis første fejl fra backend
            const førsteFejl = Object.values(err.data.errors)[0] as string[];
            fejlBesked = førsteFejl[0];
        } else if (err.data?.message) {
            fejlBesked = err.data.message;
        } else if (err.message) {
            fejlBesked = err.message;
        }
        
        useToast({
            title: 'Fejl',
            message: fejlBesked,
            type: 'error',
            duration: 5000,
        });
        
        submitError.value = fejlBesked;
    } finally {
        formLoading.value = false;
    }
}
</script>

<style scoped>
/* Forbedrede animationer */
input,
textarea,
select,
button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Brugerdefinerede fokus-stile med større skygge */
input:focus,
textarea:focus,
select:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
    border-color: #3b82f6;
}

/* Forbedrede hover-effekter */
button:hover:not(:disabled) {
    transform: translateY(-3px);
}

/* Brugerdefineret scrollbar til textareas */
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

/* Filupload-område forbedringer */
input[type='file'] + label {
    transition: all 0.3s ease;
}

input[type='file'] + label:hover {
    transform: scale(1.02);
}

/* Ryst-animation for fejl */
.ryst {
    animation: ryst 0.5s ease-in-out;
}

@keyframes ryst {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
</style>