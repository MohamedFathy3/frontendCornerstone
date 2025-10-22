<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'Home', link: '/', icon: 'ph:house-line-light', subMenus: [] },
    { name: 'About', link: '/about', icon: 'ph:info-light', subMenus: [] },

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

// إضافة متغير للتحكم في قائمة الهاتف
const mobileMenuOpen = ref(false);

// دالة لفتح/إغلاق قائمة الهاتف
function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
}

// إضافة حالة المستخدم
const user = ref(null); // سيتم تعبئتها من الـ auth
const isLoggedIn = computed(() => !!user.value);

// دالة للتحقق من حالة المستخدم (ستحتاج لتعديلها حسب نظامك)
const checkAuth = async () => {
    // هنا ضع الكود للتحقق من حالة تسجيل الدخول
    // مثال: 
    // const { data } = await useApiFetch('/api/user');
    // user.value = data.value;
};

onMounted(() => {
    checkAuth();
});

watch(
    () => route.path,
    () => {
        isMenuOpen.value = false;
        mobileMenuOpen.value = false;
    },
);
</script>

<template>
    <div class="bg-white px-2 shadow-lg dark:bg-slate-900 -intro-y !z-[999]">
        <div class="mx-auto container px-4 md:px-8">
            <div class="flex items-center justify-between gap-4 md:gap-8 duration-300 w-full">
                <!-- الشعار -->
                <div class="intro-x shrink-0">
                    <NuxtLink :to="'/'">
                        <NuxtImg v-if="brand.logo" :alt="brand.name" :src="brand.logo" :title="brand.name" class="h-10 md:h-14 w-full" height="100%" loading="lazy" preload quality="80" width="100%" />
                    </NuxtLink>
                </div>

                <!-- قائمة الهواتف - أيقونة القائمة -->
                <div class="md:hidden flex items-center gap-2">
                    <!-- زر Login/Profile للهواتف -->
                    <NuxtLink v-if="isLoggedIn" to="/profile" class="btn btn-sm btn-outline">
                        <Icon name="ph:user-light" class="h-4 w-4" />
                    </NuxtLink>
                    <NuxtLink v-else to="/auth" class="btn btn-sm btn-outline">
                        <Icon name="ph:sign-in-light" class="h-4 w-4" />
                    </NuxtLink>

                    <!-- الأزرار المهمة للهواتف -->
                    <button class="btn btn-sm btn-outline" @click="openContactModal">
                        <Icon name="ph:phone-light" class="h-4 w-4" />
                    </button>

                    <!-- زر قائمة الهاتف -->
                    <button class="btn btn-sm btn-outline" @click="toggleMobileMenu">
                        <Icon :name="mobileMenuOpen ? 'ph:x-light' : 'ph:list-light'" class="h-4 w-4" />
                    </button>
                </div>

                <!-- قائمة سطح المكتب -->
                <ul class="hidden md:flex items-center gap-4 text-[14px] xl:text-[16px]">
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
                    
                    <!-- إضافة زر Contact Us بجانب Services -->
                    <li class="group relative">
                        <button class="group relative overflow-hidden flex items-center px-4 py-8" @click="openContactModal">
                            <Icon name="ph:phone-light" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                            <span class="z-20 font-semibold">Contact Us</span>
                            <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                        </button>
                    </li>
                </ul>

                <!-- الأزرار الهامة - سطح المكتب -->
                <div class="hidden md:flex items-center gap-3">
                    <!-- زر Login/Profile -->
                    <NuxtLink v-if="isLoggedIn" to="/profile" class="btn btn-outline btn-sm">
                        <Icon name="ph:user-light" class="mr-2 h-4 w-4" />
                        Profile
                    </NuxtLink>
                    <NuxtLink v-else to="/auth" class="btn btn-outline btn-sm">
                        <Icon name="ph:sign-in-light" class="mr-2 h-4 w-4" />
                        Login
                    </NuxtLink>

                    <!-- زر Aplay_Job -->
                    <NuxtLink to="/empley" class="btn btn-outline btn-sm">
                        <Icon name="ph:briefcase-light" class="mr-2 h-4 w-4" />
                        Aplay Job
                    </NuxtLink>

                    <!-- زر company_Login -->
                    <NuxtLink to="/company" class="btn btn-outline btn-sm">
                        <Icon name="ph:buildings-light" class="mr-2 h-4 w-4" />
                        Company Login
                    </NuxtLink>
                </div>
            </div>

            <!-- قائمة الهواتف المنزلقة -->
            <Transition name="slide-down">
                <div v-if="mobileMenuOpen" class="md:hidden bg-white shadow-lg mt-2 rounded-lg py-4">
                    <ul class="space-y-2">
                        <template v-for="item in headerMenu" :key="item.link">
                            <li v-if="item.subMenus.length === 0">
                                <NuxtLink :to="item.link" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" @click="toggleMobileMenu">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">{{ item.name }}</span>
                                </NuxtLink>
                            </li>

                            <li v-else>
                                <div class="px-4 py-3 font-medium text-gray-700 flex items-center">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span>{{ item.name }}</span>
                                </div>
                                <ul class="ml-8 space-y-1 mt-1">
                                    <li v-for="subItem in item.subMenus" :key="subItem.link">
                                        <NuxtLink :to="subItem.link" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click="toggleMobileMenu">
                                            <Icon :name="subItem.icon" class="mr-3 h-4 w-4" />
                                            <span class="text-sm">{{ subItem.name }}</span>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                        </template>

                        <!-- إضافة زر Contact Us في قائمة الهاتف -->
                        <li>
                            <button class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left" @click="openContactModal; toggleMobileMenu();">
                                <Icon name="ph:phone-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Contact Us</span>
                            </button>
                        </li>

                        <!-- زر Login/Profile في قائمة الهاتف -->
                        <li>
                            <NuxtLink v-if="isLoggedIn" to="/profile" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" @click="toggleMobileMenu">
                                <Icon name="ph:user-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Profile</span>
                            </NuxtLink>
                            <NuxtLink v-else to="/login" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg" @click="toggleMobileMenu">
                                <Icon name="ph:sign-in-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Login</span>
                            </NuxtLink>
                        </li>

                        <!-- الأزرار المهمة في قائمة الهاتف -->
                        <li class="border-t pt-3 mt-3">
                            <NuxtLink to="/empley" class="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg mb-2" @click="toggleMobileMenu">
                                <Icon name="ph:briefcase-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Aplay Job</span>
                            </NuxtLink>
                            <NuxtLink to="/company" class="flex items-center px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg" @click="toggleMobileMenu">
                                <Icon name="ph:buildings-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Company Login</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>

        <!-- نافذة الاتصال (تبقى كما هي) -->
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

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>