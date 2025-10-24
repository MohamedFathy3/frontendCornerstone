<script setup lang="ts">
// Types
interface Company {
    id: number;
    name: string;
    responsible_name: string;
    type_login: string;
    email: string;
    phone: string;
    country: string;
    address: string;
    city: string;
    image: string | null;
    created_at: string;
}

interface ServerParams {
    paginate: number;
    page: number;
    search: string | null;
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
});

// Modal
const showModal = ref(false);
const selectedCompany = ref<Company | null>(null);

// استخدام useAsyncData للـ data fetching
const {
    data: companiesData,
    pending,
    refresh,
} = await useAsyncData(
    'companies',
    async () => {
        const { data } = await useApiFetch('/api/company', {
            query: serverParams.value,
        });
        return data.value?.data;
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
    serverParams.value.search = null;
    serverParams.value.page = 1;
};

// فتح المودال لعرض التفاصيل
function viewCompany(company: Company) {
    selectedCompany.value = company;
    showModal.value = true;
}

// Delete Company — إرسال id في params بدل body
async function deleteItem(id: number) {
    const confirmed = confirm('Are you sure you want to delete this company?');
    if (!confirmed) return;

    try {
        const { data, error } = await useApiFetch(`/api/company/${id}`, {
            method: 'DELETE',
        });

        if (data.value) {
            useToast({
                title: 'Success',
                message: 'Company deleted successfully',
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
            message: error.data?.message || 'Error deleting company',
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
</script>

<template>
    <div class="flex flex-col gap-5">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Companies Management</div>
            <div class="text-sm text-gray-500">Total: {{ companiesData?.total || 0 }} companies</div>
        </div>

        <!-- Search Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
            <FormInputField
                v-model="serverParams.search"
                class="lg:col-span-8"
                placeholder="Search by company name, responsible person, email, or country..."
            />
            <div class="lg:col-span-4 flex gap-2">
                <button class="btn btn-dark flex-1" @click="search">
                    <Icon name="solar:magnifer-linear" class="w-4 h-4 mr-2" />
                    Search
                </button>
                <button class="btn btn-secondary flex-1" @click="resetSearch">
                    <Icon name="solar:restart-linear" class="w-4 h-4 mr-2" />
                    Reset
                </button>
            </div>
        </div>

        <!-- Companies Table -->
        <div class="bg-white rounded-lg shadow-sm border">
            <table class="table table-report w-full">
                <thead>
                    <tr class="text-sm uppercase bg-gray-50">
                        <th class="p-4">Company</th>
                        <th class="p-4">Contact Info</th>
                        <th class="p-4">Added Date</th>
                        <th class="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending">
                        <template v-if="companiesData && companiesData.data && companiesData.data.length > 0">
                            <tr v-for="company in companiesData.data" :key="company.id" class="text-sm border-b hover:bg-gray-50">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <img v-if="company.image" :src="company.image" :alt="company.name" class="w-12 h-12 rounded-full object-cover" />
                                            <Icon v-else name="solar:user-circle-linear" class="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <div class="font-semibold text-gray-900">{{ company.name }}</div>
                                            <div class="text-xs text-gray-500">Responsible: {{ company.responsible_name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <Icon name="solar:letter-linear" class="w-4 h-4 text-gray-400" />
                                            <span class="text-gray-600">{{ company.email }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <Icon name="solar:phone-linear" class="w-4 h-4 text-gray-400" />
                                            <span class="text-gray-600">{{ company.phone }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">{{ formatDate(company.created_at) }}</td>
                                <td class="p-4">
                                    <div class="flex items-center gap-2">
                                        <button class="btn btn-sm btn-outline-primary flex items-center gap-2" @click="viewCompany(company)">
                                            <Icon name="solar:eye-linear" class="w-4 h-4" />
                                            View
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger flex items-center gap-2" @click="deleteItem(company.id)">
                                            <Icon name="solar:trash-bin-minimalistic-linear" class="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="4">
                                    <div class="text-center py-12 text-gray-500">
                                        <Icon name="solar:buildings-2-linear" class="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <div class="text-lg font-medium">No Companies Found</div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
            <div class="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                <h2 class="text-lg font-semibold mb-4">Company Details</h2>
                <p><strong>Name:</strong> {{ selectedCompany?.name }}</p>
                <p><strong>Responsible:</strong> {{ selectedCompany?.responsible_name }}</p>
                <p><strong>Email:</strong> {{ selectedCompany?.email }}</p>
                <p><strong>Phone:</strong> {{ selectedCompany?.phone }}</p>
                <p><strong>Comment:</strong> {{ selectedCompany?.address }}</p>
                <div class="mt-4 text-right">
                    <button @click="showModal = false" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
