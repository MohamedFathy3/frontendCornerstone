<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'Home', link: '/', icon: 'ph:house-line-light', subMenus: [] },
    { name: 'About', link: '/about', icon: 'ph:info-light', subMenus: [] },
    { name: 'Aplay_Job', link: '/empley', icon: 'ph:info-light', subMenus: [] },
    { name: 'company_Login', link: '/company', icon: 'ph:info-light', subMenus: [] },
    {
        name: 'Services',
        link: '/services',
        icon: 'ph:grid-four-light',
        subMenus: [
            {
                name: 'Consolidation Service',
                link: '/services/consolidation-service',
                icon: 'ph:shipping-container-light',
            },
            { name: 'Ocean Freight', link: '/services/ocean-freight', icon: 'fluent:vehicle-ship-16-regular' },
            { name: 'Air Freight', link: '/services/air-freight', icon: 'iconoir:airplane' },
            { name: 'Cargo Insurance', link: '/services/cargo-insurance', icon: 'icon-park-outline:protect' },
            { name: 'Customs Brokerage', link: '/services/customs-brokerage', icon: 'guidance:customs' },
            {
                name: 'Bonded Warehousing',
                link: '/services/bonded-warehousing',
                icon: 'material-symbols:warehouse-outline-rounded',
            },
        ],
    },
    // { name: 'Gallery', link: '/gallery', icon: 'ph:panorama-light' },
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
    email: {
        required: helpers.withMessage('Email is required', required),
        email: helpers.withMessage('Invalid email format', email),
    },
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
        useToast({
            title: 'Sent Successfully',
            message: 'CSM will get in touch with you soon',
            type: 'success',
            duration: 5000,
        });
        await closeContactModal();
    }

    if (error.value) {
        useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
    formIsLoading.value = false;
}

const route = useRoute();

const isMenuOpen = ref(false);

function desktopDropDownMenu() {
    isMenuOpen.value = !isMenuOpen.value;
}

watch(
    () => route.path,
    (newPath, oldPath) => {
        if (newPath !== oldPath) {
            isMenuOpen.value = false;
        }
    },
);
</script>

<template>
    <div class="bg-white px-2 shadow-lg dark:bg-slate-900 -intro-y !z-[999]">
        <div class="mx-auto container px-8">
            <div class="flex items-center justify-between gap-8 duration-300 w-full">
                <div class="intro-x shrink-0">
                    <NuxtLink :to="'/'">
                        <NuxtImg v-if="brand.logo" :alt="brand.name" :src="brand.logo" :title="brand.name" class="h-14 w-full" height="100%" loading="lazy" preload quality="80" width="100%" />
                    </NuxtLink>
                </div>
                <ul class="md:flex items-center gap-4 text-[14px] xl:text-[16px] hidden">
                    <template v-for="item in headerMenu" :key="item.link">
                        <li v-if="item.subMenus.length === 0" class="group relative">
                            <NuxtLink :to="item.link" class="relative overflow-hidden flex items-center px-4 py-8">
                                <Icon :name="item.icon" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                                <span class="z-20 font-semibold">{{ item.name }}</span>
                                <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                            </NuxtLink>
                        </li>

                        <HeadlessMenu v-else as="li" class="relative inline-block text-left">
                            <div>
                                <HeadlessMenuButton @click="desktopDropDownMenu">
                                    <div class="group relative overflow-hidden flex items-center px-4 py-8">
                                        <Icon :name="item.icon" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                                        <span class="z-20 font-semibold">{{ item.name }}</span>
                                        <Icon :class="[isMenuOpen && 'rotate-90', 'z-20 ml-2 h-6 w-6 text-slate-600 ease-in-out duration-300']" name="ion:md-arrow-dropdown" />
                                        <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                                    </div>
                                </HeadlessMenuButton>
                            </div>

                            <TransitionExpand>
                                <div v-show="isMenuOpen">
                                    <HeadlessMenuItems class="absolute right-0 mt-2 p-1.5 w-64 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" static>
                                        <div class="p-1.5">
                                            <template v-for="subItem in item.subMenus" :key="subItem.link">
                                                <HeadlessMenuItem v-slot="{ active }">
                                                    <div class="p-1">
                                                        <NuxtLink :class="[active ? 'bg-primary text-white' : '', 'group flex w-full items-center rounded-md px-2 py-2 gap-3']" :to="subItem.link">
                                                            <Icon :name="subItem.icon" class="shrink-0 size-5 opacity-75" />
                                                            <span>{{ subItem.name }}</span>
                                                        </NuxtLink>
                                                    </div>
                                                </HeadlessMenuItem>
                                            </template>
                                        </div>
                                    </HeadlessMenuItems>
                                </div>
                            </TransitionExpand>
                        </HeadlessMenu>
                    </template>
                </ul>
                <button :class="['group px-4 btn btn-' + contactButton.style]" @click="openContactModal">
                    <Icon v-if="contactButton.icon" :name="contactButton.icon" class="mr-2 h-5 w-5" />
                    {{ contactButton.label }}
                </button>
            </div>
        </div>
        <TheModal :open-modal="contactModal" size="3xl" static @close-modal="closeContactModal">
            <template #content>
                <div>
                    <div class="section-title">{{ useSettingValue('contact_form_title') ?? 'Inquiries' }}</div>
                    <div class="section-description text-sm mt-1">{{ useSettingValue('contact_form_description') }}</div>
                    <div class="mt-3 h-1 w-52 bg-warning" />
                </div>
                <form class="mt-5 grid gap-3" @submit.prevent="sendMessage">
                    <FormInputField v-model="contactForm.name" :disabled="formIsLoading" :errors="v$.name.$errors" name="name" placeholder="Name" />
                    <FormInputField v-model="contactForm.email" :disabled="formIsLoading" :errors="v$.email.$errors" name="email" placeholder="Email" type="email" />
                    <FormInputField v-model="contactForm.subject" :disabled="formIsLoading" :errors="v$.subject.$errors" name="subject" placeholder="Subject" />
                    <FormSelectField
                        v-model="contactForm.countryId"
                        :disabled="formIsLoading"
                        :errors="v$.countryId.$errors"
                        :select-data="countryList"
                        imgvalue="imageUrl"
                        keyvalue="id"
                        labelvalue="name"
                        name="country-name"
                        placeholder="Select your country"
                    />
                    <FormInputField v-model="contactForm.content" :disabled="formIsLoading" :errors="v$.content.$errors" name="content" placeholder="Message" type="textarea" />
                    <button :disabled="formIsLoading" class="w-full btn btn-primary px-6">
                        {{ formIsLoading ? 'Sending Message...' : 'Send' }}
                    </button>
                </form>
            </template>
        </TheModal>
    </div>
</template>
