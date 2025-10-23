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

    // ✅ **الحل: معالجة خاصة لـ FormData**
    // إذا كان الـ body هو FormData، شيل الـ Content-Type علشان الـ browser يضيفه أوتوماتيك
    const isFormData = options.body && options.body instanceof FormData;
    
    if (isFormData) {
        console.log('📦 Detected FormData - letting browser set Content-Type automatically');
        // FormData بيضيف الـ Content-Type أوتوماتيك مع boundary
        // مش محتاجين نضيفه يدوي علشان ميسببش conflicts
        delete headers['Content-Type']; // تأكد إنه مش موجود
    } else if (!headers['Content-Type']) {
        // لـ JSON data عادية، ضيف الـ Content-Type
        headers['Content-Type'] = 'application/json';
    }

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