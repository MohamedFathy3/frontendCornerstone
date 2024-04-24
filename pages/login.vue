<script setup>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
const userStore = useUserStore();

definePageMeta({
    middleware: 'guest',
    layout: false,
});
const rules = reactive({
    email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Invalid email format', email) },
    password: { required: helpers.withMessage('Password is required', required) },
});
const loginForm = reactive({
    email: null,
    password: null,
});
const v$ = useVuelidate(rules, loginForm);
const formLoading = ref(false);

async function login() {
    formLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    await userStore.signIn(loginForm);
    formLoading.value = false;
}
</script>

<template>
    <div class="bg-primary h-screen flex flex-col gap-3 items-center place-content-center">
        <div class="text-white font-semibold text-3xl">CSM Dashboard</div>
        <div class="max-w-sm mx-auto bg-white px-8 py-12 rounded-xl w-full">
            <form class="grid gap-5" @submit.prevent="login">
                <FormInputField v-model="loginForm.email" name="email" :errors="v$.email.$errors" placeholder="Login Email" type="email" />
                <FormInputField v-model="loginForm.password" name="password" :errors="v$.password.$errors" placeholder="Password" type="password" />
                <button :disabled="formLoading" type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    </div>
</template>
