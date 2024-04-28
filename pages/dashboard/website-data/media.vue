<script setup>
import { email, helpers, numeric, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
    title: 'Media',
});
const serverParams = ref({
    paginate: 18,
    page: 1,
    search: null,
});
const formLoading = ref(false);
const isOpen = ref(false);
const userStore = useUserStore();
const editMode = ref(false);
const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch(`/api/media`, {
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
        const { data, error } = await useApiFetch(`/api/media/${id}`, {
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
    password: null,
    image: null,
});
const rules = ref({
    name: { required },
    email: { required, email },
    password: {},
    image: {},
});
const v$ = useVuelidate(rules, item);

async function resetItemValues() {
    item.value.name = null;
    item.value.email = null;
    item.value.password = null;
    item.value.image = null;
}
async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    v$.value.$reset();
    await resetItemValues();
}

async function addItem() {
    const { data, error } = await useApiFetch(`/api/media`, {
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
    const { data, error } = await useApiFetch(`/api/media/${id}`, {
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
    const { data, error } = await useApiFetch(`/api/media/${item.value.id}`, {
        method: 'PATCH',
        body: item.value,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        if (userStore.user.id === item.value.id) {
            await userStore.fetchAuthUser();
        }
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
function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return size.toFixed(2) + ' ' + units[unitIndex];
}
</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Media</div>
        </div>
        <div class="grid grid-cols-12 gap-5 items-center">
            <FormInputField v-model="serverParams.search" class="col-span-8" placeholder="Search for..." />
            <button class="col-span-2 btn btn-dark" @click="search">Search</button>
            <button class="col-span-2 btn btn-secondary" @click="resetSearch">Reset Search</button>
        </div>
        <div v-if="!pending">
            <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
                <ul class="intro-y mt-5 grid grid-cols-12 gap-3 sm:gap-6">
                    <li v-for="row in rows.data" :key="row.id" class="intro-y col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2">
                        <div class="box relative rounded-md px-3 pb-5 pt-8 sm:px-5 hover:scale-105 ease-in-out duration-300">
                            <div class="mx-auto w-3/5">
                                <div class="relative block bg-center bg-no-repeat bg-contain before:content-[''] before:pt-[100%] before:w-full before:block">
                                    <div class="image-fit absolute left-0 top-0 h-full w-full">
                                        <img class="rounded-md" :src="row.fullUrl" :alt="row.name" />
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 block truncate text-center font-medium" href="">{{ row.name }}</div>
                            <div class="mt-0.5 text-center text-xs text-slate-500">{{ formatFileSize(row.size) }}</div>
                            <button class="absolute right-3 top-3 z-50">
                                <Icon name="solar:menu-dots-bold" class="w-5 h-5 rotate-90 ease-in-out duration-300 opacity-75" />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
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
    </div>
</template>
