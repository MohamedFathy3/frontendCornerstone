<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'Home', link: '/', icon: 'ph:house-line-light' },
    { name: 'About', link: '/about', icon: 'ph:info-light' },
    { name: 'Services', link: '/services', icon: 'ph:grid-four-light' },
    { name: 'Gallery', link: '/gallery', icon: 'ph:panorama-light' },
]);

const contactButton = useSettingValue('header_button');

const brand = ref({
    name: useSettingValue('app_name') ?? 'Cornerstone Marine',
    logo: useSettingValue('app_logo'),
});
const contactModal = ref(false);

const contactForm = reactive({
    name: null,
    email: null,
    subject: null,
    content: null,
    countryId: null,
});

const formIsLoading = ref(false);
const settingStore = useSettingsStore();
const countryList = settingStore.countries;
const resetContactForm = async () => {
    v$.value.$reset();
    contactForm.name = null;
    contactForm.email = null;
    contactForm.subject = null;
    contactForm.content = null;
    contactForm.countryId = null;
};

const rules = reactive({
    name: { required: helpers.withMessage('Name is required', required) },
    email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Invalid email format', email) },
    subject: { required: helpers.withMessage('Subject is required', required) },
    content: { required: helpers.withMessage('Message is required', required) },
    countryId: { required: helpers.withMessage('Country is required', required) },
});
const v$ = useVuelidate(rules, contactForm);
async function closeContactModal() {
    contactModal.value = false;
    await resetContactForm();
}
function openContactModal() {
    contactModal.value = true;
}
async function sendMessage() {
    formIsLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formIsLoading.value = false;
        return false;
    }
    const { data, error } = await useApiFetch(`/api/contact-us`, { method: 'POST', lazy: true, body: contactForm });
    if (data.value) {
        useToast({ title: 'Sent Successfully', message: 'CSM will get in touch with you soon', type: 'success', duration: 5000 });
        await closeContactModal();
    }

    if (error.value) {
        useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
    formIsLoading.value = false;
}
</script>

<template>
    <div class="bg-white px-2 shadow-lg dark:bg-slate-900 -intro-y !z-[999]">
        <div class="mx-auto container px-8">
            <div class="flex items-center justify-between gap-8 duration-300 w-full">
                <div class="intro-x shrink-0">
                    <NuxtLink :to="'/'">
                        <NuxtImg v-if="brand.logo" quality="80" preload loading="lazy" width="100%" height="100%" class="h-14 w-full" :src="brand.logo" :alt="brand.name" :title="brand.name" />
                    </NuxtLink>
                </div>
                <ul class="flex items-center gap-4 text-[14px] xl:text-[16px]">
                    <template v-for="(item, index) in headerMenu" :key="index">
                        <li class="group relative">
                            <NuxtLink class="relative overflow-hidden flex items-center px-4 py-8" :to="item.link">
                                <Icon :name="item.icon" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                                <span class="z-20 font-semibold">{{ item.name }}</span>
                                <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                            </NuxtLink>
                        </li>
                    </template>
                </ul>
                <button :class="['group px-4 btn btn-' + contactButton.style]" @click="openContactModal">
                    <Icon v-if="contactButton.icon" :name="contactButton.icon" class="mr-2 h-5 w-5" />
                    {{ contactButton.label }}
                </button>
            </div>
        </div>
        <TheModal static size="3xl" :open-modal="contactModal" @close-modal="closeContactModal">
            <template #content>
                <div>
                    <div class="section-title">{{ useSettingValue('contact_form_title') ?? 'Inquiries' }}</div>
                    <div class="section-description text-sm mt-1">{{ useSettingValue('contact_form_description') }}</div>
                    <div class="mt-3 h-1 w-52 bg-warning" />
                </div>
                <form class="mt-5 grid gap-3" @submit.prevent="sendMessage">
                    <FormInputField v-model="contactForm.name" :disabled="formIsLoading" :errors="v$.name.$errors" placeholder="Name" name="name" />
                    <FormInputField v-model="contactForm.email" :disabled="formIsLoading" :errors="v$.email.$errors" placeholder="Email" type="email" name="email" />
                    <FormInputField v-model="contactForm.subject" :disabled="formIsLoading" :errors="v$.subject.$errors" placeholder="Subject" name="subject" />
                    <FormSelectField
                        v-model="contactForm.countryId"
                        :select-data="countryList"
                        labelvalue="name"
                        :disabled="formIsLoading"
                        keyvalue="id"
                        imgvalue="imageUrl"
                        name="country-name"
                        :errors="v$.countryId.$errors"
                        placeholder="Select your country"
                        rounded
                    />
                    <FormInputField v-model="contactForm.content" :disabled="formIsLoading" :errors="v$.content.$errors" placeholder="Message" name="content" type="textarea" />
                    <button :disabled="formIsLoading" class="w-full btn btn-primary px-6">{{ formIsLoading ? 'Sending Message...' : 'Send' }}</button>
                </form>
            </template>
        </TheModal>
    </div>
</template>
