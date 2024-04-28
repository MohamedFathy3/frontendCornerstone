<script setup>
import { helpers, numeric, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

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

const editMode = ref(false);
const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch(`/api/country`, {
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
        const { data, error } = await useApiFetch(`/api/country/${id}`, {
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
    key: null,
    code: null,
    active: true,
    position: 1,
    image: null,
});
const rules = ref({
    name: { required },
    key: {},
    code: { required },
    active: {},
    position: { numeric },
    image: {},
});
const v$ = useVuelidate(rules, item);

async function resetItemValues() {
    item.value.name = null;
    item.value.key = null;
    item.value.code = null;
    item.value.active = true;
    item.value.position = 1;
    item.value.image = null;
}
async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    v$.value.$reset();
    await resetItemValues();
}

async function addItem() {
    const { data, error } = await useApiFetch(`/api/country`, {
        method: 'POST',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}

const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/country/${id}`, {
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
    if (id !== null) {
        editMode.value = true;
        await fetchItem(id);
    } else {
        editMode.value = false;
    }
    formLoading.value = false;
    isOpen.value = true;
}

async function updateItem() {
    const { data, error } = await useApiFetch(`/api/country/${item.value.id}`, {
        method: 'PATCH',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}

async function handleModalSubmit() {
    formLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    if (editMode.value === true) {
        await updateItem();
    } else {
        await addItem();
    }
}
</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Countries</div>
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
                        <th>Key</th>
                        <th>Code</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending">
                        <template v-if="rows.data && rows.data.length > 0">
                            <tr v-for="(row, index) in rows.data" :key="index" class="text-sm">
                                <td class="whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-5">
                                            <NuxtImg v-if="row.imageUrl" class="w-8 h-5 object-cover bg-white !rounded-md" :src="row.imageUrl" :alt="row.name" :title="row.name" />
                                        </div>
                                        <div class="font-medium">{{ row.name }}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="line-clamp-1">
                                        <div>+{{ row.key }}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="line-clamp-1">
                                        {{ row.code }}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <button class="px-2 py-1.5 flex items-center text-primary gap-2" @click="openModal(row.id)">
                                            <Icon name="solar:pen-new-square-linear" class="w-4 h-4 shrink-0" />
                                            <span class="font-medium">Edit</span>
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
                    <div class="font-medium" v-html="editMode ? 'Update Item' : 'Add New Item'"></div>
                    <Icon name="solar:close-square-outline" class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid lg:grid-cols-12 gap-5 items-start">
                    <div class="lg:col-span-4">
                        <FormUploader v-model="item.image" :allowed-types="['image']" label="Flag" name="image" />
                    </div>
                    <div class="lg:col-span-8 grid lg:grid-cols-12 gap-5 items-center">
                        <FormInputField v-model="item.name" name="name" :errors="v$.name.$errors" placeholder="Name" label="Name" class="lg:col-span-12" />
                        <FormInputField v-model="item.key" name="key" prefix="+" :errors="v$.key.$errors" placeholder="Key" label="Key" class="lg:col-span-12" />
                        <FormInputField v-model="item.code" name="code" :errors="v$.code.$errors" placeholder="Code" label="Code" class="lg:col-span-12" />
                        <div class="lg:col-span-6">
                            <div data-tw-merge class="flex items-center">
                                <input id="active-switch" v-model="item.active" type="checkbox" class="form-checkbox-input" />
                                <label for="active-switch" class="cursor-pointer ml-4 text-sm font-medium capitalize">
                                    <span :class="[item.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="item.active ? 'Active' : 'Inactive'"></span>
                                </label>
                            </div>
                        </div>
                        <FormInputField v-model="item.position" name="position" type="number" :errors="v$.position.$errors" placeholder="Position" label="Position" class="lg:col-span-6" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" type="button" class="btn btn-danger px-4" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" type="button" class="btn btn-primary px-4" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
