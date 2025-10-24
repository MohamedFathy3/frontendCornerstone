<script setup>
import { email, helpers, numeric, required } from '@vuelidate/validators';
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
} = await useApiFetch(`/api/service`, {
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
        const { data, error } = await useApiFetch(`/api/service/${id}`, {
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
    subTitle: null,
    slug: null,
    shortDescription: null,
    description: null,
    position: null,
    active: true,
    showHome: true,
    list: [],
});
const rules = ref({
    name: { required },
    subTitle: {},
    slug: { required },
    shortDescription: {},
    description: {},
    position: {},
    active: {},
    showHome: {},
});
const v$ = useVuelidate(rules, item);

async function resetItemValues() {
    item.value.name = null;
    item.value.subTitle = null;
    item.value.slug = null;
    item.value.shortDescription = null;
    item.value.description = null;
    item.value.position = null;
    item.value.active = false;
    item.value.showHome = false;
    item.value.list = [];
}

async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    v$.value.$reset();
    await resetItemValues();
}

async function addItem() {
    const { data, error } = await useApiFetch(`/api/service`, {
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
    const { data, error } = await useApiFetch(`/api/service/${id}`, {
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
    const { data, error } = await useApiFetch(`/api/service/${item.value.id}`, {
        method: 'PATCH',
        body: item.value,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    } else {
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
            <div class="text-lg font-medium">Services</div>
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
                        <th>Show In Home</th>
                        <th>Active</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending">
                        <template v-if="rows.data && rows.data.length > 0">
                            <tr v-for="(row, index) in rows.data" :key="index" class="text-sm">
                                <td class="whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <div class="w-20 h-10">
                                            <NuxtImg v-if="row.imageUrl" :alt="row.name" :src="row.imageUrl" :title="row.name" class="w-20 h-10 object-cover bg-white !rounded-md" />
                                        </div>
                                        <div>
                                            <div class="font-medium">{{ row.name }}</div>
                                            <div class="text-xs mt-1">{{ row.slug }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <Icon v-if="row.showHome" class="size-7 text-success" name="solar:check-circle-linear" />
                                        <Icon v-else class="size-7 text-danger" name="solar:close-circle-linear" />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <Icon v-if="row.active" class="size-7 text-success" name="solar:check-circle-linear" />
                                        <Icon v-else class="size-7 text-danger" name="solar:close-circle-linear" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <button class="px-2 py-1.5 flex items-center text-primary gap-2" @click="openModal(row.id)">
                                            <Icon class="w-4 h-4 shrink-0" name="solar:pen-new-square-linear" />
                                            <span class="font-medium">Edit</span>
                                        </button>
                                        <button class="px-2 py-1.5 flex items-center text-danger gap-2" @click="deleteItem(row.id)">
                                            <Icon class="w-4 h-4 shrink-0" name="solar:trash-bin-minimalistic-linear" />
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
                                        <Icon class="size-14 opacity-75" name="solar:archive-broken" />
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
                <Icon class="mr-2 w-5 h-5" name="solar:double-alt-arrow-left-line-duotone" />
                Previous
            </button>
            <ul class="flex items-center gap-3">
                <template v-for="(link, pageIndex) in rows.links" :key="pageIndex">
                    <li v-if="pageIndex !== 0 && pageIndex !== rows.links.length - 1">
                        <button :class="[link.active ? 'btn-primary' : 'btn-secondary', 'btn']" :disabled="rows.current_page === parseInt(link.label)" @click="changePage(link.label)">
                            {{ link.label }}
                        </button>
                    </li>
                </template>
            </ul>
            <button :disabled="rows.current_page === rows.last_page" class="btn-secondary btn" @click="changePage(serverParams.page + 1)">
                Next
                <Icon class="ml-2 w-5 h-5" name="solar:double-alt-arrow-right-line-duotone" />
            </button>
        </div>
        <TheModal :open-modal="isOpen" size="4xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Item' : 'Add New Item'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid lg:grid-cols-12 gap-5 items-start">
                    <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-12" label="Name" name="name" placeholder="Name" />
                    <FormInputField v-model="item.subTitle" :errors="v$.subTitle.$errors" class="lg:col-span-12" label="Sub Title" name="sub-title" placeholder="Sub Title" />
                    <FormUploader v-model="item.image" :allowed-types="['image', 'svg']" class="lg:col-span-12" label="Image" name="image" />
                    <FormInputField v-model="item.slug" :disabled="editMode" :errors="v$.slug.$errors" :readonly="editMode" class="lg:col-span-12" label="Slug" name="slug" placeholder="Slug" />
                    <FormInputField v-model="item.shortDescription" :errors="v$.shortDescription.$errors" class="lg:col-span-12" label="Short Description" name="name" placeholder="Short Description" type="textarea" />
                    <FormInputField v-model="item.description" :errors="v$.description.$errors" class="lg:col-span-12" label="Description" name="short-description" placeholder="Description" type="textarea" />
                    <FormInputField v-model="item.position" :errors="v$.position.$errors" class="lg:col-span-12" label="Position" name="description" placeholder="Position" />
                    <div class="flex items-center lg:col-span-6" data-tw-merge>
                        <input id="active-switch" v-model="item.active" class="form-checkbox-input" type="checkbox" />
                        <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                            <span :class="[item.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="item.active ? 'Active' : 'Inactive'"></span>
                        </label>
                    </div>
                    <div class="flex items-center lg:col-span-6" data-tw-merge>
                        <input id="active-switch" v-model="item.showHome" class="form-checkbox-input" type="checkbox" />
                        <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                            <span :class="[item.showHome ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="item.showHome ? 'Visible at Home' : 'Hidden from Home'"></span>
                        </label>
                    </div>
<div v-if="item.list.length > 0" class="lg:col-span-12 border-t pt-5">
                            <div class="form-label">List Items</div>
                        <ul class="space-y-5">
                            <template v-for="(listItem, i) in item.list" :key="i">
                                <li class="grid grid-cols-12 gap-5 p-5 border rounded-lg items-start">
                                    <div class="lg:col-span-4">
                                        <FormUploader v-model="item.image" :allowed-types="['image', 'svg']" label="Image" name="image" />
                                    </div>
                                    <div class="lg:col-span-8 grid grid-cols-12 gap-5 items-center">
                                        <FormInputField v-model="listItem.title" class="lg:col-span-12" label="Title" name="title" placeholder="Title" />
                                        <FormInputField v-model="listItem.description" class="lg:col-span-12" label="Description" name="description" placeholder="Description" type="textarea" />
                                        <div class="lg:col-span-12 flex items-center justify-between gap-3" data-tw-merge>
                                            <label class="cursor-pointer text-sm font-medium capitalize" for="active-switch">
                                                <span :class="[listItem.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="listItem.active ? 'Active' : 'Inactive'"></span>
                                            </label>
                                            <input id="active-switch" v-model="listItem.active" class="form-checkbox-input" type="checkbox" />
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" class="btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
