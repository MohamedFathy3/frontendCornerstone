interface Employee {
    id: number;
    type_login: string;
    name: string;
    email: string;
    phone: string;
    user_name: string;
    post_nummer: string;
    experience_certificate: string;
    address: string;
    skills: string;
    nationality: string;
    city: string;
    country: string;
    keyCode: string;
    type_job: string;
    languages: string[];
    favorite_work: string[];
    image: string | null;
    cv: string | null;
    application: string | null;
    created_at: string;
}

interface EmployeeCredentials {
    email: string;
    password: string;
}

export const useEmployeeStore = defineStore('employee', () => {
    // Main Objects
    const employee = ref<Employee | null>(null);

    // Setting Data to the Main Objects
    const setEmployee = (data?: Employee) => (employee.value = data || null);

    // Employee Actions
   const signIn = async (data: EmployeeCredentials) => {
        console.log('🚀 Employee signIn started with:', data);

        try {
            // Get CSRF token أولاً
            const csrf = await useApiFetch('/sanctum/csrf-cookie');
            console.log('🧩 CSRF Token fetched:', csrf);

            // Login request للموظف باستخدام username
            const loginRes = await useApiFetch('/employee/login', {
                method: 'POST',
                body: data,
            });
            console.log('🔑 Employee Login response:', loginRes);

            // ✅ تأكيد نجاح تسجيل الدخول
            if (loginRes.data.value || !loginRes.error.value) {
                await fetchAuthEmployee();
                console.log('✅ Employee signed in successfully, navigating to profile...');
                navigateTo('/employee/profile');
            } else {
                console.warn('⚠️ Employee login may have failed');
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('❌ Employee signIn error:', error);
            throw error;
        }
    };
    const fetchAuthEmployee = async () => {
        console.log('👤 Fetching authenticated employee...');

        try {
            // ✅ التحقق من وجود session
            const token = useCookie('XSRF-TOKEN');
            if (!token.value) {
                console.warn('⚠️ No XSRF-TOKEN found, employee not logged in yet.');
                return;
            }

            // جلب بيانات الموظف المسجل دخوله
            const { data, error } = await useApiFetch('/api/get-auth-employee', {
                method: 'POST',
                credentials: 'include',
            });

            if (data.value) {
                const employeeData = (data.value as any).data as Employee;
                setEmployee(employeeData);
                console.log('✅ Auth employee fetched:', employeeData);
            } else if (error.value) {
                console.warn('⚠️ Error fetching auth employee:', error.value);
                setEmployee();
            }
        } catch (err) {
            console.error('❌ fetchAuthEmployee error:', err);
            setEmployee();
        }
    };

    const logout = async () => {
        console.log('🚪 Logging out employee...');
        try {
            const res = await useApiFetch('/employee/logout', { 
                method: 'POST' 
            });
            console.log('✅ Employee logout response:', res);
            setEmployee();
            navigateTo('/employee/login');
        } catch (error) {
            console.error('❌ Employee logout error:', error);
        }
    };

    const updateProfile = async (profileData: any) => {
        console.log('📝 Updating employee profile...');
        try {
            const { data, error } = await useApiFetch('/api/employee/update', {
                method: 'PUT',
                body: profileData,
            });

            if (data.value && !error.value) {
                // تحديث البيانات المحلية
                if (employee.value) {
                    Object.assign(employee.value, profileData);
                }
                console.log('✅ Employee profile updated successfully');
                return { success: true };
            } else {
                console.error('❌ Employee profile update failed:', error.value);
                return { success: false, error: error.value };
            }
        } catch (error) {
            console.error('❌ Employee profile update error:', error);
            return { success: false, error };
        }
    };

    // Computed properties
    const isLoggedIn = computed(() => !!employee.value);
    const fullName = computed(() => employee.value?.name || '');
    const jobType = computed(() => 
        employee.value?.type_job === 'full_time' ? 'Full Time' : 'Part Time'
    );

    return { 
        employee, 
        logout, 
        signIn, 
        fetchAuthEmployee, 
        setEmployee,
        updateProfile,
        isLoggedIn,
        fullName,
        jobType
    };
});