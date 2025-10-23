export const useAuth = () => {
  // التحقق إذا كان المستخدم عامل login
  const isAuthenticated = () => {
    const token = useCookie('auth_token')
    return !!token.value
  }

  // جلب بيانات المستخدم من الكوكيز
  const getUser = () => {
    const userCookie = useCookie('user_data')
    return userCookie.value
  }

  // جلب التوكن
  const getToken = () => {
    const tokenCookie = useCookie('auth_token')
    return tokenCookie.value
  }

  // تسجيل الخروج
  const logout = async () => {
    const tokenCookie = useCookie('auth_token')
    const userCookie = useCookie('user_data')
    const userTypeCookie = useCookie('user_type')

    // مسح الكوكيز
    tokenCookie.value = null
    userCookie.value = null
    userTypeCookie.value = null

    // الانتقال لصفحة login
    await navigateTo('/auth')
  }

  return {
    isAuthenticated,
    getUser,
    getToken,
    logout
  }
}