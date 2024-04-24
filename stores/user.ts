export const useUserStore = defineStore('user', () => {
    // Main Objects
    const user = ref<User>();
    const token = useCookie('CSM_AUTH_TOKEN', {
        maxAge: 60 * 60 * 2,
    });

    // Setting Data to the Main Objects
    const setToken = (data?: string) => (token.value = data);
    const setUser = (data?: User) => (user.value = data);

    // User Actions
    const signIn = async (data: Credentials) => {
        await fetch('/backend/sanctum/csrf-cookie');
        const { data: userData, error } = await useApiFetch(`/api/user/login`, {
            method: 'POST',
            body: data,
            lazy: true,
        });
        if (userData.value) {
            const userToken = (userData.value as BackendResponse).data as string;
            setToken(userToken);
            useToast({ title: 'Welcome', message: 'Loggedin Successfully', type: 'success', duration: 5000 });
            navigateTo('/dashboard');
        }
        if (error && error.value) {
            const errorMessage = error.value.data;
            useToast({ title: 'Error', message: errorMessage.message, type: 'error', duration: 5000 });
            setToken();
            setUser();
        }
    };

    const fetchAuthUser = async () => {
        if (token.value) {
            const { data: userData, error } = await useApiFetch('/api/get-auth');
            if (userData.value) {
                const user = (userData.value as BackendResponse).data as User;
                setUser(user);
            }
            if (error.value) {
                logout();
            }
        }
    };

    const logout = () => {
        setToken();
        setUser();
        navigateTo('/login');
    };

    return { user, token, logout, signIn, fetchAuthUser, setUser, setToken };
});
