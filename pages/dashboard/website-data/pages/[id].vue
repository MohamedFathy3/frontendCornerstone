<script setup>
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const route = useRoute();

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
    title: 'Page Edit',
});

const {
    data: page,
    pending,
    refresh,
} = await useApiFetch(`/api/page/${route.params.id}`, {
    lazy: true,
    transform: (page) => {
        return page.data;
    },
});

async function updateItem() {
    if (!page.value.name || !page.value.title || !page.value.slug) {
        return false;
    }
    const { name, title, slug, keywords, description, active, position, image } = page.value;

    const pageValue = {
        name,
        title,
        slug,
        keywords,
        description,
        active,
        position,
        image,
    };
    const { data, error } = await useApiFetch(`/api/page/${page.value.id}`, {
        method: 'PATCH',
        body: pageValue,
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

// Sections Functions
const isOpen = ref(false);
const formLoading = ref(false);
const editMode = ref(false);

const sectionValue = ref({
    id: null,
    name: null,
    slug: null,
    postTitle: null,
    title: null,
    subTitle: null,
    description: null,
    shortDescription: null,
    videoUrl: null,
    buttonOneActive: false,
    buttonTwoActive: false,
    buttonOne: {
        label: null,
        url: null,
        target: null,
        icon: null,
        style: null,
    },
    buttonTwo: {
        label: null,
        url: null,
        target: null,
        icon: null,
        style: null,
    },
    divider: {
        active: null,
        position: null,
        style: null,
    },
    useDefault: true,
    active: true,
    items: [],
    position: null,
    pageId: route.params.id,
    image: null,
});
const item = ref({
    name: null,
    icon: null,
    url: null,
    shortDescription: null,
    description: null,
    position: null,
    sectionId: null,
    image: null,
});
const rules = ref({
    name: { required },
    slug: { required },
});

async function openModal(index) {
    // Shallow copy of section object
    sectionValue.value = { ...page.value.sections[index] };
    formLoading.value = true;
    editMode.value = false;
    formLoading.value = false;
    isOpen.value = true;
}

async function resetSectionValues() {
    sectionValue.value.id = null;
    sectionValue.value.name = null;
    sectionValue.value.slug = null;
    sectionValue.value.postTitle = null;
    sectionValue.value.title = null;
    sectionValue.value.subTitle = null;
    sectionValue.value.description = null;
    sectionValue.value.shortDescription = null;
    sectionValue.value.videoUrl = null;
    sectionValue.value.buttonOneActive = false;
    sectionValue.value.buttonTwoActive = false;
    sectionValue.value.buttonOne = {
        label: null,
        url: null,
        target: null,
        icon: null,
        style: null,
    };
    sectionValue.value.buttonTwo = {
        label: null,
        url: null,
        target: null,
        icon: null,
        style: null,
    };
    sectionValue.value.divider = {
        active: null,
        position: null,
        style: null,
    };
    sectionValue.value.useDefault = true;
    sectionValue.value.active = true;
    sectionValue.value.items = [];
    sectionValue.value.position = null;
    sectionValue.value.pageId = null;
    sectionValue.value.imageUrl = null;
    sectionValue.value.image = null;
}

const s$ = useVuelidate(rules, sectionValue.value);

async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    s$.value.$reset();
    await resetSectionValues();
}

const buttonStyles = ref([
    { name: 'Primary', id: 'primary' },
    { name: 'Secondary', id: 'secondary' },
    { name: 'Success', id: 'success' },
    { name: 'Yellow', id: 'warning' },
    { name: 'Red', id: 'danger' },
    { name: 'Dark', id: 'dark' },
]);
const buttonTargets = ref([
    { name: 'Self (Same Tab)', id: '_self' },
    { name: 'New Tab', id: '_blank' },
]);

const toggleSectionActiveStatus = async (id) => {
    const { data, error } = await useApiFetch(`/api/section/${id}/active`, {
        lazy: true,
        method: 'PATCH',
    });

    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};

async function updateSection() {
    if (!sectionValue.value.name || !sectionValue.value.slug) {
        return false;
    }
    const { id, name, slug, postTitle, title, subTitle, description, shortDescription, videoUrl, buttonOneActive, buttonTwoActive, buttonOne, buttonTwo, divider, useDefault, active, items, position, pageId, image } = sectionValue.value;

    const finalData = {
        id,
        name,
        slug,
        postTitle,
        title,
        subTitle,
        description,
        shortDescription,
        videoUrl,
        buttonOneActive,
        buttonTwoActive,
        buttonOne,
        buttonTwo,
        divider,
        useDefault,
        active,
        items,
        position,
        pageId,
        image,
    };
    const { data, error } = await useApiFetch(`/api/section/${sectionValue.value.id}`, {
        method: 'PATCH',
        body: finalData,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await refresh();
        await closeModal();
    }
    console.log("datasss", data)

    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}
</script>

<template>
    <div class="flex flex-col gap-5">
        <form class="flex flex-col gap-5" @submit.prevent="updateItem">
            <div class="flex items-center justify-between">
                <div class="text-lg font-medium">Edit Page</div>
                <div>
                    <button class="btn btn-primary" type="submit">Update Page Details</button>
                </div>
            </div>
            <div v-if="page" class="grid lg:grid-cols-12 gap-5 items-start">
                <div class="lg:col-span-8 grid lg:grid-cols-12 gap-2 items-center">
                    <FormInputField v-model="page.title" class="lg:col-span-12" description="This will be used for Page Title tag in SEO" label="Title" name="title" placeholder="Title" required />
                    <FormInputField v-model="page.name" class="lg:col-span-12" description="This will be used for Admin dashboard index display" label="Name" name="name" placeholder="Name" required />
                    <FormInputField v-model="page.keywords" class="lg:col-span-12" label="Keywords" name="keywords" placeholder="Keywords" type="textarea" />
                    <FormInputField v-model="page.description" class="lg:col-span-12" label="Description" name="description" placeholder="Description" type="textarea" />
                </div>
                <div class="lg:col-span-4 space-y-5">
                    <FormUploader v-model="page.image" :allowed-types="['image', 'svg']" class="lg:col-span-12" label="SEO Image Cover" name="image" />
                    <FormInputField v-model="page.slug" description="Must be unique and without any spaces for example: my-page-name" disabled label="Slug" name="slug" placeholder="Slug" readonly required />
                    <div class="flex items-center gap-5 justify-between" data-tw-merge>
                        <label class="cursor-pointer text-sm font-medium capitalize" for="active-switch">
                            <span :class="[page.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="page.active ? 'Active' : 'Inactive'"></span>
                        </label>
                        <input id="active-switch" v-model="page.active" class="form-checkbox-input" type="checkbox" />
                    </div>
                    <FormInputField v-model="page.position" label="Position" name="position" placeholder="Position" />
                </div>
            </div>
        </form>
        <div v-if="page && page.sections">
            <div class="form-label">Sections</div>
            <div class="border rounded-lg p-5">
                <ul class="flex flex-col gap-3">
                    <li v-for="(section, pageIndex) in page.sections" :key="pageIndex" class="border px-5 py-3 bg-slate-50 rounded-lg">
                        <div class="grid lg:grid-cols-3 items-center lg:gap-5 gap-8">
                            <div class="flex items-center gap-5">
                                <div class="w-20 h-10">
                                    <NuxtImg v-if="section.imageUrl" :alt="section.name" :src="section.imageUrl" :title="section.name" class="w-20 h-10 object-cover bg-white !rounded-md zoom-in" />
                                </div>
                                <div>
                                    <div>{{ section.name }}</div>
                                    <div class="text-xs opacity-75 font-light">{{ section.slug }}</div>
                                </div>
                            </div>
                            <div class="lg:flex lg:justify-center">
                                <!-- <div class="flex items-center gap-5" data-tw-merge>
                                    <input :id="'section-active-switch-' + section.slug" v-model="section.active" class="form-checkbox-input" type="checkbox" @change="toggleSectionActiveStatus(section.id)" />
                                    <label :for="'section-active-switch-' + section.slug" class="cursor-pointer text-sm font-medium capitalize">
                                        <span :class="[section.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="section.active ? 'Active' : 'Inactive'"></span>
                                    </label>
                                </div> -->
                            </div>
                            <div class="lg:flex lg:justify-end">
                                <button class="btn btn-secondary !px-6 btn-sm" @click="openModal(pageIndex)">Edit</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <TheModal :open-modal="isOpen" size="4xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Section' : 'Add New Section'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div>
                    <div class="p-4 border rounded-xl mt-2 bg-slate-50">
                        <div class="grid lg:grid-cols-12 gap-5 items-center">
                            <FormInputField v-model="sectionValue.name" :errors="s$.name.$errors" class="lg:col-span-6" description="This will be used for Admin dashboard index display" label="Name" name="name" placeholder="Name" />
                            <FormInputField v-model="sectionValue.slug" :errors="s$.slug.$errors" class="lg:col-span-6" description="Must be unique and without any spaces for example: my-page-name" label="Slug" name="slug" placeholder="Slug" />
                            <FormUploader v-model="sectionValue.image" :allowed-types="['image', 'svg']" class="lg:col-span-12" label="Image" name="section-image" />

                            <FormInputField v-model="sectionValue.postTitle" class="lg:col-span-12" label="Post Title" name="post-title" placeholder="Post Title" />
                            <FormInputField v-model="sectionValue.title" class="lg:col-span-12" label="Title" name="title" placeholder="Title" />
                            <FormInputField v-model="sectionValue.subTitle" class="lg:col-span-12" label="SubTitle" name="sub-title" placeholder="SubTitle" />
                            <FormInputField v-model="sectionValue.description" class="lg:col-span-12" label="Description" name="description" placeholder="Description" type="textarea" />
                            <FormInputField v-model="sectionValue.shortDescription" class="lg:col-span-12" label="Short Description" name="short-description" placeholder="Short Description" type="textarea" />
                            <FormInputField v-model="sectionValue.videoUrl" class="lg:col-span-12" label="Video Url" name="video-url" placeholder="Video Url" />
                            <FormInputField v-model="sectionValue.position" class="lg:col-span-12" label="Position" name="position" placeholder="position" />

                            <div class="lg:col-span-6">
                                <div class="flex items-center" data-tw-merge>
                                    <input id="active-switch" v-model="sectionValue.active" class="form-checkbox-input" type="checkbox" />
                                    <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                                        <span :class="[sectionValue.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="sectionValue.active ? 'Active' : 'Inactive'"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="lg:col-span-12">
                                <div class="flex items-center" data-tw-merge>
                                    <input id="active-switch" v-model="sectionValue.buttonOneActive" class="form-checkbox-input" type="checkbox" />
                                    <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                                        <span :class="[sectionValue.buttonOneActive ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="sectionValue.buttonOneActive ? 'Button One Active' : 'Button One Inactive'"></span>
                                    </label>
                                </div>
                                <TransitionExpand>
                                    <div v-if="sectionValue.buttonOneActive" class="mt-3 rounded-md p-5 border bg-white grid grid-cols-12 gap-5 bg-slate-50">
                                        <FormInputField v-model="sectionValue.buttonOne.label" :name="sectionValue.slug + '-button-label-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Label" placeholder="Label" />
                                        <FormInputField v-model="sectionValue.buttonOne.icon" :name="sectionValue.slug + '-button-icon-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Icon" placeholder="Icon" />
                                        <FormSelectField
                                            v-model="sectionValue.buttonOne.style"
                                            :name="sectionValue.slug + '-button-style-' + sectionValue.id"
                                            :select-data="buttonStyles"
                                            class="col-span-12 sm:col-span-6"
                                            keyvalue="id"
                                            label="Style"
                                            labelvalue="name"
                                            placeholder="Style"
                                        />
                                        <FormSelectField
                                            v-model="sectionValue.buttonOne.target"
                                            :name="sectionValue.slug + '-button-target-' + sectionValue.id"
                                            :select-data="buttonTargets"
                                            class="col-span-12 sm:col-span-6"
                                            keyvalue="id"
                                            label="Target"
                                            labelvalue="name"
                                            placeholder="Url Target"
                                        />
                                        <FormInputField v-model="sectionValue.buttonOne.url" :name="sectionValue.slug + '-button-url-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Url" placeholder="Url" />
                                    </div>
                                </TransitionExpand>
                            </div>
                            <div class="lg:col-span-12">
                                <div class="flex items-center" data-tw-merge>
                                    <input id="active-switch" v-model="sectionValue.buttonTwoActive" class="form-checkbox-input" type="checkbox" />
                                    <label class="cursor-pointer ml-4 text-sm font-medium capitalize" for="active-switch">
                                        <span :class="[sectionValue.buttonTwoActive ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="sectionValue.buttonTwoActive ? 'Button Two Active' : 'Button Two Inactive'"></span>
                                    </label>
                                </div>
                                <TransitionExpand>
                                    <div v-if="sectionValue.buttonTwoActive" class="mt-3 rounded-md p-5 border bg-white grid grid-cols-12 gap-5 bg-slate-50">
                                        <FormInputField v-model="sectionValue.buttonTwo.label" :name="sectionValue.slug + '-button-label-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Label" placeholder="Label" />
                                        <FormInputField v-model="sectionValue.buttonTwo.icon" :name="sectionValue.slug + '-button-icon-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Icon" placeholder="Icon" />
                                        <FormSelectField
                                            v-model="sectionValue.buttonTwo.style"
                                            :name="sectionValue.slug + '-button-style-' + sectionValue.id"
                                            :select-data="buttonStyles"
                                            class="col-span-12 sm:col-span-6"
                                            keyvalue="id"
                                            label="Style"
                                            labelvalue="name"
                                            placeholder="Style"
                                        />
                                        <FormSelectField
                                            v-model="sectionValue.buttonTwo.target"
                                            :name="sectionValue.slug + '-button-target-' + sectionValue.id"
                                            :select-data="buttonTargets"
                                            class="col-span-12 sm:col-span-6"
                                            keyvalue="id"
                                            label="Target"
                                            labelvalue="name"
                                            placeholder="Url Target"
                                        />
                                        <FormInputField v-model="sectionValue.buttonTwo.url" :name="sectionValue.slug + '-button-url-' + sectionValue.id" class="col-span-12 sm:col-span-6" label="Url" placeholder="Url" />
                                    </div>
                                </TransitionExpand>
                            </div>
                            <div v-if="sectionValue.items.length > 0" class="lg:col-span-12">
                                <div class="form-label">Items</div>
                                <ul class="flex flex-col gap-5">
                                    <li v-for="(sectionItem, itemIndex) in sectionValue.items" :key="itemIndex" class="border px-5 py-3 bg-white rounded-lg">
                                        <FormInputField v-model="sectionItem.name" class="col-span-12 sm:col-span-6" label="Name" name="item-name" placeholder="Name" />
                                        <FormInputField v-model="sectionItem.shortDescription" class="col-span-12 sm:col-span-6" label="Short Description" name="item-short-description" placeholder="Short Description" />
                                        <FormInputField v-model="sectionItem.icon" class="col-span-12 sm:col-span-6" label="Icon" name="item-icon" placeholder="Icon" />
                                        <FormUploader v-model="sectionItem.image" :allowed-types="['image', 'svg']" class="lg:col-span-12" label="Image" name="item-image" />
                                        <FormInputField v-model="sectionItem.url" class="col-span-12 sm:col-span-6" label="URL" name="item-url" placeholder="url" />
                                        <FormInputField v-model="sectionItem.description" class="col-span-12 sm:col-span-6" label="Description" name="item-description" placeholder="Description" />
                                        <FormInputField v-model="sectionItem.position" class="col-span-12 sm:col-span-6" label="Position" name="item-position" placeholder="Position" />
                                    </li>
                                </ul>
                            </div>
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
                    <button :disabled="formLoading" class="btn btn-primary px-4" type="button" @click="updateSection()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
