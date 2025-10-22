<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
        <div class="max-w-md w-full">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon name="mdi:account-key" class="h-10 w-10 text-white" />
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Employee Login</h1>
                <p class="text-gray-600">Access your professional account</p>
            </div>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                <div class="flex items-center">
                    <Icon name="clarity:success-standard-line" class="h-5 w-5 text-green-500 mr-3" />
                    <span class="text-green-800 font-medium">Login successful! Redirecting...</span>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm">
                <div class="flex items-center">
                    <Icon name="clarity:error-standard-line" class="h-5 w-5 text-red-500 mr-3" />
                    <span class="text-red-800 font-medium">{{ submitError }}</span>
                </div>
            </div>

            <!-- Login Form -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <!-- Username Field -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-700"> Username <span class="text-red-500">*</span> </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon name="mdi:account-outline" class="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                v-model="loginForm.user_name"
                                type="text"
                                required
                                class="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                placeholder="Enter your username"
                                :disabled="formLoading"
                            />
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-700"> Password <span class="text-red-500">*</span> </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon name="mdi:lock-outline" class="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                v-model="loginForm.password"
                                :type="showPassword ? 'text' : 'password'"
                                required
                                class="w-full pl-10 pr-12 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                                placeholder="Enter your password"
                                :disabled="formLoading"
                            />
                            <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" @click="showPassword = !showPassword">
                                <Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input v-model="loginForm.remember" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <button type="button" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Forgot password?</button>
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        :disabled="formLoading"
                        class="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <Icon v-if="formLoading" name="eos-icons:three-dots-loading" class="h-6 w-6 mr-3" />
                        <span>{{ formLoading ? 'Signing In...' : 'Sign In' }}</span>
                    </button>

                    <!-- Divider -->
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">New to our platform?</span>
                        </div>
                    </div>

                    <!-- Register Link -->
                    <div class="text-center">
                        <NuxtLink to="/employee/register" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                            <Icon name="mdi:account-plus-outline" class="h-4 w-4 mr-2" />
                            Create employee account
                        </NuxtLink>
                    </div>
                </form>
            </div>

            <!-- Additional Info -->
            <div class="mt-6 text-center">
                <p class="text-xs text-gray-500">
                    By signing in, you agree to our
                    <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a>
                    and
                    <a href="#" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Types
interface LoginForm {
    user_name: string;
    password: string;
    remember: boolean;
}

// Reactive data
const loginForm = reactive<LoginForm>({
    user_name: '',
    password: '',
    remember: false,
});

const formLoading = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');
const showPassword = ref(false);

// Handle login function
const handleLogin = async (): Promise<void> => {
    formLoading.value = true;
    submitError.value = '';

    try {
        // First: Get CSRF token
        await useApiFetch('/sanctum/csrf-cookie', {
            method: 'GET',
            baseURL: useRuntimeConfig().public.apiBase,
            credentials: 'include',
        });

        // Second: Send login request
        const response = await useApiFetch('/api/employee/login', {
            method: 'POST',
            body: {
                user_name: loginForm.user_name,
                password: loginForm.password,
            },
            baseURL: useRuntimeConfig().public.apiBase,
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Login successful:', response);

        // Show success toast
        useToast({
            title: 'Login Successful',
            message: 'Welcome back! Redirecting to your profile...',
            type: 'success',
            duration: 3000,
        });

        submitSuccess.value = true;

        // Redirect to profile after delay
        setTimeout(() => {
            navigateTo('/profile');
        }, 2000);
    } catch (error: any) {
        console.error('❌ Login error:', error);

        // Handle different error types
        if (error?.data?.message) {
            submitError.value = error.data.message;
        } else if (error?.status === 401) {
            submitError.value = 'Invalid username or password';
        } else if (error?.status === 422) {
            submitError.value = 'Please check your input and try again';
        } else if (error?.status === 429) {
            submitError.value = 'Too many login attempts. Please try again later.';
        } else {
            submitError.value = 'Login failed. Please check your connection and try again.';
        }

        // Show error toast
        useToast({
            title: 'Login Failed',
            message: submitError.value,
            type: 'error',
            duration: 5000,
        });
    } finally {
        formLoading.value = false;
    }
};

// Auto-fill for testing (remove in production)
onMounted(() => {
    // You can remove this in production
    if (process.dev) {
        loginForm.user_name = 'user_names';
        loginForm.password = '01062206359';
    }
});

// Keyboard shortcut for demo (remove in production)
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'Enter') {
        handleLogin();
    }
};

onMounted(() => {
    document.addEventListener('keypress', handleKeyPress);
});

onUnmounted(() => {
    document.removeEventListener('keypress', handleKeyPress);
});
</script>

<style scoped>
/* Custom styles for better appearance */
input:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
}

/* Smooth transitions for all interactive elements */
button,
input,
a {
    transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
input:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
</style>
