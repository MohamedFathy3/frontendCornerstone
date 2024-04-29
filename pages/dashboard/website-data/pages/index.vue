<script setup>
import { required } from '@vuelidate/validators';
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
} = await useApiFetch(`/api/page`, {
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
        const { data, error } = await useApiFetch(`/api/page/${id}`, {
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
    title: null,
    slug: null,
    keywords: null,
    description: null,
    active: true,
    position: null,
    image: null,
});
const rules = ref({
    name: { required },
    title: { required },
    slug: { required },
    keywords: {},
    description: {},
    active: {},
    position: {},
    image: {},
});

const v$ = useVuelidate(rules, item);

async function resetItemValues() {
    item.value.name = null;
    item.value.title = null;
    item.value.slug = null;
    item.value.keywords = null;
    item.value.description = null;
    item.value.active = true;
    item.value.position = null;
    item.value.image = null;
}

async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    v$.value.$reset();
    await resetItemValues();
}

async function addItem() {
    const { data, error } = await useApiFetch(`/api/page`, {
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

async function openModal() {
    formLoading.value = true;
    editMode.value = false;
    formLoading.value = false;
    isOpen.value = true;
}

async function handleModalSubmit() {
    formLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    await addItem();
}
</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Pages</div>
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
                                    <div v-if="row.slug !== 'home'">
                                        <Icon v-if="row.active" class="size-7 text-success" name="solar:check-circle-linear" />
                                        <Icon v-else class="size-7 text-danger" name="solar:close-circle-linear" />
                                    </div>
                                    <div v-else class="opacity-75 font-medium italic">Default Home</div>
                                </td>

                                <td>
                                    <div class="flex items-center gap-3">
                                        <NuxtLink :to="'/dashboard/website-data/pages/' + row.id">
                                            <button class="px-2 py-1.5 flex items-center text-primary gap-2">
                                                <Icon class="w-4 h-4 shrink-0" name="solar:eye-linear" />
                                                <span class="font-medium">Show</span>
                                            </button>
                                        </NuxtLink>
                                        <button v-if="row.slug !== 'home'" class="px-2 py-1.5 flex items-center text-danger gap-2" @click="deleteItem(row.id)">
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
                <div>
                    <div class="p-4 border rounded-xl mt-2 bg-slate-50">
                        <div class="grid lg:grid-cols-12 gap-5 items-center">
                            <FormUploader v-model="item.image" :allowed-types="['image']" class="lg:col-span-12" label="SEO Image Cover" name="image" />
                            <FormInputField v-model="item.title" :errors="v$.title.$errors" class="lg:col-span-12" description="This will be used for Page Title tag in SEO" label="Title" name="title" placeholder="Title" />
                            <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-6" description="This will be used for Admin dashboard index display" label="Name" name="name" placeholder="Name" />
                            <FormInputField v-model="item.slug" :errors="v$.slug.$errors" class="lg:col-span-6" description="Must be unique and without any spaces for example: my-page-name" label="Slug" name="slug" placeholder="Slug" />
                            <FormInputField v-model="item.keywords" :errors="v$.keywords.$errors" class="lg:col-span-12" label="Keywords" name="keywords" placeholder="Keywords" type="textarea" />
                            <FormInputField v-model="item.description" :errors="v$.description.$errors" class="lg:col-span-12" label="Description" name="description" placeholder="Description" type="textarea" />
                            <div class="lg:col-span-6">
                                <div class="flex items-center" data-tw-merge>
                                    <input id="active-switch" v-model="item.active" class="form-checkbox-input" type="checkbox" />
                                    <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                                        <span :class="[item.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="item.active ? 'Active' : 'Inactive'"></span>
                                    </label>
                                </div>
                            </div>
                            <FormInputField v-model="item.position" :errors="v$.position.$errors" class="lg:col-span-6" label="Position" name="position" placeholder="Position" />
                        </div>
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
