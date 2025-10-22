<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon name="mdi:office-building-plus" class="h-12 w-12 text-white" />
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Company Registration</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Register your company and join our network of partners</p>
            </div>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
                <div class="flex items-center justify-center">
                    <Icon name="clarity:success-standard-line" class="h-7 w-7 text-green-500 mr-4" />
                    <span class="text-green-800 font-semibold text-lg">Company registered successfully!</span>
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
                <form class="p-12 space-y-12" @submit.prevent="submitCompany">
                    <!-- Company Information -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-blue-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Company Information</h2>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Company Name <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Responsible Person Name <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.responsible_name"
                                    type="text"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Enter responsible person name"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Email Address <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.email"
                                    type="email"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="company@example.com"
                                />
                            </div>

                            <div class="space-y-4">
                                <label class="block text-lg font-semibold text-gray-800"> Phone Number <span class="text-red-500">*</span> </label>
                                <input
                                    v-model="company.phone"
                                    type="tel"
                                    required
                                    class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Location Information -->
                    <div class="space-y-8">
                        <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                            <div class="w-3 h-10 bg-green-500 rounded-full"></div>
                            <h2 class="text-3xl font-bold text-gray-900">Location Information</h2>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-lg font-semibold text-gray-800"> Comment <span class="text-red-500">*</span> </label>
                            <textarea
                                v-model="company.address"
                                required
                                rows="3"
                                class="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none"
                                placeholder="Enter your comment"
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
                            <Icon v-if="formLoading" name="eos-icons:three-dots-loading" class="h-7 w-7 mr-4" />
                            <span>{{ formLoading ? 'Processing Registration...' : 'Register Company' }}</span>
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

// File upload handler
function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        company.image = input.files[0];
    }
}

// دالة لإعادة تعيين النموذج
function resetForm() {
    Object.assign(company, {
        name: '',
        responsible_name: '',
        email: '',
        phone: '',
        country_id: '',
        city: '',
        address: '',
        image: null,
    });
}

// Form submission
async function submitCompany() {
    formLoading.value = true;
    submitError.value = '';

    try {
        // أولاً: جهز CSRF token
        await useApiFetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
        });

        // ثانياً: جهز FormData
        const formData = new FormData();

        formData.append('name', company.name);
        formData.append('responsible_name', company.responsible_name);
        formData.append('email', company.email);
        formData.append('phone', company.phone);
        formData.append('country_id', company.country_id);
        formData.append('city', company.city);
        formData.append('address', company.address);

        if (company.image) formData.append('image', company.image);

        // ثالثاً: إرسال البيانات
        const { data, error } = await useApiFetch('/api/company/store', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (data.value) {
            // ✅ النجاح - إظهار Toast وإعادة تعيين النموذج
            useToast({
                title: 'Success',
                message: 'Company registered successfully!',
                type: 'success',
                duration: 5000,
            });

            submitSuccess.value = true;

            // إعادة تعيين النموذج بعد 3 ثواني
            setTimeout(() => {
                resetForm();
                submitSuccess.value = false;
            }, 3000);

        } else if (error.value) {
            // ❌ الخطأ - إظهار Toast بالخطأ
            useToast({
                title: 'Error',
                message: error.value.message || 'Failed to register company',
                type: 'error',
                duration: 5000,
            });
            
            submitError.value = error.value.message || 'Failed to register company';
        }

    } catch (err: any) {
        console.error('Submission error:', err);
        
        // ❌ خطأ في الشبكة أو الخادم
        useToast({
            title: 'Error',
            message: err.data?.message || err.message || 'Something went wrong. Please try again.',
            type: 'error',
            duration: 5000,
        });
        
        submitError.value = err.data?.message || err.message || 'Something went wrong. Please try again.';
    } finally {
        formLoading.value = false;
    }
}
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
</style>