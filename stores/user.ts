export const useUserStore = defineStore('user', () => {
    // Main Objects
    const user = ref<User>();
    // Setting Data to the Main Objects
    const setUser = (data?: User) => (user.value = data);

    // User Actions
    const signIn = async (data: Credentials) => {
        await useApiFetch('/sanctum/csrf-cookie');
        await useApiFetch(`/login`, {
            method: 'POST',
            body: data,
            lazy: true,
        });
        await fetchAuthUser();
        navigateTo('/dashboard');
    };

    const fetchAuthUser = async () => {
        const { data, error } = await useApiFetch('/api/user');
        if (data.value) {
            const user = (data.value as BackendResponse).data as User;
            setUser(user);
        }
        if (error.value) {
            setUser();
        }
    };

    const logout = async () => {
        navigateTo('/login');
        await useApiFetch('/logout', { method: 'POST' });
        setUser();
    };

    return { user, logout, signIn, fetchAuthUser, setUser };
});
