// composables/useCsrf.ts
export const useCsrf = async () => {
  const { data } = await useFetch('/backend/sanctum/csrf-cookie', {
    baseURL: '', // Use absolute URL
    credentials: 'include',
  });
  return data;
};