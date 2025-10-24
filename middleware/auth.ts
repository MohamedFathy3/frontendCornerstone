export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    if (!userStore.user) {
        return navigateTo('/login');
    }

 const tokenCookie = useCookie('auth_token')
  const userTypeCookie = useCookie('user_type')
  
  // إذا كان المستخدم عامل login ومحاول يدخل على login page
  if (tokenCookie.value && to.path === '/auth' && to.path === '/empley' || to.path === '/Profile') {
    // ابعده للصفحة الرئيسية أو البروفايل
    return navigateTo(userTypeCookie.value === 'employee' ? '/profile' : '/')
  }
  
  // إذا كان مش عامل login ومحاول يدخل على صفحة محمية
  if (!tokenCookie.value && to.meta.requiresAuth) {
    return navigateTo('/auth')
  }
    
});
