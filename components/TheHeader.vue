<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'Hjem', link: '/', icon: 'ph:house-line-light' },
    { name: 'Om Os', link: '/about', icon: 'ph:info-light' },
    { name: 'partnere', link: '#services', icon: 'ph:grid-four-light' },
    { name: 'Kontakt', link: '#contact', icon: 'ph:phone-light' },
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

// إضافة متغير للتحكم في قائمة الهاتف
const mobileMenuOpen = ref(false);

// دالة لفتح/إغلاق قائمة الهاتف
function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
}

// دالة للتنقل إلى السكشن - معدلة للذهاب إلى موقع محدد
function scrollToSection(sectionId) {
    // إذا كان sectionId هو #services (partnere) نذهب إلى scrollY 1080
    if (sectionId === '#services') {
        if (route.path !== '/') {
            // إذا لم نكن في الصفحة الرئيسية، انتقل إلى الصفحة الرئيسية أولاً
            navigateTo('/');
            // بعد الانتظار قليلاً، انتقل إلى الموقع المحدد
            setTimeout(() => {
                window.scrollTo({
                    top: 1080,
                    behavior: 'smooth'
                });
            }, 500);
        } else {
            // إذا كنا في الصفحة الرئيسية، انتقل مباشرة إلى الموقع المحدد
            window.scrollTo({
                top: 1080,
                behavior: 'smooth'
            });
        }
    } else {
        // للروابط الأخرى، استخدم السلوك العادي
        if (route.path !== '/') {
            navigateTo('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        } else {
            const element = document.getElementById(sectionId.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    // أغلق القائمة على الهاتف
    mobileMenuOpen.value = false;
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
                        <li v-if="item.link.startsWith('#')" class="group relative">
                            <button class="relative overflow-hidden flex items-center px-4 py-8 cursor-pointer" @click="scrollToSection(item.link)">
                                <Icon :name="item.icon" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                                <span class="z-20 font-semibold">{{ item.name }}</span>
                                <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                            </button>
                        </li>
                        
                        <li v-else class="group relative">
                            <NuxtLink :to="item.link" class="relative overflow-hidden flex items-center px-4 py-8">
                                <Icon :name="item.icon" class="z-20 mr-2 h-6 w-6 text-slate-600" />
                                <span class="z-20 font-semibold">{{ item.name }}</span>
                                <div class="z-10 absolute bottom-0 left-0 h-0 w-full bg-slate-200 transition-all duration-300 group-hover:h-full" />
                            </NuxtLink>
                        </li>
                    </template>
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
                            <li v-if="item.link.startsWith('#')">
                                <button class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left transition-colors" @click="scrollToSection(item.link)">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">{{ item.name }}</span>
                                </button>
                            </li>
                            
                            <li v-else>
                                <NuxtLink :to="item.link" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" @click="toggleMobileMenu">
                                    <Icon :name="item.icon" class="mr-3 h-5 w-5" />
                                    <span class="font-medium">{{ item.name }}</span>
                                </NuxtLink>
                            </li>
                        </template>

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