<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});
const serverParams = ref({
    paginate: 10,
    page: 1,
    search: null,
});
const formLoading = ref(false);
const isOpen = ref(false);

const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch(`/api/message`, {
    query: serverParams.value,
    lazy: true,
    transform: (rows) => {
        return rows.data;
    },
});
const changePage = async (value) => {
    const pageNumber = parseInt(value);
    if (!isNaN(pageNumber)) {
        serverParams.value.page = pageNumber;
    } else {
        console.error('Invalid page number:', value);
    }
    await refresh();
};
const search = async () => {
    serverParams.value.page = 1;
    await refresh();
};
const resetSearch = async () => {
    serverParams.value.search = null;
    serverParams.value.page = 1;
    await refresh();
};
async function deleteItem(id) {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/message/${id}`, {
            method: 'DELETE',
            lazy: true,
        });
        if (data.value) {
            useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
            await refresh();
        }
        if (error.value) {
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    }
}

const item = ref({
    name: null,
    email: null,
    subject: null,
    content: null,
    country: null,
    createdAtFormatted: null,
    createdAt: null,
});
async function resetItemValues() {
    item.value.name = null;
    item.value.email = null;
    item.value.subject = null;
    item.value.content = null;
    item.value.country = null;
    item.value.createdAtFormatted = null;
    item.value.createdAt = null;
}
async function closeModal() {
    isOpen.value = false;
    await resetItemValues();
}

const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/message/${id}`, {
        method: 'GET',
        lazy: true,
    });
    if (data.value) {
        item.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
async function openModal(id = null) {
    formLoading.value = true;
    await fetchItem(id);
    formLoading.value = false;
    isOpen.value = true;
}
</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Contact Messages</div>
            <div>
                <button class="btn btn-primary" @click="openModal()">Add New</button>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-5 items-center">
            <FormInputField v-model="serverParams.search" class="col-span-8" placeholder="Search for..." />
            <button class="col-span-2 btn btn-dark" @click="search">Search</button>
            <button class="col-span-2 btn btn-secondary" @click="resetSearch">Reset Search</button>
        </div>
        <div>
            <table class="table table-report">
                <thead>
                    <tr class="text-sm uppercase">
                        <th>Name</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending">
                        <template v-if="rows.data && rows.data.length > 0">
                            <tr v-for="(row, index) in rows.data" :key="index" class="text-sm">
                                <td class="whitespace-nowrap">
                                    <div>
                                        <div class="font-medium">{{ row.name }}</div>
                                        <div class="text-xs mt-1">{{ row.email }}</div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div class="flex items-center">
                                            <div v-if="row?.country?.imageUrl" class="w-6 h-4 mr-2">
                                                <NuxtImg v-if="row.country.imageUrl" class="w-6 h-4 object-cover shrink-0" :src="row.country.imageUrl" :alt="row.country.name" :title="row.country.name" />
                                            </div>
                                            <div class="font-medium">{{ row.country.name }}</div>
                                        </div>
                                        <div v-if="row.createdAtFormatted" class="text-sm mt-1">{{ row.createdAtFormatted }}</div>
                                    </div>
                                </td>

                                <td>
                                    <div class="flex items-center gap-3">
                                        <button class="px-2 py-1.5 flex items-center text-primary gap-2" @click="openModal(row.id)">
                                            <Icon name="solar:eye-scan-bold" class="w-4 h-4 shrink-0" />
                                            <span class="font-medium">View</span>
                                        </button>
                                        <button class="px-2 py-1.5 flex items-center text-danger gap-2" @click="deleteItem(row.id)">
                                            <Icon name="solar:trash-bin-minimalistic-linear" class="w-4 h-4 shrink-0" />
                                            <span class="font-medium">Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="4">
                                    <div class="text-center italic py-12">
                                        <Icon name="solar:archive-broken" class="size-14 opacity-75" />
                                        <div class="mt-4 text-lg font-medium">No Items!</div>
                                        <div>You can add more items if you want</div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <tr v-for="(i, index) in serverParams.paginate" :key="index">
                            <td>
                                <div class="w-32 bg-slate-100 h-6" />
                            </td>
                            <td>
                                <div class="w-32 bg-slate-100 h-6" />
                            </td>
                            <td>
                                <div class="w-32 bg-slate-100 h-6" />
                            </td>
                            <td>
                                <div class="w-32 bg-slate-100 h-6" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div v-if="!pending && rows.data" class="flex items-center justify-between gap-5">
            <button :disabled="rows.current_page === 1" class="btn-secondary btn" @click="changePage(serverParams.page - 1)">
                <Icon name="solar:double-alt-arrow-left-line-duotone" class="mr-2 w-5 h-5" />
                Previous
            </button>
            <ul class="flex items-center gap-3">
                <template v-for="(link, pageIndex) in rows.links" :key="pageIndex">
                    <li v-if="pageIndex !== 0 && pageIndex !== rows.links.length - 1">
                        <button :disabled="rows.current_page === parseInt(link.label)" :class="[link.active ? 'btn-primary' : 'btn-secondary', 'btn']" @click="changePage(link.label)">{{ link.label }}</button>
                    </li>
                </template>
            </ul>
            <button :disabled="rows.current_page === rows.last_page" class="btn-secondary btn" @click="changePage(serverParams.page + 1)">
                Next
                <Icon name="solar:double-alt-arrow-right-line-duotone" class="ml-2 w-5 h-5" />
            </button>
        </div>
        <TheModal size="4xl" :open-modal="isOpen" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium">View Message</div>
                    <Icon name="solar:close-square-outline" class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <ul class="w-full divide-y divide-slate-200 divide-dashed px-5">
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Name</div>
                        <div class="lg:col-span-3">{{ item?.name }}</div>
                    </li>
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Email</div>
                        <div class="lg:col-span-3">{{ item?.email }}</div>
                    </li>
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Subject</div>
                        <div class="lg:col-span-3">{{ item?.subject }}</div>
                    </li>
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Content</div>
                        <div class="lg:col-span-3">{{ item?.content }}</div>
                    </li>
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Country</div>
                        <div class="flex items-center lg:col-span-3">
                            <div v-if="item?.country?.imageUrl" class="w-8 h-5 mr-2">
                                <NuxtImg v-if="item.country.imageUrl" class="w-8 h-5 object-cover shrink-0" :src="item.country.imageUrl" :alt="item.country.name" :title="item.country.name" />
                            </div>
                            <div>{{ item.country.name }}</div>
                        </div>
                    </li>
                    <li class="py-3 grid lg:grid-cols-4 gap-5 items-start">
                        <div class="font-medium">Received At</div>
                        <div class="lg:col-span-3">{{ item.createdAtFormatted }}</div>
                    </li>
                </ul>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" type="button" class="btn btn-danger px-4" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
