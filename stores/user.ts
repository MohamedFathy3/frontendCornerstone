export const useUserStore = defineStore('user', () => {
    // Main Objects
    const user = ref<User>();

    // Setting Data to the Main Objects
    const setUser = (data?: User) => (user.value = data);

    // User Actions
    const signIn = async (data: Credentials) => {
        console.log('🚀 signIn started with:', data);

        try {
            // Get CSRF token
            const csrf = await useApiFetch('/sanctum/csrf-cookie');
            console.log('🧩 CSRF Token fetched:', csrf);

            // Login request
            const loginRes = await useApiFetch(`/login`, {
                method: 'POST',
                body: data,
                lazy: true,
            });
            console.log('🔑 Login response:', loginRes);

            // ✅ تأكيد نجاح تسجيل الدخول قبل جلب بيانات المستخدم
            if (loginRes?.status.value === 'success' || loginRes?.data.value) {
                await fetchAuthUser();
                console.log('✅ User signed in successfully, navigating to dashboard...');
                navigateTo('/dashboard');
            } else {
                console.warn('⚠️ Login may have failed, skipping fetchAuthUser()');
            }
        } catch (error) {
            console.error('❌ signIn error:', error);
        }
    };

    const fetchAuthUser = async () => {
        console.log('👤 Fetching authenticated user...');

        try {
            // ✅ لو مفيش كوكي XSRF أو Session يبقى المستخدم مش داخل
            const token = useCookie('XSRF-TOKEN');
            if (!token.value) {
                console.warn('⚠️ No XSRF-TOKEN found, user not logged in yet. Skipping fetchAuthUser()');
                return;
            }

            const { data, error } = await useApiFetch('/api/user');

            if (data.value) {
                const userData = (data.value as BackendResponse).data as User;
                setUser(userData);
                console.log('✅ Auth user fetched:', userData);
            } else if (error.value) {
                console.warn('⚠️ Error fetching auth user:', error.value);
                setUser();
            }
        } catch (err) {
            console.error('❌ fetchAuthUser error:', err);
        }
    };

    const logout = async () => {
        console.log('🚪 Logging out user...');
        try {
            const res = await useApiFetch('/logout', { method: 'POST' });
            console.log('✅ Logout response:', res);
            setUser();
            navigateTo('/login');
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    };

    return { user, logout, signIn, fetchAuthUser, setUser };
});
