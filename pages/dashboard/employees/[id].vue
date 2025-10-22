<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p class="text-gray-600 text-lg">Loading employee data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="errorMessage" class="text-center py-20">
                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:alert-circle-outline" class="h-10 w-10 text-red-500" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
                <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
                <button class="btn btn-primary px-6 py-3" @click="fetchEmployee">Try Again</button>
            </div>

            <!-- Success State -->
            <div v-else-if="employee" class="space-y-8">
                <!-- Header Section -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                        <div class="flex flex-col md:flex-row items-center justify-between">
                            <div class="flex items-center space-x-6 mb-6 md:mb-0">
                                <div class="relative">
                                    <img :src="getImageUrl(employee.image)" :alt="employee.name" class="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-gray-200" @error="handleImageError" />
                                    <div class="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                                        <Icon name="mdi:check" class="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 class="text-3xl font-bold">{{ employee.name }}</h1>
                                    <p class="text-blue-100 text-lg">{{ formatJobType(employee.type_job) }}</p>
                                    <div class="flex items-center space-x-2 mt-2">
                                        <Icon name="mdi:map-marker" class="h-5 w-5" />
                                        <span>{{ employee.city }}, {{ employee.country }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <p class="text-sm text-blue-100">Employee ID</p>
                                <p class="text-2xl font-bold">#{{ employee.id }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Info -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
                        <div class="text-center">
                            <Icon name="mdi:email" class="h-6 w-6 text-blue-500 mx-auto mb-2" />
                            <p class="text-sm text-gray-600">Email</p>
                            <p class="font-semibold text-gray-900 truncate">{{ employee.email }}</p>
                        </div>
                        <div class="text-center">
                            <Icon name="mdi:phone" class="h-6 w-6 text-green-500 mx-auto mb-2" />
                            <p class="text-sm text-gray-600">Phone</p>
                            <p class="font-semibold text-gray-900">{{ employee.phone || 'N/A' }}</p>
                        </div>
                        <div class="text-center">
                            <Icon name="mdi:account" class="h-6 w-6 text-purple-500 mx-auto mb-2" />
                            <p class="text-sm text-gray-600">Username</p>
                            <p class="font-semibold text-gray-900">{{ employee.user_name || 'N/A' }}</p>
                        </div>
                        <div class="text-center">
                            <Icon name="mdi:calendar" class="h-6 w-6 text-orange-500 mx-auto mb-2" />
                            <p class="text-sm text-gray-600">Joined</p>
                            <p class="font-semibold text-gray-900">{{ formatDate(employee.created_at) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Personal Information -->
                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">Personal Information</h2>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard icon="mdi:account-details" label="Full Name" :value="employee.name" color="blue" />
                                <InfoCard icon="mdi:email" label="Email" :value="employee.email" color="green" />
                                <InfoCard icon="mdi:phone" label="Phone" :value="employee.phone || 'N/A'" color="purple" />
                                <InfoCard icon="mdi:account" label="Username" :value="employee.user_name || 'N/A'" color="orange" />
                                <InfoCard icon="mdi:earth" label="Nationality" :value="employee.nationality" color="red" />
                                <InfoCard icon="mdi:city" label="City" :value="employee.city" color="indigo" />
                                <InfoCard icon="mdi:map-marker" label="Country" :value="employee.country" color="teal" />
                                <InfoCard icon="mdi:postage-stamp" label="Postal Code" :value="employee.post_nummer || 'N/A'" color="amber" />
                            </div>

                            <div class="mt-6">
                                <InfoCard icon="mdi:home" label="Complete Address" :value="employee.address" color="gray" full-width />
                            </div>
                        </div>

                        <!-- Professional Information -->
                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-2 h-8 bg-green-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">Professional Information</h2>
                            </div>

                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                                    <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" :class="getJobTypeClass(employee.type_job)">
                                        {{ formatJobType(employee.type_job) }}
                                    </div>
                                </div>

                                <div v-if="employee.skills">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                                    <p class="text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg border">
                                        {{ employee.skills }}
                                    </p>
                                </div>

                                <div v-if="employee.description">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Professional Description</label>
                                    <p class="text-gray-900 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg border">
                                        {{ employee.description }}
                                    </p>
                                </div>

                                <div v-if="employee.experience_certificate">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Experience Certificate</label>
                                    <p class="text-gray-900 bg-gray-50 p-4 rounded-lg border">
                                        {{ employee.experience_certificate }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-8">
                        <!-- Languages -->
                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-2 h-8 bg-purple-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">Languages</h2>
                            </div>

                            <div v-if="employee.languages && employee.languages.length > 0" class="flex flex-wrap gap-3">
                                <div v-for="(language, index) in employee.languages" :key="index" class="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    <Icon name="mdi:translate" class="h-4 w-4 mr-2" />
                                    {{ language }}
                                </div>
                            </div>
                            <p v-else class="text-gray-500 text-center py-4">No languages specified</p>
                        </div>

                        <!-- Preferred Jobs -->
                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-2 h-8 bg-yellow-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">Preferred Jobs</h2>
                            </div>

                            <div v-if="employee.favorite_work && employee.favorite_work.length > 0" class="space-y-3">
                                <div v-for="(work, index) in employee.favorite_work" :key="index" class="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <Icon name="mdi:briefcase-check" class="h-5 w-5 text-yellow-600" />
                                    <span class="text-yellow-800 font-medium">{{ work }}</span>
                                </div>
                            </div>
                            <p v-else class="text-gray-500 text-center py-4">No preferred jobs specified</p>
                        </div>

                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-8">
                                <div class="w-2 h-8 bg-red-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">المستندات والملفات</h2>
                            </div>

                            <div class="space-y-6">
                                <!-- صورة الملف الشخصي -->
                                <div
                                    v-if="employee.image"
                                    class="border-2 border-gray-200 rounded-2xl p-6 hover:border-red-300 transition-all duration-300 bg-gradient-to-r from-red-50 to-white hover:shadow-md cursor-pointer"
                                    @click="downloadFile(employee.image, 'profile-photo')"
                                >
                                    <div class="flex items-center space-x-4">
                                        <div class="relative">
                                            <img :src="getImageUrl(employee.image)" :alt="'صورة الملف الشخصي لـ ' + employee.name" class="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md" @error="handleImageError" />
                                            <div class="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-lg font-semibold text-gray-900 mb-1">صورة الملف الشخصي</h3>
                                            <p class="text-sm text-gray-600 truncate">{{ getFileName(employee.image) }}</p>
                                        </div>
                                        <div class="text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <!-- السيرة الذاتية -->
                                    <div
                                        v-if="employee.cv"
                                        class="border-2 mt-7 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 bg-gradient-to-r from-blue-50 to-white hover:shadow-md cursor-pointer"
                                        @click="downloadFile(employee.cv, 'cv-resume')"
                                    >
                                        <div class="flex items-center space-x-4">
                                            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h3 class="text-lg font-semibold text-gray-900 mb-1">السيرة الذاتية</h3>
                                                <p class="text-sm text-gray-600 truncate">{{ getFileName(employee.cv) }}</p>
                                            </div>
                                            <div class="text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- مستند التقديم -->
                                    <div
                                        v-if="employee.application"
                                        class="border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-all duration-300 bg-gradient-to-r from-green-50 to-white hover:shadow-md cursor-pointer"
                                        @click="downloadFile(employee.application, 'application')"
                                    >
                                        <div class="flex items-center space-x-4">
                                            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h3 class="text-lg font-semibold text-gray-900 mb-1">مستند التقديم</h3>
                                                <p class="text-sm text-gray-600 truncate">{{ getFileName(employee.application) }}</p>
                                            </div>
                                            <div class="text-green-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- رسالة عدم وجود مستندات -->
                                    <div v-if="!employee.cv && !employee.application && !employee.image" class="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                                        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <p class="text-lg font-medium text-gray-600">لا توجد مستندات متاحة</p>
                                        <p class="text-sm text-gray-500 mt-2">لم يقم هذا الموظف برفع أي مستندات حتى الآن.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Key Information -->
                        <div class="bg-white rounded-3xl shadow-xl p-8">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-2 h-8 bg-indigo-500 rounded-full"></div>
                                <h2 class="text-2xl font-bold text-gray-900">Key Information</h2>
                            </div>

                            <div class="space-y-4">
                                <InfoCard icon="mdi:key" label="Key Code" :value="employee.keyCode || 'N/A'" color="indigo" small />
                                <InfoCard icon="mdi:account-group" label="Account Type" :value="employee.type_login || 'Employee'" color="teal" small />
                                <InfoCard icon="mdi:calendar-check" label="Registration Date" :value="formatDate(employee.created_at)" color="amber" small />
                                <InfoCard icon="mdi:identifier" label="Employee ID" :value="'#' + employee.id" color="purple" small />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Types
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
    title: 'Employee Details',
});

interface Employee {
    id: number;
    type_login: string;
    name: string;
    email: string;
    phone: string | null;
    user_name: string | null;
    post_nummer: string | null;
    experience_certificate: string | null;
    address: string;
    skills: string | null;
    nationality: string;
    city: string;
    country: string;
    keyCode: string | null;
    type_job: string;
    languages: string[];
    favorite_work: string[];
    image: string | null;
    cv: string | null;
    application: string | null;
    created_at: string;
    description: string | null;
}

// Route
const route = useRoute();

// الحصول على الـ id مع Type safety
const employeeId = computed(() => {
    const id = route.params.id;
    return Array.isArray(id) ? id[0] : id;
});

// State
const employee = ref<Employee | null>(null);
const loading = ref(true);
const errorMessage = ref('');

// Helper functions
const formatJobType = (type: string): string => {
    const types: Record<string, string> = {
        full_time: 'Full Time',
        part_time: 'Part Time',
        contract: 'Contract',
        freelance: 'Freelance',
    };
    return types[type] || type;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getJobTypeClass = (type: string): string => {
    const classes: Record<string, string> = {
        full_time: 'bg-green-100 text-green-800',
        part_time: 'bg-blue-100 text-blue-800',
        contract: 'bg-orange-100 text-orange-800',
        freelance: 'bg-purple-100 text-purple-800',
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
};

// URL helper functions
const getImageUrl = (url: string | null): string => {
    if (!url) return '/default-avatar.png';
    return url.replace(/\\/g, '/');
};

const getDocumentUrl = (url: string | null): string => {
    if (!url) return '#';
    return url.replace(/\\/g, '/');
};

const getFileName = (url: string | null): string => {
    if (!url) return 'Unknown File';
    const cleanUrl = url.replace(/\\/g, '/');
    return cleanUrl.split('/').pop() || 'Unknown File';
};

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = '/default-avatar.png';
};

// File handling functions
const downloadFile = (url: string | null, fileName: string) => {
    if (!url) return;

    const cleanUrl = getDocumentUrl(url);
    const link = document.createElement('a');
    link.href = cleanUrl;
    link.download = fileName + '_' + getFileName(url);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const previewFile = (url: string | null) => {
    if (!url) return;

    const cleanUrl = getDocumentUrl(url);
    window.open(cleanUrl, '_blank');
};

// Fetch employee data
const fetchEmployee = async (): Promise<void> => {
    try {
        loading.value = true;
        errorMessage.value = '';

        console.log('Fetching employee with ID:', employeeId.value);

        const { data, error } = await useApiFetch(`/api/employee/${employeeId.value}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (error.value) {
            throw new Error(error.value.data?.message || 'Failed to load employee data');
        }

        if (data.value && data.value.data) {
            console.log('Employee data received:', data.value.data);
            employee.value = data.value.data as Employee;
        } else {
            throw new Error('No data received from server');
        }
    } catch (err: any) {
        console.error('Error fetching employee:', err);
        errorMessage.value = err.message || 'Failed to load employee data';
    } finally {
        loading.value = false;
    }
};

// Fetch on component mount
onMounted(() => {
    fetchEmployee();
});

// Watch for route changes
watch(
    () => route.params.id,
    () => {
        fetchEmployee();
    },
);
</script>

<!-- Components -->
<script lang="ts">
// Info Card Component
const InfoCard = defineComponent({
    props: {
        icon: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: 'blue',
        },
        fullWidth: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const colorClasses: Record<string, string> = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            purple: 'text-purple-600 bg-purple-100',
            orange: 'text-orange-600 bg-orange-100',
            red: 'text-red-600 bg-red-100',
            indigo: 'text-indigo-600 bg-indigo-100',
            teal: 'text-teal-600 bg-teal-100',
            amber: 'text-amber-600 bg-amber-100',
            gray: 'text-gray-600 bg-gray-100',
        };

        return { colorClasses };
    },
    template: `
    <div :class="['p-4 rounded-2xl border', props.fullWidth ? 'col-span-2' : '', props.small ? 'p-3' : 'p-4']">
      <div class="flex items-center space-x-3">
        <div :class="['p-2 rounded-lg', colorClasses[props.color] || colorClasses.gray]">
          <Icon :name="props.icon" class="h-4 w-4" />
        </div>
        <div :class="['flex-1', props.small ? 'min-w-0' : '']">
          <p :class="['font-semibold text-gray-900 truncate', props.small ? 'text-sm' : '']">{{ props.value }}</p>
          <p :class="['text-gray-500', props.small ? 'text-xs' : 'text-sm']">{{ props.label }}</p>
        </div>
      </div>
    </div>
  `,
});
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.whitespace-pre-line {
    white-space: pre-line;
}
</style>
