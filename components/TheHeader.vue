<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const headerMenu = ref([
    { name: 'home', link: '/', icon: 'ph:house-line-light' },
    { name: 'about', link: '/about', icon: 'ph:info-light' },
    { name: 'project', link: '#services', icon: 'ph:grid-four-light' },
    { name: 'contact', link: '#contact', icon: 'ph:phone-light' },
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
    name: { required: helpers.withMessage('name er required', required) },
    email: {
        required: helpers.withMessage('E-mail er required', required),
        email: helpers.withMessage('email e-mail format', email),
    },
    subject: { required: helpers.withMessage('subject er required', required) },
    content: { required: helpers.withMessage('Besked er required', required) },
    countryId: { required: helpers.withMessage('Land er required', required) },
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
            message: 'CSM vil required dig snart',
            type: 'success',
            duration: 5000,
        });
        await closeContactModal();
    }

    if (error.value) {
        useToast({ title: 'tilte', message: error.value.message, type: 'error', duration: 5000 });
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

// دالة للتنقل إلى السكشن - معدلة
function scrollToSection(sectionId) {
    // ✅ التعديل هنا: إذا كان sectionId هو #contact افتح الـ modal
    if (sectionId === '#contact') {
        openContactModal();
        mobileMenuOpen.value = false;
        return;
    }
    
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
    <div class="bg-white shadow-lg dark:bg-slate-900 sticky top-0 z-50 w-full">
        <div class="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <!-- الشعار -->
                <div class="flex-shrink-0">
                    <NuxtLink to="/" class="flex items-center">
                        <NuxtImg 
                            v-if="brand.logo" 
                            :alt="brand.name" 
                            :src="brand.logo" 
                            :title="brand.name" 
                            class="h-8 w-auto sm:h-10 md:h-12"
                            height="100%" 
                            loading="lazy" 
                            preload 
                            quality="80" 
                            width="100%" 
                        />
                        <span v-else class="text-xl font-bold text-[#a93ecb]">{{ brand.name }}</span>
                    </NuxtLink>
                </div>

                <!-- قائمة سطح المكتب - للشاشات الكبيرة -->
                <nav class="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[#a93ecb]">
                    <template v-for="item in headerMenu" :key="item.link">
                        <div v-if="item.link.startsWith('#')" class="relative group text-[#a93ecb]">
                            <button 
                                @click="scrollToSection(item.link)"
                                class="flex items-center px-3 py-2 text-sm font-medium text-[#a93ecb] hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                            >
                                <Icon :name="item.icon" class="w-4 h-4 mr-2" />
                                {{ item.name }}
                            </button>
                        </div>
                        
                        <NuxtLink 
                            v-else 
                            :to="item.link"
                            class="flex items-center px-3 py-2 text-sm font-medium text-[#a93ecb] hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                        >
                            <Icon :name="item.icon" class="w-4 h-4 mr-2" />
                            {{ item.name }}
                        </NuxtLink>
                    </template>
                </nav>

                <!-- الأزرار الهامة - سطح المكتب -->
                <div class="hidden lg:flex items-center space-x-2">
                    <!-- زر الاتصال -->
                    

                    <!-- زر Login/Profile -->
                    <template v-if="isLoggedIn">
                       
                    </template>
                    <template v-else>
                    

                      

                        <NuxtLink 
                            to="/company" 
                            class="btn btn-outline btn-sm flex items-center"
                        >
                            <Icon name="ph:buildings-light" class="w-4 h-4 mr-1" />
                            application form
                        </NuxtLink>
                    </template>
                </div>

                <!-- قائمة الهواتف والتابلت -->
                <div class="flex lg:hidden items-center space-x-2">
                    <!-- زر الاتصال للهواتف -->
                    <button 
                        @click="openContactModal"
                        class="btn btn-ghost btn-sm p-2"
                    >
                        <Icon name="ph:phone-light" class="w-5 h-5" />
                    </button>

                    <!-- زر المستخدم للهواتف -->
                    <template v-if="isLoggedIn">
                        <NuxtLink 
                            :to="userRole === 'employee' ? '/profile' : '/profile'" 
                            class="btn btn-ghost btn-sm p-2"
                        >
                            <Icon name="ph:user-light" class="w-5 h-5" />
                        </NuxtLink>
                    </template>
                    <template v-else>
                        <NuxtLink 
                            to="/auth" 
                            class="btn btn-ghost btn-sm p-2"
                        >
                            <Icon name="ph:sign-in-light" class="w-5 h-5" />
                        </NuxtLink>
                    </template>

                    <!-- زر قائمة الهاتف -->
                    <button 
                        @click="toggleMobileMenu"
                        class="btn btn-ghost btn-sm p-2"
                    >
                        <Icon :name="mobileMenuOpen ? 'ph:x-light' : 'ph:list-light'" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- قائمة الهواتف والتابلت المنزلقة -->
            <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
            >
                <div 
                    v-if="mobileMenuOpen" 
                    class="lg:hidden border-t border-gray-200 bg-white py-4 shadow-lg"
                >
                    <div class="space-y-2 px-4 text-[#a93ecb]">
                        <!-- قائمة التنقل -->
                        <template v-for="item in headerMenu" :key="item.link" >
                            <div v-if="item.link.startsWith('#')" class="w-full text-[#a93ecb]">
                                <button 
                                    @click="scrollToSection(item.link)"
                                    class="flex text-[#a93ecb] items-center w-full px-3 py-3 text-base font-medium hover:text-[#a93ecb] hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                >
                                    <Icon :name="item.icon" class="w-5 h-5 mr-3 text-[#a93ecb] " />
                                    {{ item.name }}
                                </button>
                            </div>
                            
                            <NuxtLink 
                                v-else 
                                :to="item.link"
                                @click="toggleMobileMenu"
                                class="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            >
                                <Icon :name="item.icon" class="w-5 h-5 mr-3" />
                                {{ item.name }}
                            </NuxtLink>
                        </template>

                        <!-- الأزرار الإضافية للهواتف -->
                        <div class="border-t border-gray-200 pt-4 mt-4 space-y-2">
                            <template v-if="!isLoggedIn">
                            
                                
                                <NuxtLink 
                                    to="/company"
                                    @click="toggleMobileMenu"
                                    class="flex items-center w-full px-3 py-3 text-base font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                                >
                                    <Icon name="ph:buildings-light" class="w-5 h-5 mr-3" />
                                    company
                                </NuxtLink>
                            </template>
                            
                            <template v-if="isLoggedIn">
                                <button 
                                    @click="logout(); toggleMobileMenu();"
                                    class="flex items-center w-full px-3 py-3 text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                    <Icon name="ph:sign-out-light" class="w-5 h-5 mr-3" />
                                    logout
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- نافذة الاتصال (باللغة الدنماركية) -->
        <TheModal :open-modal="contactModal" size="3xl" static @close-modal="closeContactModal">
            <template #content>
                <div>
                    <div class="section-title">{{ useSettingValue('contact_form_title') ?? 'Forespørgsler' }}</div>
                    <div class="section-description text-sm mt-1">{{ useSettingValue('contact_form_description') || '  for mere information' }}</div>
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
                        placeholder="country"
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

/* تحسينات للشاشات الصغيرة */
@media (max-width: 640px) {
    .flex h-16 {
        height: 4rem;
    }
    
    .h-8 {
        height: 2rem;
    }
    
    .h-10 {
        height: 2.5rem;
    }
    
    .space-x-2 > * + * {
        margin-left: 0.5rem;
    }
}

/* تحسينات للتابلت */
@media (min-width: 641px) and (max-width: 1024px) {
    .hidden.lg\:flex {
        display: none !important;
    }
    
    .lg\:hidden {
        display: flex !important;
    }
}

/* تحسينات للظهور والاختفاء */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* تحسينات للزر */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease;
    color: #a93ecb;
}

.btn-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.btn-ghost {
    background: transparent;
    border: 1px solid transparent;
}

.btn-ghost:hover {
    background: rgba(0, 0, 0, 0.05);
}

.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
}

.btn-outline:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}
</style>