import type { UseFetchOptions } from 'nuxt/app';
import { useRequestHeaders } from 'nuxt/app';

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
    // إنشاء headers الأساسية
    let headers: any = {
        accept: 'application/json',
        referer: process.env.APP_URL ?? 'http://cornerstonemarine.test:4567',
    };

    // جلب التوكن من الكوكيز
    const token = useCookie('XSRF-TOKEN');
    if (token.value) {
        headers['X-XSRF-TOKEN'] = token.value as string;
    }

    // لو السيرفر بيشتغل على SSR
    if (process.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie']),
        };
    }

    // 🧩 console logs لعرض التفاصيل قبل الطلب
    console.log('==============================');
    console.log('📡 useApiFetch called with:');
    console.log('➡️ path:', path);
    console.log('🧾 full URL:', '/backend' + path);
    console.log('🛠 options:', options);
    console.log('🧠 headers:', headers);
    console.log('==============================');

    const result = useFetch('/backend' + path, {
        credentials: 'include',
        ...options,
        watch: false,
        headers: {
            ...headers,
            ...options?.headers,
        },
        // logging عند النجاح أو الخطأ
        onResponse({ response }) {
            console.log('✅ [useApiFetch] Response received for:', path);
            console.log('📦 Status:', response.status);
            console.log('📨 Data:', response._data);
            console.log('==============================');
        },
        onResponseError({ response }) {
            console.error('❌ [useApiFetch] Error fetching:', path);
            console.error('📦 Status:', response?.status);
            console.error('📨 Error:', response?._data);
            console.log('==============================');
        },
    });

    return result;
}
