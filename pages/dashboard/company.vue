<script setup lang="ts">
// Types - معدل علشان نتعامل مع البيانات null
interface Company {
    id: number;
    name: string;
    responsible_name: string;
    type_login: string;
    email: string;
    phone: string;
    country: string | null;
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
const deleting = ref(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);

// دالة لتحويل البيانات القادمة من الـ API بشكل آمن
function transformCompanyData(apiData: any): Company {
    console.log('🔧 Transforming company data:', apiData);
    
    return {
        id: apiData?.id || 0,
        name: apiData?.name || 'Ukendt virksomhed',
        responsible_name: apiData?.responsible_name || 'Ikke specificeret',
        type_login: apiData?.type_login || 'company',
        email: apiData?.email || 'Ingen email',
        phone: apiData?.phone || 'Ingen telefon',
        country: apiData?.country || 'Ikke specificeret',
        address: apiData?.address || 'Ingen adresse',
        city: apiData?.city || 'Ingen by',
        image: apiData?.image || null,
        created_at: apiData?.created_at || new Date().toISOString(),
    };
}

// استخدام useAsyncData للـ data fetching مع التحويل الآمن
const {
    data: companiesData,
    pending,
    refresh,
} = await useAsyncData(
    'companies',
    async () => {
        try {
            console.log('📡 Fetching companies with params:', serverParams.value);
            
            const { data, error } = await useApiFetch('/api/company', {
                query: serverParams.value,
            });

            if (error.value) {
                console.error('❌ Error fetching companies:', error.value);
                return { data: [], total: 0, current_page: 1, last_page: 1 };
            }

            console.log('✅ API Response:', data.value);

            // 🔧 الإصلاح: التحقق من هيكل البيانات بشكل صحيح
            let companiesArray = [];
            
            if (Array.isArray(data.value?.data)) {
                // إذا كانت البيانات مصفوفة مباشرة
                companiesArray = data.value.data;
            } else if (data.value?.data?.data && Array.isArray(data.value.data.data)) {
                // إذا كانت البيانات متداخلة (مثل Laravel pagination)
                companiesArray = data.value.data.data;
            } else if (data.value?.data && Array.isArray(data.value.data)) {
                // هيكل آخر محتمل
                companiesArray = data.value.data;
            }

            console.log('📊 Companies array:', companiesArray);

            if (companiesArray && companiesArray.length > 0) {
                const transformedData = companiesArray.map(transformCompanyData);
                console.log('🔄 Transformed data:', transformedData);
                
                return {
                    data: transformedData,
                    total: data.value?.total || data.value?.data?.total || transformedData.length,
                    current_page: data.value?.current_page || data.value?.data?.current_page || 1,
                    last_page: data.value?.last_page || data.value?.data?.last_page || 1,
                };
            }
            
            console.log('ℹ️ No data found');
            return { data: [], total: 0, current_page: 1, last_page: 1 };
        } catch (err) {
            console.error('💥 Fetch error:', err);
            return { data: [], total: 0, current_page: 1, last_page: 1 };
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

// Search Functions - معدلة علشان البحث التلقائي
const performSearch = () => {
    serverParams.value.page = 1;
    refresh();
};

// البحث التلقائي مع debounce
const handleSearchInput = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
    
    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 500);
};

const resetSearch = () => {
    serverParams.value.search = null;
    serverParams.value.page = 1;
    refresh();
};

// دالة آمنة لعرض البيانات
function safeGetCountry(company: Company): string {
    return company.country || 'Ikke specificeret';
}

function safeGetName(company: Company): string {
    return company.name || 'Ukendt virksomhed';
}

function safeGetResponsibleName(company: Company): string {
    return company.responsible_name || 'Ikke specificeret';
}

function safeGetEmail(company: Company): string {
    return company.email || 'Ingen email';
}

function safeGetPhone(company: Company): string {
    return company.phone || 'Ingen telefon';
}

function safeGetAddress(company: Company): string {
    return company.address || 'Ingen adresse';
}

function safeGetCity(company: Company): string {
    return company.city || 'Ingen by';
}

// فتح المودال لعرض التفاصيل
function viewCompany(company: Company) {
    selectedCompany.value = company;
    showModal.value = true;
}

// إغلاق المودال
function closeModal() {
    showModal.value = false;
    selectedCompany.value = null;
}

// Delete Company من الجدول
async function deleteItem(id: number) {
    const confirmed = confirm('Er du sikker på, at du vil slette denne virksomhed?');
    if (!confirmed) return;

    if (deleting.value) return;
    deleting.value = true;

    try {
        console.log('🗑️ Deleting company with ID:', id);

        const { data, error } = await useApiFetch(`/api/company/${id}`, {
            method: 'DELETE'
        });

        console.log('📦 Delete response:', data.value);
        console.log('❌ Delete error:', error.value);

        if (error.value) {
            console.error('🚨 Delete API Error:', error.value);
            throw new Error(error.value.data?.message || error.value.message || 'Kunne ikke slette virksomheden');
        }

        if (data.value) {
            useToast({
                title: 'Succes',
                message: data.value.message || 'Virksomheden blev slettet',
                type: 'success',
                duration: 5000,
            });
            
            if (showModal.value && selectedCompany.value?.id === id) {
                closeModal();
            }
            
            await refresh();
            console.log('✅ Company deleted and data refreshed');
        } else {
            throw new Error('Ingen svar fra serveren');
        }

    } catch (error: any) {
        console.error('💥 Delete error:', error);
        useToast({
            title: 'Fejl',
            message: error.message || 'Fejl ved sletning af virksomhed',
            type: 'error',
            duration: 5000,
        });
    } finally {
        deleting.value = false;
    }
}

// Delete from Modal
async function deleteFromModal() {
    if (!selectedCompany.value) return;

    const confirmed = confirm('Er du sikker på, at du vil slette denne virksomhed?');
    if (!confirmed) return;

    if (deleting.value) return;
    deleting.value = true;

    try {
        const companyId = selectedCompany.value.id;
        console.log('🗑️ Deleting company from modal with ID:', companyId);

        closeModal();

        const { data, error } = await useApiFetch(`/api/company/${companyId}`, {
            method: 'DELETE'
        });

        console.log('📦 Delete from modal response:', data.value);
        console.log('❌ Delete from modal error:', error.value);

        if (error.value) {
            console.error('🚨 Delete from modal API Error:', error.value);
            throw new Error(error.value.data?.message || error.value.message || 'Kunne ikke slette virksomheden');
        }

        if (data.value) {
            useToast({
                title: 'Succes',
                message: data.value.message || 'Virksomheden blev slettet',
                type: 'success',
                duration: 5000,
            });
            
            await refresh();
            console.log('✅ Company deleted from modal and data refreshed');
        } else {
            throw new Error('Ingen svar fra serveren');
        }

    } catch (error: any) {
        console.error('💥 Delete from modal error:', error);
        useToast({
            title: 'Fejl',
            message: error.message || 'Fejl ved sletning af virksomhed',
            type: 'error',
            duration: 5000,
        });
    } finally {
        deleting.value = false;
    }
}

// Format date function
function formatDate(dateString: string) {
    if (!dateString) return 'Ukendt dato';
    try {
        return new Date(dateString).toLocaleDateString('da-DK');
    } catch {
        return 'Ugyldig dato';
    }
}

// دالة لقص النص الطويل
function truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// دالة لتنظيف وعرض الـ address بشكل جميل
function formatAddress(address: string): string {
    if (!address) return '-';
    
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    
    if (cleanAddress.length > 150) {
        return cleanAddress.substring(0, 150) + '...';
    }
    
    return cleanAddress;
}

// Watch for serverParams changes to auto-refresh
watch(
    serverParams,
    async () => {
        await refresh();
    },
    { deep: true },
);

// watch على companiesData علشان إذا اتحذفت company من الجدول ونحن في المودال
watch(companiesData, (newData) => {
    if (showModal.value && selectedCompany.value) {
        const companyStillExists = newData?.data?.some(
            company => company.id === selectedCompany.value?.id
        );
        
        if (!companyStillExists) {
            closeModal();
        }
    }
});

// تنظيف الـ timeout عند تدمير المكون
onUnmounted(() => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
});
</script>

<template>
    <div class="flex flex-col gap-5">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Virksomhedsadministration</div>
            <div class="text-sm text-gray-500">Total: {{ companiesData?.total || 0 }} virksomheder</div>
        </div>

