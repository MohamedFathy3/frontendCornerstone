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
  type_job: string;
  languages: string[];
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
const { data: employeesData, pending, refresh } = await useAsyncData(
  'employees',
  async () => {
    const { data } = await useApiFetch('/api/employee', {
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

// Delete Employee
async function deleteItem(id: number) {
  const confirmed = confirm('Are you sure you want to delete this employee?');
  if (!confirmed) return;

  try {
    const { data, error } = await useApiFetch('/api/employee', {
      method: 'DELETE',
      body: { items: [id] },
    });

    if (data.value) {
      useToast({ 
        title: 'Success', 
        message: 'Employee deleted successfully', 
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
      message: error.data?.message || 'Error deleting employee', 
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
      <div class="text-lg font-medium">Employees Management</div>
      <div class="text-sm text-gray-500">
        Total: {{ employeesData?.total || 0 }} employees
      </div>
    </div>

    <!-- Search Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
      <!-- Search -->
      <FormInputField 
        v-model="serverParams.search" 
        class="lg:col-span-8" 
        placeholder="Search by name, email, skills, or country..." 
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
              <tr 
                v-for="employee in employeesData.data" 
                :key="employee.id" 
                class="text-sm border-b hover:bg-gray-50"
              >
                <!-- Employee Info -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <img 
                        v-if="employee.image" 
                        :src="employee.image" 
                        :alt="employee.name"
                        class="w-12 h-12 rounded-full object-cover"
                      />
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
                        {{ employee.type_job.replace('_', ' ') }}
                      </span>
                    </div>
                    <div v-if="employee.skills" class="text-xs text-gray-600">
                      {{ employee.skills }}
                    </div>
                    <div v-if="employee.languages && employee.languages.length > 0" class="flex flex-wrap gap-1">
                      <span 
                        v-for="(lang, langIndex) in employee.languages.slice(0, 2)" 
                        :key="langIndex"
                        class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {{ lang }}
                      </span>
                      <span 
                        v-if="employee.languages.length > 2" 
                        class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        +{{ employee.languages.length - 2 }}
                      </span>
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
                    <button 
                      class="btn btn-sm btn-outline-danger flex items-center gap-2"
                      @click="deleteItem(employee.id)"
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
              <td v-for="j in 5" :key="j" class="p-4">
                <div class="animate-pulse bg-gray-200 h-6 rounded"></div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!pending && employeesData && employeesData.data && employeesData.data.length > 0" 
         class="flex items-center justify-between gap-4">
      <div class="text-sm text-gray-600">
        Showing {{ employeesData.from }} to {{ employeesData.to }} of {{ employeesData.total }} employees
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          :disabled="!employeesData.prev_page_url" 
          class="btn btn-sm btn-outline-secondary flex items-center gap-2"
          @click="changePage(employeesData.current_page - 1)"
        >
          <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
          Previous
        </button>
        
        <div class="flex items-center gap-1">
          <button 
            v-for="(link, index) in employeesData.links" 
            :key="index"
            :class="[
              'btn btn-sm',
              link.active ? 'btn-primary' : 'btn-outline-secondary',
              index === 0 || index === employeesData.links.length - 1 ? 'px-3' : 'px-4'
            ]"
            :disabled="!link.url || link.active"
            @click="changePage(link.label)"
          >
            <span v-html="link.label"></span>
          </button>
        </div>
        
        <button 
          :disabled="!employeesData.next_page_url" 
          class="btn btn-sm btn-outline-secondary flex items-center gap-2"
          @click="changePage(employeesData.current_page + 1)"
        >
          Next
          <Icon name="solar:alt-arrow-right-linear" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>