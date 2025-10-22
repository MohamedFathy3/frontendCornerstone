<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <div class="relative inline-block">
                    <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white">
                        <img 
                            v-if="employeeStore.employee?.image" 
                            :src="employeeStore.employee.image" 
                            :alt="employeeStore.fullName"
                            class="w-full h-full rounded-full object-cover"
                        />
                        <Icon v-else name="mdi:account" class="h-16 w-16 text-white" />
                    </div>
                    <div class="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                        <Icon name="mdi:check-circle" class="h-6 w-6 text-white" />
                    </div>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ employeeStore.fullName }}</h1>
                <p class="text-xl text-gray-600 mb-4">{{ employeeStore.jobType }} Employee</p>
                <div class="flex justify-center items-center space-x-6 text-gray-500">
                    <div class="flex items-center">
                        <Icon name="mdi:email" class="h-5 w-5 mr-2" />
                        <span>{{ employeeStore.employee?.email }}</span>
                    </div>
                    <div class="flex items-center">
                        <Icon name="mdi:phone" class="h-5 w-5 mr-2" />
                        <span>{{ employeeStore.employee?.phone }}</span>
                    </div>
                </div>
                <div class="flex justify-center space-x-4 mt-6">
                    <button
                        @click="toggleEditMode"
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon name="mdi:pencil" class="h-5 w-5 mr-2" />
                        {{ isEditMode ? 'Cancel Edit' : 'Edit Profile' }}
                    </button>
                    <button
                        @click="employeeStore.logout()"
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon name="mdi:logout" class="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p class="ml-4 text-gray-600">Loading profile data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="!employeeStore.employee && !loading" class="text-center py-12">
                <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                    <Icon name="mdi:alert-circle-outline" class="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-red-800 mb-2">Authentication Required</h3>
                    <p class="text-red-600 mb-4">Please log in to view your profile</p>
                    <NuxtLink 
                        to="/employee/login" 
                        class="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                        <Icon name="mdi:login" class="h-5 w-5 mr-2" />
                        Go to Login
                    </NuxtLink>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-else-if="isEditMode && employeeStore.employee" class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <form @submit.prevent="updateProfile" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:account" class="h-4 w-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                v-model="editForm.name"
                                type="text"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:email" class="h-4 w-4 inline mr-2" />
                                Email
                            </label>
                            <input
                                v-model="editForm.email"
                                type="email"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:phone" class="h-4 w-4 inline mr-2" />
                                Phone
                            </label>
                            <input
                                v-model="editForm.phone"
                                type="tel"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:card-account-details" class="h-4 w-4 inline mr-2" />
                                Username
                            </label>
                            <input
                                v-model="editForm.user_name"
                                type="text"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:map-marker" class="h-4 w-4 inline mr-2" />
                                Nationality
                            </label>
                            <input
                                v-model="editForm.nationality"
                                type="text"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:city" class="h-4 w-4 inline mr-2" />
                                City
                            </label>
                            <input
                                v-model="editForm.city"
                                type="text"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <Icon name="mdi:post" class="h-4 w-4 inline mr-2" />
                                Postal Code
                            </label>
                            <input
                                v-model="editForm.post_nummer"
                                type="text"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <!-- Address -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <textarea
                            v-model="editForm.address"
                            rows="3"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            required
                        ></textarea>
                    </div>

                    <!-- Skills -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                        <textarea
                            v-model="editForm.skills"
                            rows="4"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            required
                        ></textarea>
                    </div>

                    <!-- Experience Certificate -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Experience Certificate</label>
                        <input
                            v-model="editForm.experience_certificate"
                            type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            @click="toggleEditMode"
                            class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="updating"
                            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-300 flex items-center"
                        >
                            <Icon v-if="updating" name="eos-icons:three-dots-loading" class="h-5 w-5 mr-2" />
                            {{ updating ? 'Updating...' : 'Update Profile' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Main Content -->
            <div v-else-if="employeeStore.employee" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- باقي الـ template كما هو -->
                <!-- فقط استبدل employeeData بـ employeeStore.employee -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// استيراد الـ store
const employeeStore = useEmployeeStore();

// البيانات والمتغيرات
const loading = ref(true);
const isEditMode = ref(false);
const updating = ref(false);

// نموذج التعديل
const editForm = reactive({
    name: '',
    email: '',
    phone: '',
    user_name: '',
    nationality: '',
    city: '',
    post_nummer: '',
    address: '',
    skills: '',
    experience_certificate: ''
});

// دالة لجلب بيانات الموظف
async function fetchEmployeeData() {
    console.log('🚀 بدء جلب بيانات الموظف...');
    loading.value = true;
    
    try {
        await employeeStore.fetchAuthEmployee();
        
        if (employeeStore.employee) {
            // تعبئة نموذج التعديل
            Object.assign(editForm, {
                name: employeeStore.employee.name,
                email: employeeStore.employee.email,
                phone: employeeStore.employee.phone,
                user_name: employeeStore.employee.user_name,
                nationality: employeeStore.employee.nationality,
                city: employeeStore.employee.city,
                post_nummer: employeeStore.employee.post_nummer,
                address: employeeStore.employee.address,
                skills: employeeStore.employee.skills,
                experience_certificate: employeeStore.employee.experience_certificate
            });
            
            useToast({
                title: 'Success',
                message: 'Profile loaded successfully',
                type: 'success',
                duration: 3000,
            });
        } else {
            useToast({
                title: 'Error',
                message: 'Cannot fetch profile data',
                type: 'error',
                duration: 5000,
            });
        }

    } catch (err: any) {
        console.error('💥 خطأ غير متوقع:', err);
        useToast({
            title: 'Error',
            message: 'Failed to load profile data',
            type: 'error',
            duration: 5000,
        });
    } finally {
        loading.value = false;
    }
}

// دالة تحديث البروفايل
async function updateProfile() {
    updating.value = true;
    
    try {
        const result = await employeeStore.updateProfile(editForm);
        
        if (result.success) {
            useToast({
                title: 'Success',
                message: 'Profile updated successfully',
                type: 'success',
                duration: 5000,
            });
            isEditMode.value = false;
        } else {
            useToast({
                title: 'Error',
                message: 'Failed to update profile',
                type: 'error',
                duration: 5000,
            });
        }
    } catch (err: any) {
        console.error('💥 خطأ في التحديث:', err);
        useToast({
            title: 'Error',
            message: 'Failed to update profile',
            type: 'error',
            duration: 5000,
        });
    } finally {
        updating.value = false;
    }
}

// دالة تبديل وضع التعديل
function toggleEditMode() {
    isEditMode.value = !isEditMode.value;
}

// دالة لتنسيق التاريخ
function formatDate(dateString: string | undefined) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// جلب البيانات عند تحميل الصفحة
onMounted(() => {
    fetchEmployeeData();
});
</script>