        <!-- Search Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
            <FormInputField
                v-model="serverParams.search"
                class="lg:col-span-8"
                placeholder="Søg efter virksomhedsnavn, ansvarlig person, email eller land..."
                @input="handleSearchInput"
            />
            <div class="lg:col-span-4 flex gap-2">
                <button class="btn btn-dark flex-1" @click="performSearch">
                    <Icon name="solar:magnifer-linear" class="w-4 h-4 mr-2" />
                    Søg
                </button>
                <button class="btn btn-secondary flex-1" @click="resetSearch">
                    <Icon name="solar:restart-linear" class="w-4 h-4 mr-2" />
                    Nulstil
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p class="ml-4 text-gray-600">Indlæser virksomheder...</p>
        </div>

        <!-- Companies Table -->
        <div v-else class="bg-white rounded-lg shadow-sm border">
            <table class="table table-report w-full">
                <thead>
                    <tr class="text-sm uppercase bg-gray-50">
                        <th class="p-4">Virksomhed</th>
                        <th class="p-4">Kontaktinfo</th>
                        <th class="p-4">Kommentar</th>
                        <th class="p-4">Oprettelsesdato</th>
                        <th class="p-4">Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="companiesData && companiesData.data && companiesData.data.length > 0">
                        <tr v-for="company in companiesData.data" :key="company.id" class="text-sm border-b hover:bg-gray-50">
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <img 
                                            v-if="company.image" 
                                            :src="company.image" 
                                            :alt="safeGetName(company)" 
                                            class="w-12 h-12 rounded-full object-cover"
                                            @error="(e) => e.target.style.display = 'none'"
                                        />
                                        <Icon v-else name="solar:user-circle-linear" class="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900">{{ safeGetName(company) }}</div>
                                        <div class="text-xs text-gray-500">Ansvarlig: {{ safeGetResponsibleName(company) }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <Icon name="solar:letter-linear" class="w-4 h-4 text-gray-400" />
                                        <span class="text-gray-600">{{ safeGetEmail(company) }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Icon name="solar:phone-linear" class="w-4 h-4 text-gray-400" />
                                        <span class="text-gray-600">{{ safeGetPhone(company) }}</span>
                                    </div>
                                </div>
                            </td>
                            <!-- <td class="p-4">
                                <div class="text-gray-600">{{ safeGetCity(company) }}</div>
                            </td>
                            <td class="p-4">
                                <div class="text-gray-600">{{ safeGetCountry(company) }}</div>
                            </td> -->
                            <td class="p-4">
                                <div class="max-w-xs">
                                    <div 
                                        class="text-gray-700 text-sm leading-relaxed cursor-pointer hover:text-blue-600 transition-colors"
                                        :title="safeGetAddress(company)"
                                        @click="viewCompany(company)"
                                    >
                                        {{ formatAddress(safeGetAddress(company)) }}
                                    </div>
                                    <div 
                                        v-if="company.address && company.address.length > 150" 
                                        class="text-xs text-blue-500 mt-1 cursor-pointer hover:underline"
                                        @click="viewCompany(company)"
                                    >
                                        Læs mere...
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="text-gray-600">{{ formatDate(company.created_at) }}</div>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-2">
                                    <button 
                                        class="btn btn-sm btn-outline-primary flex items-center gap-2" 
                                        @click="viewCompany(company)"
                                        title="Se fulde detaljer"
                                    >
                                        <Icon name="solar:eye-linear" class="w-4 h-4" />
                                        Se
                                    </button>
                                    <button 
                                        class="btn btn-sm btn-outline-danger flex items-center gap-2" 
                                        @click="deleteItem(company.id)"
                                        :disabled="deleting"
                                        title="Slet virksomhed"
                                    >
                                        <Icon 
                                            :name="deleting ? 'eos-icons:three-dots-loading' : 'solar:trash-bin-minimalistic-linear'" 
                                            class="w-4 h-4" 
                                        />
                                        {{ deleting ? 'Sletter...' : 'Slet' }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="7">
                                <div class="text-center py-12 text-gray-500">
                                    <Icon name="solar:buildings-2-linear" class="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <div class="text-lg font-medium">Ingen virksomheder fundet</div>
                                    <p class="text-sm mt-2" v-if="serverParams.search">
                                        Ingen resultater for "{{ serverParams.search }}". Prøv andre søgeord.
                                    </p>
                                    <p class="text-sm mt-2" v-else>
                                        Der er ingen registrerede virksomheder endnu.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="companiesData && companiesData.data && companiesData.data.length > 0" class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
                Viser {{ ((serverParams.page - 1) * serverParams.paginate) + 1 }} til 
                {{ Math.min(serverParams.page * serverParams.paginate, companiesData.total) }} af 
                {{ companiesData.total }} poster
            </div>
            <div class="flex gap-2">
                <button 
                    class="btn btn-outline btn-sm" 
                    :disabled="serverParams.page <= 1"
                    @click="changePage(serverParams.page - 1)"
                >
                    Forrige
                </button>
                <button 
                    class="btn btn-outline btn-sm" 
                    :disabled="serverParams.page * serverParams.paginate >= companiesData.total"
                    @click="changePage(serverParams.page + 1)"
                >
                    Næste
                </button>
            </div>
        </div>

        <!-- Modal -->
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showModal && selectedCompany"
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                @click="closeModal"
            >
                <div 
                    class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    @click.stop
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border">
                                <img 
                                    v-if="selectedCompany.image" 
                                    :src="selectedCompany.image" 
                                    :alt="safeGetName(selectedCompany)"
                                    class="w-16 h-16 rounded-full object-cover"
                                    @error="(e) => e.target.style.display = 'none'"
                                />
                                <Icon v-else name="solar:buildings-2-bold" class="w-8 h-8 text-blue-500" />
                            </div>
                            <!-- <div>
                                <h2 class="text-2xl font-bold text-gray-900">{{ safeGetName(selectedCompany) }}</h2>
                                <p class="text-gray-600">{{ safeGetResponsibleName(selectedCompany) }}</p>
                            </div> -->
                        </div>
                        <button 
                            @click="closeModal"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Icon name="solar:close-circle-linear" class="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Company Details -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Virksomhedsoplysninger</h3>
                                
                                <div class="space-y-3">
                                    <div class="flex items-start gap-3">
                                        <Icon name="solar:user-circle-linear" class="w-5 h-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">Ansvarlig person</p>
                                            <p class="text-gray-900">{{ safeGetResponsibleName(selectedCompany) }}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-start gap-3">
                                        <Icon name="solar:letter-linear" class="w-5 h-5 text-green-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">E-mail-adresse</p>
                                            <p class="text-gray-900">{{ safeGetEmail(selectedCompany) }}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-start gap-3">
                                        <Icon name="solar:phone-linear" class="w-5 h-5 text-purple-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">Telefonnummer</p>
                                            <p class="text-gray-900">{{ safeGetPhone(selectedCompany) }}</p>
                                        </div>
                                    </div>
                                    
                                    <!-- <div class="flex items-start gap-3">
                                        <Icon name="solar:map-point-linear" class="w-5 h-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">Land</p>
                                            <p class="text-gray-900">{{ safeGetCountry(selectedCompany) }}</p>
                                        </div>
                                    </div> -->

                                    <!-- <div class="flex items-start gap-3">
                                        <Icon name="solar:home-linear" class="w-5 h-5 text-teal-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">By</p>
                                            <p class="text-gray-900">{{ safeGetCity(selectedCompany) }}</p>
                                        </div>
                                    </div> -->
                                    
                                    <!-- <div class="flex items-start gap-3">
                                        <Icon name="solar:calendar-linear" class="w-5 h-5 text-red-500 mt-0.5" />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">Registreringsdato</p>
                                            <p class="text-gray-900">{{ formatDate(selectedCompany.created_at) }}</p>
                                        </div>
                                    </div> -->
                                </div>
                            </div>

                            <!-- Comment Section -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Kommentar </h3>
                                
                                <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                    <div class="prose prose-sm max-w-none">
                                        <p 
                                            v-if="selectedCompany.address" 
                                            class="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                        >
                                            {{ safeGetAddress(selectedCompany) }}
                                        </p>
                                        <p v-else class="text-gray-500 italic">
                                            Ingen kommentar eller adresse angivet.
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-2 text-sm text-gray-500">
                                    <Icon name="solar:info-circle-linear" class="w-4 h-4" />
                                    <span>{{ selectedCompany.address?.length || 0 }} tegn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
                        <button 
                            @click="closeModal"
                            class="btn btn-secondary px-6"
                        >
                            Luk
                        </button>
                        <!-- <button 
                            @click="deleteFromModal"
                            :disabled="deleting"
                            class="btn btn-danger px-6"
                        >
                            <Icon 
                                :name="deleting ? 'eos-icons:three-dots-loading' : 'solar:trash-bin-minimalistic-linear'" 
                                class="w-4 h-4 mr-2" 
                            />
                            {{ deleting ? 'Sletter...' : 'Slet virksomhed' }}
                        </button> -->
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>