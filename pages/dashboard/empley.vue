<template>
    <div class="flex flex-col gap-5">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Employees Management</div>
            <div class="text-sm text-gray-500">Total: {{ employeesData?.total || 0 }} employees</div>
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
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input v-model="serverParams.search" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Name, email, skills..." />
                </div>

                <!-- Country -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select v-model="serverParams.country_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Countries</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                        </option>
                    </select>
                </div>

                <!-- Job Type -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select v-model="serverParams.type_job" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                    <input v-model="serverParams.nationality" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nationality" />
                </div>

                <!-- Skills -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <input v-model="serverParams.skills" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Specific skills" />
                </div>

                <!-- Language -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select v-model="serverParams.language" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Languages</option>
                        <option v-for="lang in uniqueLanguages" :key="lang" :value="lang">
                            {{ lang }}
                        </option>
                    </select>
                </div>

                <!-- Preferred Job -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Job</label>
                    <select v-model="serverParams.favorite_work" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Jobs</option>
                        <option v-for="job in uniqueJobs" :key="job" :value="job">
                            {{ job }}
                        </option>
                    </select>
                </div>

                <!-- Date Range -->
                <div class="lg:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                    <div class="grid grid-cols-2 gap-3">
                        <input v-model="serverParams.date_from" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input v-model="serverParams.date_to" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button class="btn btn-secondary" @click="resetSearch">
                    <Icon name="solar:restart-linear" class="w-4 h-4 mr-2" />
                    Reset
                </button>
                <button class="btn btn-primary" @click="search">
                    <Icon name="solar:magnifer-linear" class="w-4 h-4 mr-2" />
                    Apply Filters
                </button>
            </div>
        </div>

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
                        <template v-if="employeesData && employeesData.data && employeesData.data.length > 0">
                            <tr v-for="employee in employeesData.data" :key="employee.id" class="text-sm border-b hover:bg-gray-50">
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
                                            <span class="text-gray-600">{{ employee.city }}, {{ employee.country }}</span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Job Info -->
                                <td class="p-4">
                                    <div class="space-y-2">
                                        <div>
                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                                {{ employee.type_job?.replace('_', ' ') || 'N/A' }}
                                            </span>
                                        </div>
                                        <div v-if="employee.skills" class="text-xs text-gray-600 line-clamp-2">
                                            {{ employee.skills }}
                                        </div>
                                        <div v-if="employee.languages && employee.languages.length > 0" class="flex flex-wrap gap-1">
                                            <span v-for="(lang, langIndex) in employee.languages.slice(0, 2)" :key="langIndex" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {{ lang }}
                                            </span>
                                            <span v-if="employee.languages.length > 2" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"> +{{ employee.languages.length - 2 }} </span>
                                        </div>
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
                                        <NuxtLink :to="`/employees/${employee.id}`" class="btn btn-sm btn-outline-primary flex items-center gap-2">
                                            <Icon name="solar:eye-linear" class="w-4 h-4" />
                                            View
                                        </NuxtLink>
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
        <div v-if="!pending && employeesData && employeesData.data && employeesData.data.length > 0" class="flex items-center justify-between gap-4">
            <div class="text-sm text-gray-600">Showing {{ employeesData.from }} to {{ employeesData.to }} of {{ employeesData.total }} employees</div>

            <div class="flex items-center gap-2">
                <button :disabled="!employeesData.prev_page_url" class="btn btn-sm btn-outline-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" @click="changePage(employeesData.current_page - 1)">
                    <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
                    Previous
                </button>

                <div class="flex items-center gap-1">
                    <button
                        v-for="(link, index) in employeesData.links"
                        :key="index"
                        :class="['btn btn-sm', link.active ? 'btn-primary' : 'btn-outline-secondary', index === 0 || index === employeesData.links.length - 1 ? 'px-3' : 'px-4']"
                        :disabled="!link.url || link.active"
                        @click="changePage(link.label)"
                    >
                        <span v-html="link.label"></span>
                    </button>
                </div>

                <button :disabled="!employeesData.next_page_url" class="btn btn-sm btn-outline-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" @click="changePage(employeesData.current_page + 1)">
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
    company_name: string | null;
    responsible_name: string | null;
    created_at: string;
}

