// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },
    typescript: {
        tsConfig: {
            compilerOptions: {
                moduleResolution: 'bundler',
            },
        },
    },
    sourcemap: {
        server: true,
        client: true,
    },
    pinia: {
        autoImports: ['defineStore'],
    },
    experimental: {
        emitRouteChunkError: 'automatic',
        sharedPrerenderData: true,
        typedPages: true,
    },
    runtimeConfig: {
        public: {
            appUrl: process.env.APP_URL ?? 'http://cornerstonemarine.test:4567',
            apiUrl: process.env.API_URL ?? 'http://api.cornerstonemarine.test:9080',
            description:
                'Unlock unparalleled access to the global market with The Efficient Freight Company. Partnered with Cornerstone Marine, we offer top-tier customs clearance, sea and air shipment, and international insurance services for seamless import and export operations. Our strategic presence at major ports and airports ensures efficient handling of shipments worldwide. Utilizing cutting-edge technology and a vast network of partners, we guarantee optimal logistics management and international product distribution. Experience excellence in freight forwarding with The Efficient Freight Company and Cornerstone Marine.',
            keywords:
                'Freight Company, Efficient Freight Company, Customs Clearance, Sea Shipment, Air Shipment, International Insurance, Cornerstone Marine, Freight Market, Logistics Management, Global Market Access, Import and Export, Product Distribution, Strategic Gateway, Freight Forwarding Services',
        },
    },
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
    site: {
        url: process.env.APP_URL ?? 'https://cornerstonemarine.test:4567',
    },
    sitemap: {
        exclude: ['/dashboard/**', '/login'],
    },
    nitro: {
        routeRules: {
            '/backend/**': {
                proxy: `${process.env.API_URL ?? 'http://api.cornerstonemarine.test:9080'}/**`,
            },
            '/get-geoip/**': {
                proxy: `http://ip-api.com/json/**`,
            },
            
           
            '/api/**': {
                proxy: `${process.env.API_URL || 'https://job.professionalacademyedu.com'}/api/**`
            },
            '/sanctum/**': {
                proxy: `${process.env.API_URL || 'https://job.professionalacademyedu.com'}/sanctum/**`
            }
        },
        compressPublicAssets: true,
    },
    routeRules: {
        '/dashboard/**': { ssr: false },
    },
    css: ['@/assets/css/main.scss'],
    modules: ['nuxt-lodash', '@pinia/nuxt', 'nuxt-icon', '@nuxtjs/eslint-module', '@nuxtjs/color-mode', '@nuxt/image', 'nuxt-swiper', 'nuxt-headlessui', '@morev/vue-transitions/nuxt', 'nuxt-simple-sitemap'],
    image: {
        inject: true,
        quality: 65,
        format: ['webp'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },
    imports: {
        dirs: ['./stores'],
    },
    app: {
        buildAssetsDir: '/csm-app/',
        rootId: '__csmapp',
        head: {
            title: 'Cornerstone Marine',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                {
                    name: 'description',
                    content:
                        'Unlock unparalleled access to the global market with The Efficient Freight Company. Partnered with Cornerstone Marine, we offer top-tier customs clearance, sea and air shipment, and international insurance services for seamless import and export operations. Our strategic presence at major ports and airports ensures efficient handling of shipments worldwide. Utilizing cutting-edge technology and a vast network of partners, we guarantee optimal logistics management and international product distribution. Experience excellence in freight forwarding with The Efficient Freight Company and Cornerstone Marine.',
                },
                { name: 'author', content: 'World Shipping Alliance' },
                { name: 'application-name', content: 'Cornerstone Marine' },
                {
                    name: 'keywords',
                    content:
                        'Freight Company, Efficient Freight Company, Customs Clearance, Sea Shipment, Air Shipment, International Insurance, Cornerstone Marine, Freight Market, Logistics Management, Global Market Access, Import and Export, Product Distribution, Strategic Gateway, Freight Forwarding Services',
                },
            ],
            htmlAttrs: {
                lang: 'en',
                dir: 'ltr',
            },
        },
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    headlessui: {
        prefix: 'Headless',
    },
    postcss: {
        plugins: {
            'postcss-import': {},
            'postcss-advanced-variables': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    colorMode: {
        preference: 'light', // default value of $colorMode.preference
        fallback: 'light', // fallback value if not system preference found
        hid: 'csm-app-color-mode-script',
        globalName: '__CSM_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'csm-color-mode',
    },
});
