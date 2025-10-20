<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                Company Registration
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Register your company and find the best talents for your team. 
                Join our network of successful businesses.
            </p>
        </div>

        <!-- Registration Form -->
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="md:flex">
                <!-- Left Side - Form -->
                <div class="md:w-1/2 p-8">
                    <form @submit.prevent="submitForm" class="space-y-6">
                        <!-- Company Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                id="name"
                                v-model="formData.name"
                                type="text"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter company name"
                            />
                        </div>

                        <!-- Responsible Person -->
                        <div>
                            <label for="responsible_name" class="block text-sm font-medium text-gray-700 mb-2">
                                Responsible Person *
                            </label>
                            <input
                                id="responsible_name"
                                v-model="formData.responsible_name"
                                type="text"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter responsible person name"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                v-model="formData.email"
                                type="email"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="company@example.com"
                            />
                        </div>

                        <!-- Phone -->
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                id="phone"
                                v-model="formData.phone"
                                type="tel"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <!-- Country & City -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="country_id" class="block text-sm font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <select
                                    id="country_id"
                                    v-model="formData.country_id"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                >
                                    <option value="">Select Country</option>
                                    <option value="1">Egypt</option>
                                    <option value="2">Saudi Arabia</option>
                                    <option value="3">UAE</option>
                                </select>
                            </div>
                            <div>
                                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    id="city"
                                    v-model="formData.city"
                                    type="text"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        <!-- Address -->
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                id="address"
                                v-model="formData.address"
                                rows="3"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter company address"
                            ></textarea>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="loading">Registering...</span>
                            <span v-else>Register Company</span>
                        </button>
                    </form>
                </div>

                <!-- Right Side - Logo Upload -->
                <div class="md:w-1/2 bg-gray-50 p-8 border-l border-gray-200">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            Company Logo
                        </h3>
                        <p class="text-gray-600">
                            Upload your company logo to build brand recognition
                        </p>
                    </div>

                    <!-- File Upload Component -->
                    <FileUpload
                        label="Company Logo"
                        name="image"
                        :required="true"
                        :model-value="formData.image"
                        :allowed-types="['image']"
                        :max-size="5"
                        :errors="logoErrors"
                        @update:model-value="handleLogoUpdate"
                    />
                </div>
            </div>
        </div>

        <!-- Additional Info -->
        <div class="max-w-4xl mx-auto mt-8 text-center">
            <p class="text-gray-600">
                Already have an account? 
                <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold">Sign in here</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Loading state
const loading = ref(false)

// Form data
const formData = reactive({
    name: '',
    responsible_name: '',
    email: '',
    phone: '',
    country_id: '',
    city: '',
    address: '',
    image: null
})

// Logo validation errors
const logoErrors = ref([])

// Handle logo update
const handleLogoUpdate = (file) => {
    formData.image = file
    // Clear errors when file is selected
    logoErrors.value = []
}

// Submit form
const submitForm = async () => {
    // Basic validation
    if (!formData.image) {
        logoErrors.value = [{ $message: 'Company logo is required' }]
        return
    }

    loading.value = true

    try {
        // Create FormData object
        const submitData = new FormData()
        
        // Append all form fields
        submitData.append('name', formData.name)
        submitData.append('responsible_name', formData.responsible_name)
        submitData.append('email', formData.email)
        submitData.append('phone', formData.phone)
        submitData.append('country_id', formData.country_id)
        submitData.append('city', formData.city)
        submitData.append('address', formData.address)
        
        // Append the image file
        if (formData.image) {
            submitData.append('image', formData.image)
        }

        console.log('Submitting company data with image...')

        // Call API without authentication
        const response = await $fetch('/api/company/store', {
            method: 'POST',
            body: submitData,
            // No authentication headers
            headers: {
                'Accept': 'application/json',
            }
        })

        if (response) {
            // Success handling
            console.log('Company registered successfully:', response)
            
            // Show success message
            alert('Company registered successfully!')
            
            // Reset form
            Object.assign(formData, {
                name: '',
                responsible_name: '',
                email: '',
                phone: '',
                country_id: '',
                city: '',
                address: '',
                image: null
            })
        }

    } catch (error) {
        console.error('Error registering company:', error)
        alert('Error registering company. Please try again.')
    } finally {
        loading.value = false
    }
}
</script>