<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800 py-8">
        <div class="container mx-auto px-4">
            <!-- Page Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {{ pageTitle }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {{ pageDescription }}
                </p>
            </div>

            <!-- Contact Form Section -->
            <div class="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 md:p-8">
                <div class="mb-6">
                    <div class="section-title">{{ formTitle }}</div>
                    <div class="section-description text-sm mt-1">
                        {{ formDescription }}
                    </div>
                    <div class="mt-3 h-1 w-52 bg-warning" />
                </div>

                <form class="grid gap-4" @submit.prevent="sendMessage">
                    <div class="grid md:grid-cols-2 gap-4">
                        <FormInputField v-model="contactForm.name" :disabled="formIsLoading" :errors="v$.name.$errors" name="name" placeholder="Your Name" />
                        <FormInputField v-model="contactForm.email" :disabled="formIsLoading" :errors="v$.email.$errors" name="email" placeholder="Your Email" type="email" />
                    </div>

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

                    <FormInputField v-model="contactForm.content" :disabled="formIsLoading" :errors="v$.content.$errors" name="content" placeholder="Your Message" type="textarea" rows="5" />

                    <button :disabled="formIsLoading" class="w-full btn btn-primary px-6 py-3 text-lg font-semibold" type="submit">
                        <Icon v-if="formIsLoading" name="eos-icons:loading" class="h-5 w-5 mr-2" />
                        {{ formIsLoading ? 'Sending Message...' : 'Send Message' }}
                    </button>
                </form>
            </div>

            <!-- Contact Information -->
            <div class="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 text-center">
                    <Icon name="ph:phone-light" class="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 class="font-semibold text-lg mb-2">Phone</h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ phoneNumber }}</p>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 text-center">
                    <Icon name="ph:envelope-light" class="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 class="font-semibold text-lg mb-2">Email</h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ emailAddress }}</p>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 text-center">
                    <Icon name="ph:map-pin-light" class="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 class="font-semibold text-lg mb-2">Address</h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ companyAddress }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

// Page Metadata
useSeoMeta({
    title: 'Contact Us - Cornerstone Marine',
    description: 'Get in touch with Cornerstone Marine for all your shipping and logistics needs.',
});

// Settings from CMS
const pageTitle = useSettingValue('contact_page_title') || 'Contact Us';
const pageDescription = useSettingValue('contact_page_description') || 'Get in touch with our team for any inquiries';
const formTitle = useSettingValue('contact_form_title') || 'Send us a Message';
const formDescription = useSettingValue('contact_form_description') || 'We will get back to you as soon as possible';
const phoneNumber = useSettingValue('company_phone') || '+1 (555) 123-4567';
const emailAddress = useSettingValue('company_email') || 'info@cornerstonemarine.com';
const companyAddress = useSettingValue('company_address') || '123 Shipping Lane, Logistics City';

// Contact Form Data
const contactForm = reactive({
    name: null,
    email: null,
    subject: null,
    content: null,
    countryId: null,
});

// Form State
const formIsLoading = ref(false);

// Countries List
const settingStore = useSettingsStore();
const countryList = settingStore.countries;

// Form Validation
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

// Send Message Function
async function sendMessage() {
    formIsLoading.value = true;
    const result = await v$.value.$validate();

    if (!result) {
        formIsLoading.value = false;
        return false;
    }

    const { data, error } = await useApiFetch('/api/contact-us', {
        method: 'POST',
        lazy: true,
        body: contactForm,
    });

    if (data.value) {
        useToast({
            title: 'Sent Successfully',
            message: 'Thank you for your message. We will get back to you soon!',
            type: 'success',
            duration: 5000,
        });

        // Reset form
        v$.value.$reset();
        contactForm.name = null;
        contactForm.email = null;
        contactForm.subject = null;
        contactForm.content = null;
        contactForm.countryId = null;
    }

    if (error.value) {
        useToast({
            title: 'Error',
            message: error.value.message || 'Failed to send message. Please try again.',
            type: 'error',
            duration: 5000,
        });
    }

    formIsLoading.value = false;
}
</script>

<style scoped>
.section-title {
    @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.section-description {
    @apply text-gray-600 dark:text-gray-300;
}
</style>