interface ServerParams {
    paginate: number;
    page: number;
    search: string | null;
    country_id: string | null;
    type_job: string | null;
    nationality: string | null;
    skills: string | null;
    language: string | null;
    favorite_work: string | null;
    date_from: string | null;
    date_to: string | null;
}

// Page Meta
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});

// Reactive Data
const serverParams = ref<ServerParams>({
    paginate: 10,
    page: 1,
    search: null,
    country_id: null,
    type_job: null,
    nationality: null,
    skills: null,
    language: null,
    favorite_work: null,
    date_from: null,
    date_to: null,
});

// Data for filters
const countries = ref([]);
const uniqueLanguages = ref<string[]>([]);
const uniqueJobs = ref<string[]>([]);

// Fetch filter data
onMounted(async () => {
    await loadFilterData();
});

async function loadFilterData() {
    try {
        // جلب الدول من الـ store
        const settingStore = useSettingsStore();
        if (settingStore.countries.length === 0) {
            await settingStore.fetchCountries();
        }
        countries.value = settingStore.countries || [];

        // جلب بيانات الموظفين لاستخراج اللغات والوظائف الفريدة
        await loadEmployeesForFilters();
    } catch (error) {
        console.error('Error loading filter data:', error);
    }
}

async function loadEmployeesForFilters() {
    try {
        const { data } = await useApiFetch('/api/employee', {
            query: { paginate: 1000 },
        });

        if (data.value?.data) {
            const employees = data.value.data;

            // استخراج اللغات الفريدة
            const allLanguages = employees.flatMap((emp) => emp.languages || []);
            uniqueLanguages.value = [...new Set(allLanguages)].filter((lang) => lang && lang.trim());

            // استخراج الوظائف الفريدة
            const allJobs = employees.flatMap((emp) => emp.favorite_work || []);
            uniqueJobs.value = [...new Set(allJobs)].filter((job) => job && job.trim());
        }
    } catch (error) {
        console.error('Error loading employees for filters:', error);
    }
}

// استخدام useAsyncData للـ data fetching
const {
    data: employeesData,
    pending,
    refresh,
} = await useAsyncData(
    'employees',
    async () => {
        try {
            // تنظيف الـ params من القيم الفارغة
            const cleanParams = Object.fromEntries(Object.entries(serverParams.value).filter(([_, value]) => value !== null && value !== '' && value !== undefined));

            const { data, error } = await useApiFetch('/api/employee', {
                query: cleanParams,
            });

            if (error.value) {
                throw error.value;
            }

            return data.value?.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            return null;
        }
    },
    {
        watch: [serverParams],
    },
);

// Pagination Functions
const changePage = (value: number | string) => {
    const pageNumber = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(pageNumber) && pageNumber > 0) {
        serverParams.value.page = pageNumber;
    }
};

// Search Functions
const search = () => {
    serverParams.value.page = 1;
};

const resetSearch = () => {
    serverParams.value = {
        paginate: 10,
        page: 1,
        search: null,
        country_id: null,
        type_job: null,
        nationality: null,
        skills: null,
        language: null,
        favorite_work: null,
        date_from: null,
        date_to: null,
    };
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

// Watch for serverParams changes to auto-refresh
watch(
    serverParams,
    async () => {
        await refresh();
    },
    { deep: true },
);

// Debounced search
const debouncedSearch = ref(null);
watch(
    () => serverParams.value.search,
    () => {
        if (debouncedSearch.value) clearTimeout(debouncedSearch.value);
        debouncedSearch.value = setTimeout(() => {
            serverParams.value.page = 1;
        }, 500);
    },
);
</script>
