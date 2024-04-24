export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    await userStore.fetchAuthUser();
    if (userStore.token && userStore.user) {
        return navigateTo('/dashboard');
    }
});
