<template>
    <div class="flex flex-col gap-5">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Employees Management</div>
            <div class="text-sm text-gray-500">Total: {{ allEmployees.length }} employees</div>
        </div>

        <!-- Advanced Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <button class="btn btn-sm btn-outline-secondary" @click="resetSearch">
                    <Icon name="solar:restart-linear" class="w-4 h-4 mr-2" />
                    Reset All
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <!-- Search - تم تحديث النص التوضيحي -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input 
                        v-model="filters.search" 
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Name, email, phone, skills..." 
                    />
                </div>

                <!-- Country -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select v-model="filters.country_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Countries</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                        </option>
                    </select>
                </div>

                <!-- Job Type -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select v-model="filters.type_job" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Types</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                    </select>
                </div>

                <!-- Nationality -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                    <input v-model="filters.nationality" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nationality" />
                </div>

                <!-- Skills -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <input v-model="filters.skills" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Specific skills" />
                </div>

                <!-- Language -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select v-model="filters.language" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Languages</option>
                        <option v-for="lang in languagesList" :key="lang" :value="lang">
                            {{ lang }}
                        </option>
                    </select>
                </div>

                <!-- Preferred Job -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Job</label>
                    <select v-model="filters.favorite_work" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Jobs</option>
                        <option v-for="job in popularJobs" :key="job.id" :value="job.name">
                            {{ job.name }}
                        </option>
                    </select>
                </div>

                <!-- Date Range -->
                <div class="lg:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                    <div class="grid grid-cols-2 gap-3">
                        <input v-model="filters.date_from" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input v-model="filters.date_to" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- باقي الكود بدون تغيير -->
        <!-- Employees Table -->
        <div class="bg-white rounded-lg shadow-sm border">
            <table class="table table-report w-full">
                <thead>
                    <tr class="text-sm uppercase bg-gray-50">
                        <th class="p-4">Employee</th>
                        <th class="p-4">Contact Info</th>
                        <th class="p-4">Job Information</th>
                        <th class="p-4">Added Date</th>
                        <th class="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending">
                        <template v-if="filteredEmployees.length > 0">
                            <tr v-for="employee in paginatedEmployees" :key="employee.id" class="text-sm border-b hover:bg-gray-50">
                                <!-- Employee Info -->
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <img v-if="employee.image" :src="employee.image" :alt="employee.name" class="w-12 h-12 rounded-full object-cover" />
                                            <Icon v-else name="solar:user-circle-linear" class="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <div class="font-semibold text-gray-900">{{ employee.name }}</div>
                                            <div class="text-xs text-gray-500">{{ employee.nationality }}</div>
                                        </div>
                                    </div>
                                </td>

                                <!-- Contact Info -->
                                <td class="p-4">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <Icon name="solar:letter-linear" class="w-4 h-4 text-gray-400" />
                                            <span class="text-gray-600">{{ employee.email }}</span>
                                        </div>
                                        <div v-if="employee.phone" class="flex items-center gap-2">
                                            <Icon name="solar:phone-linear" class="w-4 h-4 text-gray-400" />
                                            <span class="text-gray-600">{{ employee.phone }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <Icon name="solar:point-on-map-linear" class="w-4 h-4 text-gray-400" />
                                            <span class="text-gray-600"> {{ employee.city }}, {{ employee.country }} </span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Job Info -->
                                <td class="p-4">
                                    <div class="space-y-2">
                                        <div>
                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                                {{ formatJobType(employee.type_job) }}
                                            </span>
                                        </div>
                                        <div v-if="employee.skills" class="text-xs text-gray-600 line-clamp-2">
                                            {{ employee.skills }}
                                        </div>
                                        <div v-else class="text-xs text-gray-400">No skills specified</div>

                                        <!-- عرض الوظائف المفضلة -->
                                        <div v-if="employee.favorite_work && employee.favorite_work.length > 0" class="flex flex-wrap gap-1">
                                            <span v-for="(job, jobIndex) in employee.favorite_work.slice(0, 3)" :key="jobIndex" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                {{ job }}
                                            </span>
                                            <span v-if="employee.favorite_work.length > 3" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"> +{{ employee.favorite_work.length - 3 }} </span>
                                        </div>
                                        <div v-else class="text-xs text-gray-400">No preferred jobs</div>

                                        <div v-if="employee.languages && employee.languages.length > 0" class="flex flex-wrap gap-1">
                                            <span v-for="(lang, langIndex) in employee.languages.slice(0, 2)" :key="langIndex" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {{ lang }}
                                            </span>
                                            <span v-if="employee.languages.length > 2" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"> +{{ employee.languages.length - 2 }} </span>
                                        </div>
                                        <div v-else class="text-xs text-gray-400">No languages</div>
                                    </div>
                                </td>

                                <!-- Date -->
                                <td class="p-4">
                                    <div class="text-gray-600 text-sm">
                                        {{ formatDate(employee.created_at) }}
                                    </div>
                                </td>

                                <!-- Actions -->
                                <td class="p-4">
                                    <div class="flex items-center gap-2">
                                        <button class="btn btn-sm btn-outline-primary flex items-center gap-2" @click="viewEmployee(employee.id)">
                                            <Icon name="solar:eye-linear" class="w-4 h-4" />
                                            View
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger flex items-center gap-2" @click="deleteItem(employee.id)">
                                            <Icon name="solar:trash-bin-minimalistic-linear" class="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="5">
                                    <div class="text-center py-12 text-gray-500">
                                        <Icon name="solar:users-group-two-rounded-linear" class="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <div class="text-lg font-medium">No Employees Found</div>
                                        <div class="text-sm">No employees match your search criteria</div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <!-- Skeleton Loading -->
                        <tr v-for="i in 5" :key="i">
                            <td class="p-4">
                                <div class="animate-pulse flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div class="space-y-2">
                                        <div class="h-4 bg-gray-200 rounded w-24"></div>
                                        <div class="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="animate-pulse space-y-2">
                                    <div class="h-4 bg-gray-200 rounded w-32"></div>
                                    <div class="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="animate-pulse space-y-2">
                                    <div class="h-4 bg-gray-200 rounded w-20"></div>
                                    <div class="h-3 bg-gray-200 rounded w-28"></div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="animate-pulse h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td class="p-4">
                                <div class="animate-pulse flex gap-2">
                                    <div class="h-8 bg-gray-200 rounded w-16"></div>
                                    <div class="h-8 bg-gray-200 rounded w-16"></div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="!pending && filteredEmployees.length > 0" class="flex items-center justify-between gap-4">
            <div class="text-sm text-gray-600">Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredEmployees.length }} employees</div>

            <div class="flex items-center gap-2">
                <button :disabled="currentPage === 1" class="btn btn-sm btn-outline-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" @click="changePage(currentPage - 1)">
                    <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
                    Previous
                </button>

                <div class="flex items-center gap-1">
                    <button v-for="page in totalPages" :key="page" :class="['btn btn-sm', page === currentPage ? 'btn-primary' : 'btn-outline-secondary', 'px-4']" @click="changePage(page)">
                        {{ page }}
                    </button>
                </div>

                <button :disabled="currentPage === totalPages" class="btn btn-sm btn-outline-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" @click="changePage(currentPage + 1)">
                    Next
                    <Icon name="solar:alt-arrow-right-linear" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Types
