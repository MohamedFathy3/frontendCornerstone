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

// استخدام useAsyncData للـ data fetching
const { data: companiesData, pending, refresh } = await useAsyncData(
  'companies',
  async () => {
    const { data } = await useApiFetch('/api/company', {
      query: serverParams.value,
    });
    return data.value?.data;
  },
  {
    watch: [serverParams],
  }
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

// Delete Company
async function deleteItem(id: number) {
  const confirmed = confirm('Are you sure you want to delete this company?');
  if (!confirmed) return;

  try {
    const { data, error } = await useApiFetch('/api/company', {
      method: 'DELETE',
      body: { items: [id] },
    });

    if (data.value) {
      useToast({ 
        title: 'Success', 
        message: 'Company deleted successfully', 
        type: 'success', 
        duration: 5000 
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
      duration: 5000 
    });
  }
}

// Format date function
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US');
}

// Watch for serverParams changes to auto-refresh
watch(serverParams, async () => {
  await refresh();
}, { deep: true });
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="text-lg font-medium">Companies Management</div>
      <div class="text-sm text-gray-500">
        Total: {{ companiesData?.total || 0 }} companies
      </div>
    </div>

    <!-- Search Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
      <!-- Search -->
      <FormInputField 
        v-model="serverParams.search" 
        class="lg:col-span-8" 
        placeholder="Search by company name, responsible person, email, or country..." 
      />

      <!-- Actions -->
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
            <th class="p-4">Location</th>
            <th class="p-4">Added Date</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!pending">
            <template v-if="companiesData && companiesData.data && companiesData.data.length > 0">
              <tr 
                v-for="company in companiesData.data" 
                :key="company.id" 
                class="text-sm border-b hover:bg-gray-50"
              >
                <!-- Company Info -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <img 
                        v-if="company.image" 
                        :src="company.image" 
                        :alt="company.name"
                        class="w-12 h-12 rounded-full object-cover"
                      />
                      <Icon v-else name="solar:user-circle-linear" class="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ company.name }}</div>
                      <div class="text-xs text-gray-500">Responsible: {{ company.responsible_name }}</div>
                    </div>
                  </div>
                </td>

                <!-- Contact Info -->
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

                <!-- Location Info -->
                <td class="p-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <Icon name="solar:point-on-map-linear" class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600">{{ company.city }}, {{ company.country }}</span>
                    </div>
                    <div v-if="company.address" class="text-xs text-gray-500">
                      {{ company.address }}
                    </div>
                  </div>
                </td>

                <!-- Date -->
                <td class="p-4">
                  <div class="text-gray-600 text-sm">
                    {{ formatDate(company.created_at) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      class="btn btn-sm btn-outline-danger flex items-center gap-2"
                      @click="deleteItem(company.id)"
                    >
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
                    <Icon name="solar:buildings-2-linear" class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <div class="text-lg font-medium">No Companies Found</div>
                    <div class="text-sm">No companies match your search criteria</div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <!-- Skeleton Loading -->
            <tr v-for="i in 5" :key="i">
              <td v-for="j in 5" :key="j" class="p-4">
                <div class="animate-pulse bg-gray-200 h-6 rounded"></div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!pending && companiesData && companiesData.data && companiesData.data.length > 0" 
         class="flex items-center justify-between gap-4">
      <div class="text-sm text-gray-600">
        Showing {{ companiesData.from }} to {{ companiesData.to }} of {{ companiesData.total }} companies
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          :disabled="!companiesData.prev_page_url" 
          class="btn btn-sm btn-outline-secondary flex items-center gap-2"
          @click="changePage(companiesData.current_page - 1)"
        >
          <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
          Previous
        </button>
        
        <div class="flex items-center gap-1">
          <button 
            v-for="(link, index) in companiesData.links" 
            :key="index"
            :class="[
              'btn btn-sm',
              link.active ? 'btn-primary' : 'btn-outline-secondary',
              index === 0 || index === companiesData.links.length - 1 ? 'px-3' : 'px-4'
            ]"
            :disabled="!link.url || link.active"
            @click="changePage(link.label)"
          >
            <span v-html="link.label"></span>
          </button>
        </div>
        
        <button 
          :disabled="!companiesData.next_page_url" 
          class="btn btn-sm btn-outline-secondary flex items-center gap-2"
          @click="changePage(companiesData.current_page + 1)"
        >
          Next
          <Icon name="solar:alt-arrow-right-linear" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>