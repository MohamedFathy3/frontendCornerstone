import type { UseFetchOptions } from 'nuxt/app';
import { useRequestHeaders } from 'nuxt/app';
export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
    let headers: any = {
        accept: 'application/json',
        referer: process.env.APP_URL ?? 'http://cornerstonemarine.test:4567',
    };
    const token = useCookie('XSRF-TOKEN');
    if (token.value) {
        headers['X-XSRF-TOKEN'] = token.value as string;
    }
    const userStore = useUserStore();
    const bearerToken = userStore.token; // Assuming you're using localStorage to store the token
    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }
    if (process.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie']),
        };
    }
    return useFetch('/backend' + path, {
        credentials: 'include',
        ...options,
        watch: false,
        headers: {
            ...headers,
            ...options?.headers,
        },
    });
}
