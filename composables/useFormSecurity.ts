// composables/useFormSecurity.ts
export const useFormSecurity = () => {
  const ensureCsrf = async () => {
    const token = useCookie('XSRF-TOKEN').value;
    if (!token) {
      console.log('🔄 Fetching CSRF token...');
      await useCsrf();
    }
  };

  const secureFetch = async (path: string, options: any = {}) => {
    await ensureCsrf();
    return useApiFetch(path, options);
  };

  return {
    ensureCsrf,
    secureFetch
  };
};