interface Employee {
    id: number;
    type_login: string;
    name: string;
    email: string;
    phone: string | null;
    address: string;
    skills: string | null;
    nationality: string;
    city: string;
    country: string;
    country_id: string;
    type_job: string;
    languages: string[];
    favorite_work: string[];
    image: string | null;
    cv: string | null;
    application: string | null;
    company_name: string | null;
    responsible_name: string | null;
    created_at: string;
}

interface Filters {
    search: string;
    country_id: string;
    type_job: string;
    nationality: string;
    skills: string;
    language: string;
    favorite_work: string;
    date_from: string;
    date_to: string;
}

// Page Meta
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});

// قائمة الوظائف الشائعة
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
    { id: 50, name: 'Environmental Scientist' },
]);

// قائمة اللغات العالمية
const languagesList = ref([
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Arabic',
    'Russian',
    'Portuguese',
    'Japanese',
    'Hindi',
    'Italian',
    'Dutch',
    'Korean',
    'Turkish',
    'Polish',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Greek',
    'Hebrew',
    'Thai',
    'Vietnamese',
    'Indonesian',
    'Malay',
    'Filipino',
    'Urdu',
    'Persian',
    'Bengali',
    'Punjabi',
]);

// Reactive Data
const filters = reactive<Filters>({
    search: '',
    country_id: '',
    type_job: '',
    nationality: '',
    skills: '',
    language: '',
    favorite_work: '',
    date_from: '',
    date_to: '',
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Data for filters
const countries = ref([]);

// Fetch all employees
const {
    data: employeesResponse,
    pending,
    refresh,
} = await useAsyncData('employees', async () => {
    try {
        const { data, error } = await useApiFetch('/api/employee');

        if (error.value) {
            throw error.value;
        }

        return data.value;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return null;
    }
});

// Extract employees data
const allEmployees = computed(() => {
    if (!employeesResponse.value) {
        return [];
    }

    const response = employeesResponse.value;

    // البيانات بتكون في response.data.data
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }

    return [];
});

// Filtered employees - تم تحديث البحث ليشمل رقم الهاتف
const filteredEmployees = computed(() => {
    if (!allEmployees.value.length) return [];

    return allEmployees.value.filter((employee: Employee) => {
        // Search filter - تم التحديث ليشمل رقم الهاتف
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableFields = [
                employee.name, 
                employee.email, 
                employee.phone, // إضافة رقم الهاتف للبحث
                employee.skills, 
                employee.nationality, 
                employee.city, 
                employee.country
            ].filter(Boolean).join(' ').toLowerCase();

            if (!searchableFields.includes(searchTerm)) return false;
        }

        // Country filter
        if (filters.country_id && employee.country_id !== filters.country_id) return false;

        // Job type filter
        if (filters.type_job && employee.type_job !== filters.type_job) return false;

        // Nationality filter
        if (filters.nationality && !employee.nationality?.toLowerCase().includes(filters.nationality.toLowerCase())) return false;

        // Skills filter
        if (filters.skills && !employee.skills?.toLowerCase().includes(filters.skills.toLowerCase())) return false;

        // Language filter
        if (filters.language && (!employee.languages || !employee.languages.includes(filters.language))) return false;

        // Preferred Job filter
        if (filters.favorite_work && (!employee.favorite_work || !employee.favorite_work.includes(filters.favorite_work))) return false;

        // Date range filter
        if (filters.date_from || filters.date_to) {
            const employeeDate = new Date(employee.created_at);

            if (filters.date_from) {
                const fromDate = new Date(filters.date_from);
                if (employeeDate < fromDate) return false;
            }

            if (filters.date_to) {
                const toDate = new Date(filters.date_to);
                toDate.setHours(23, 59, 59, 999);
                if (employeeDate > toDate) return false;
            }
        }

        return true;
    });
});

