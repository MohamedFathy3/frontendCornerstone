export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    await userStore.fetchAuthUser();
    if (userStore.user) {
        return navigateTo('/dashboard');
    }
});
