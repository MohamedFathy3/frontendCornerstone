<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'Hjem', link: '/', icon: 'ph:house-line-light', subMenus: [] },
    { name: 'Om Os', link: '/about', icon: 'ph:info-light', subMenus: [] },
    {
        name: 'Services',
        link: '/services',
        icon: 'ph:grid-four-light',
        subMenus: [
            {
                name: 'Konsolidering Service',
                link: '/services/consolidation-service',
                icon: 'ph:shipping-container-light',
            },
            { name: 'Søfragt', link: '/services/ocean-freight', icon: 'fluent:vehicle-ship-16-regular' },
            { name: 'Luftfragt', link: '/services/air-freight', icon: 'iconoir:airplane' },
            { name: 'Cargo Forsikring', link: '/services/cargo-insurance', icon: 'icon-park-outline:protect' },
            { name: 'Toldformidling', link: '/services/customs-brokerage', icon: 'guidance:customs' },
            {
                name: 'Bonded Lager',
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
    name: { required: helpers.withMessage('Navn er påkrævet', required) },
    email: {
        required: helpers.withMessage('E-mail er påkrævet', required),
        email: helpers.withMessage('Ugyldig e-mail format', email),
    },
    subject: { required: helpers.withMessage('Emne er påkrævet', required) },
    content: { required: helpers.withMessage('Besked er påkrævet', required) },
    countryId: { required: helpers.withMessage('Land er påkrævet', required) },
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
            title: 'Sendt Succesfuldt',
            message: 'CSM vil kontakte dig snart',
            type: 'success',
            duration: 5000,
        });
        await closeContactModal();
    }

    if (error.value) {
        useToast({ title: 'Fejl', message: error.value.message, type: 'error', duration: 5000 });
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

// حالة المستخدم من الكوكيز
const userData = useCookie('user_data');
const userType = useCookie('user_type');
const authToken = useCookie('auth_token');

// computed لحالة تسجيل الدخول
const isLoggedIn = computed(() => {
    return !!authToken.value && !!userData.value;
});

// computed لنوع المستخدم
const userRole = computed(() => {
    return userType.value || null;
});

// دالة تسجيل الخروج
const logout = async () => {
    const tokenCookie = useCookie('auth_token');
    const userCookie = useCookie('user_data');
    const userTypeCookie = useCookie('user_type');
    const employeeIdCookie = useCookie('employee_id');

    // مسح الكوكيز
    tokenCookie.value = null;
    userCookie.value = null;
    userTypeCookie.value = null;
    employeeIdCookie.value = null;

    // إعادة تحميل الصفحة
    window.location.href = '/';
};

onMounted(() => {
    // أي كود إضافي عند التحميل
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
                <div class="lg:hidden flex items-center gap-2">
                    <!-- زر Login/Profile للهواتف -->
                    <NuxtLink v-if="isLoggedIn" :to="userRole === 'employee' ? '/profile' : '/profile'" class="btn btn-sm btn-outline">
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

                <!-- قائمة سطح المكتب - للشاشات المتوسطة والكبيرة -->
                <ul class="hidden lg:flex items-center gap-4 text-[14px] xl:text-[16px]">
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
                            <span class="z-20 font-semibold">Kontakt Os</span>
                            <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                        </button>
                    </li>
                </ul>

                <!-- الأزرار الهامة - سطح المكتب -->
                <div class="hidden lg:flex items-center gap-3">
                    <!-- زر Login/Profile -->
                    <template v-if="isLoggedIn">
                        <NuxtLink :to="userRole === 'employee' ? '/employee/profile' : '/profile'" class="btn btn-outline btn-sm">
                            <Icon name="ph:user-light" class="mr-2 h-4 w-4" />
                            Profil
                        </NuxtLink>
                        <button class="btn btn-outline btn-sm btn-error" @click="logout">
                            <Icon name="ph:sign-out-light" class="mr-2 h-4 w-4" />
                            Log Ud
                        </button>
                    </template>
                    <template v-else>
                        <NuxtLink to="/auth" class="btn btn-outline btn-sm">
                            <Icon name="ph:sign-in-light" class="mr-2 h-4 w-4" />
                            Log Ind
                        </NuxtLink>

                        <!-- زر Aplay_Job - يظهر فقط إذا لم يكن المستخدم مسجل دخول -->
                        <NuxtLink to="/empley" class="btn btn-outline btn-sm">
                            <Icon name="ph:briefcase-light" class="mr-2 h-4 w-4" />
                            Ansøg Job
                        </NuxtLink>

                        <!-- زر company_Login - يظهر فقط إذا لم يكن المستخدم مسجل دخول -->
                        <NuxtLink to="/company" class="btn btn-outline btn-sm">
                            <Icon name="ph:buildings-light" class="mr-2 h-4 w-4" />
                            Virksomhed
                        </NuxtLink>
                    </template>
                </div>
            </div>

            <!-- قائمة الهواتف المنزلقة -->
            <Transition name="slide-down">
                <div v-if="mobileMenuOpen" class="lg:hidden bg-white shadow-lg mt-2 rounded-lg py-4 border border-gray-200">
                    <ul class="space-y-2">
                        <template v-for="item in headerMenu" :key="item.link">
                            <li v-if="item.subMenus.length === 0">
                                <NuxtLink :to="item.link" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" @click="toggleMobileMenu">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">{{ item.name }}</span>
                                </NuxtLink>
                            </li>

                            <li v-else>
                                <div class="px-4 py-3 font-medium text-gray-700 flex items-center">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span>{{ item.name }}</span>
                                </div>
                                <ul class="ml-6 space-y-1 mt-1 border-l-2 border-gray-100 pl-2">
                                    <li v-for="subItem in item.subMenus" :key="subItem.link">
                                        <NuxtLink :to="subItem.link" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" @click="toggleMobileMenu">
                                            <Icon :name="subItem.icon" class="mr-3 h-4 w-4" />
                                            <span class="text-sm">{{ subItem.name }}</span>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                        </template>

                        <!-- إضافة زر Contact Us في قائمة الهاتف -->
                        <li>
                            <button class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left transition-colors" @click="openContactModal(); toggleMobileMenu();">
                                <Icon name="ph:phone-light" class="mr-3 h-5 w-5" />
                                <span class="font-medium">Kontakt Os</span>
                            </button>
                        </li>

                        <!-- زر Login/Profile في قائمة الهاتف -->
                        <li class="border-t border-gray-200 pt-3 mt-3">
                            <template v-if="isLoggedIn">
                                <NuxtLink :to="userRole === 'employee' ? '/profile' : '/profile'" class="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" @click="toggleMobileMenu">
                                    <Icon name="ph:user-light" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">Profil</span>
                                </NuxtLink>
                                <button class="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full text-left transition-colors" @click="logout(); toggleMobileMenu();">
                                    <Icon name="ph:sign-out-light" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">Log Ud</span>
                                </button>
                            </template>
                            <template v-else>
                                <NuxtLink to="/auth" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" @click="toggleMobileMenu">
                                    <Icon name="ph:sign-in-light" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">Log Ind</span>
                                </NuxtLink>
                            </template>
                        </li>

                        <!-- الأزرار المهمة في قائمة الهاتف - تظهر فقط إذا لم يكن المستخدم مسجل دخول -->
                        <template v-if="!isLoggedIn">
                            <li class="border-t border-gray-200 pt-3 mt-3">
                                <NuxtLink to="/empley" class="flex items-center px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg mb-2 transition-colors" @click="toggleMobileMenu">
                                    <Icon name="ph:briefcase-light" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">Ansøg Job</span>
                                </NuxtLink>
                                <NuxtLink to="/company" class="flex items-center px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" @click="toggleMobileMenu">
                                    <Icon name="ph:buildings-light" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">Virksomhed Login</span>
                                </NuxtLink>
                            </li>
                        </template>
                    </ul>
                </div>
            </Transition>
        </div>

        <!-- نافذة الاتصال (باللغة الدنماركية) -->
        <TheModal :open-modal="contactModal" size="3xl" static @close-modal="closeContactModal">
            <template #content>
                <div>
                    <div class="section-title">{{ useSettingValue('contact_form_title') ?? 'Forespørgsler' }}</div>
                    <div class="section-description text-sm mt-1">{{ useSettingValue('contact_form_description') || 'Kontakt os for mere information' }}</div>
                    <div class="mt-3 h-1 w-52 bg-warning" />
                </div>
                <form class="mt-5 grid gap-3" @submit.prevent="sendMessage">
                    <FormInputField v-model="contactForm.name" :disabled="formIsLoading" :errors="v$.name.$errors" name="name" placeholder="Navn" />
                    <FormInputField v-model="contactForm.email" :disabled="formIsLoading" :errors="v$.email.$errors" name="email" placeholder="E-mail" type="email" />
                    <FormInputField v-model="contactForm.subject" :disabled="formIsLoading" :errors="v$.subject.$errors" name="subject" placeholder="Emne" />
                    <FormSelectField
                        v-model="contactForm.countryId"
                        :disabled="formIsLoading"
                        :errors="v$.countryId.$errors"
                        :select-data="countryList"
                        imgvalue="imageUrl"
                        keyvalue="id"
                        labelvalue="name"
                        name="country-name"
                        placeholder="Vælg dit land"
                    />
                    <FormInputField v-model="contactForm.content" :disabled="formIsLoading" :errors="v$.content.$errors" name="content" placeholder="Besked" type="textarea" />
                    <button :disabled="formIsLoading" class="w-full btn btn-primary px-6">
                        {{ formIsLoading ? 'Sender Besked...' : 'Send' }}
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
    max-height: 500px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}

/* تحسينات للـ responsive */
@media (max-width: 1024px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

@media (max-width: 768px) {
    .container {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

/* تحسينات للشاشات المتوسطة (600px - 1200px) */
@media (min-width: 601px) and (max-width: 1199px) {
    .hidden.lg\\:flex {
        display: none !important;
    }
    
    .lg\\:hidden {
        display: flex !important;
    }
}

/* تحسينات للهواتف */
@media (max-width: 600px) {
    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
    }
    
    .h-10 {
        height: 2.5rem;
    }
    
    .h-14 {
        height: 3.5rem;
    }
}
</style>