// Paginated employees
const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredEmployees.value.slice(start, end);
});

// Pagination info
const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredEmployees.value.length));

// Fetch filter data
onMounted(async () => {
    await loadFilterData();
});

async function loadFilterData() {
    try {
        const settingStore = useSettingsStore();
        if (settingStore.countries.length === 0) {
            await settingStore.fetchCountries();
        }
        countries.value = settingStore.countries || [];
    } catch (error) {
        console.error('Error loading filter data:', error);
    }
}

// Pagination Functions
const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Search Functions
const resetSearch = () => {
    Object.assign(filters, {
        search: '',
        country_id: '',
        type_job: '',
        nationality: '',
        skills: '',
        language: '',
        favorite_work: '',
        date_from: '',
        date_to: '',
    });
    currentPage.value = 1;
};

// Delete Employee
async function deleteItem(id: number) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    try {
        const { data, error } = await useApiFetch(`/api/employee/${id}`, {
            method: 'DELETE',
        });

        if (data.value) {
            useToast({
                title: 'Success',
                message: 'Employee deleted successfully',
                type: 'success',
                duration: 5000,
            });
            await refresh();
        }

        if (error.value) {
            throw error.value;
        }
    } catch (error: any) {
        useToast({
            title: 'Error',
            message: error.data?.message || 'Error deleting employee',
            type: 'error',
            duration: 5000,
        });
    }
}

// Format date function
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US');
}

// Format job type function
function formatJobType(type: string) {
    const types: { [key: string]: string } = {
        full_time: 'Full Time',
        part_time: 'Part Time',
        contract: 'Contract',
        freelance: 'Freelance',
    };
    return types[type] || type;
}

const viewEmployee = (id: number) => {
    navigateTo(`/dashboard/employees/${id}`);
};
</script>