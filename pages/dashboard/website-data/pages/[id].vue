<script setup>
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
const route = useRoute();

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
    title: 'Page Edit',
});

const formLoading = ref(false);

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
const p$ = useVuelidate(rules, page.value);

async function updateItem() {
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
    const { data, error } = await useApiFetch(`/api/page/${route.params.id}`, {
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
</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <div class="text-lg font-medium">Edit Page</div>
            <div>
                <button class="btn btn-primary" @click="updateItem">Update Page Details</button>
            </div>
        </div>
        <div v-if="page" class="grid lg:grid-cols-12 gap-5 items-start">
            <div class="lg:col-span-8 grid lg:grid-cols-12 gap-2 items-center">
                <FormInputField v-model="page.title" name="title" :errors="p$.title.$errors" placeholder="Title" label="Title" class="lg:col-span-12" description="This will be used for Page Title tag in SEO" />
                <FormInputField v-model="page.name" name="name" :errors="p$.name.$errors" placeholder="Name" label="Name" class="lg:col-span-12" description="This will be used for Admin dashboard index display" />
                <FormInputField v-model="page.keywords" name="keywords" type="textarea" :errors="p$.keywords.$errors" placeholder="Keywords" label="Keywords" class="lg:col-span-12" />
                <FormInputField v-model="page.description" name="description" type="textarea" :errors="p$.description.$errors" placeholder="Description" label="Description" class="lg:col-span-12" />
            </div>
            <div class="lg:col-span-4 space-y-5">
                <FormUploader v-model="page.image" :allowed-types="['image']" label="SEO Image Cover" name="image" class="lg:col-span-12" />
                <FormInputField v-model="page.slug" disabled readonly name="slug" :errors="p$.slug.$errors" placeholder="Slug" label="Slug" description="Must be unique and without any spaces for example: my-page-name" />
                <div data-tw-merge class="flex items-center gap-5 justify-between">
                    <label for="active-switch" class="cursor-pointer text-sm font-medium capitalize">
                        <span :class="[page.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="page.active ? 'Active' : 'Inactive'"></span>
                    </label>
                    <input id="active-switch" v-model="page.active" type="checkbox" class="form-checkbox-input" />
                </div>
                <FormInputField v-model="page.position" name="position" :errors="p$.position.$errors" placeholder="Position" label="Position" />
            </div>
        </div>
        <div v-if="page && page.sections">
            <div class="form-label">Sections</div>
            <div class="border rounded-lg p-5">
                <ul class="flex flex-col gap-3">
                    <li v-for="section in page.sections" :key="section.id" class="border px-5 py-3 bg-slate-50 rounded-lg">
                        <div class="grid lg:grid-cols-3 items-center lg:gap-5 gap-8">
                            <div>
                                <div>{{ section.name }}</div>
                                <div class="text-xs opacity-75 font-light">{{ section.slug }}</div>
                            </div>
                            <div class="lg:flex lg:justify-center">
                                <div data-tw-merge class="flex items-center gap-5">
                                    <input :id="'section-active-switch-' + section.slug" v-model="section.active" type="checkbox" class="form-checkbox-input" />
                                    <label :for="'section-active-switch-' + section.slug" class="cursor-pointer text-sm font-medium capitalize">
                                        <span :class="[section.active ? 'text-success' : 'text-danger', 'font-semibold transition-all']" v-html="section.active ? 'Active' : 'Inactive'"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="lg:flex lg:justify-end">
                                <button class="btn btn-secondary !px-6 btn-sm">Edit</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
