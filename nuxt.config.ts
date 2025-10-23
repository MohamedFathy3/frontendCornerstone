// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
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
            googleMapsApiKey: 'AIzaSyDhsNo3h0z49077pD1EDdbSk8aunmBassg',
            appUrl: process.env.APP_URL ?? 'http://fast-track-shipping.test:3000',
            apiUrl: process.env.API_URL ?? 'http://api.fast-track-shipping.test:8001',
            description:
                'Unlock unparalleled access to the global market with The Efficient Freight Company. Partnered with Fast Track Shipping, we offer top-tier customs clearance, sea and air shipment, and international insurance services for seamless import and export operations. Our strategic presence at major ports and airports ensures efficient handling of shipments worldwide. Utilizing cutting-edge technology and a vast network of partners, we guarantee optimal logistics management and international product distribution. Experience excellence in freight forwarding with The Efficient Freight Company and Fast Track Shipping.',
            keywords:
                'Freight Company, Efficient Freight Company, Customs Clearance, Sea Shipment, Air Shipment, International Insurance, Fast Track Shipping, Freight Market, Logistics Management, Global Market Access, Import and Export, Product Distribution, Strategic Gateway, Freight Forwarding Services',
        },
    },
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
    site: {
        url: process.env.APP_URL ?? 'https://fast-track-shipping.test:3000',
    },
    sitemap: {
        exclude: ['/dashboard/**', '/login'],
    },
    nitro: {
        routeRules: {
        '/backend/**': {
            proxy: 'http://127.0.0.1:8001/**',
            
        },
         '/backend/api/employee/profile/update/**': {
      proxy: 'https://job.professionalacademyedu.com/api/employee/profile/update/**',
    },
        '/get-geoip/**': {
            proxy: 'http://127.0.0.1:8001',
        },
           '/api/**': {
      proxy: 'http://127.0.0.1:8001/api/**',
    }
    },
    compressPublicAssets: true,
    },
    routeRules: {
        '/dashboard/**': { ssr: false },
    },
    css: ['@/assets/css/main.scss',
        
    ],
    modules: ['nuxt-lodash', '@pinia/nuxt', 'nuxt-icon',  '@nuxtjs/color-mode', '@nuxt/image',
         'nuxt-swiper', 'nuxt-headlessui', '@morev/vue-transitions/nuxt'],
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
        // buildAssetsDir: '/fts-app/',
        rootId: '__ftsapp',
        head: {
            title: 'Fast Track Shipping',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                {
                    name: 'description',
                    content:
                        'Unlock unparalleled access to the global market with The Efficient Freight Company. Partnered with Fast Track Shipping, we offer top-tier customs clearance, sea and air shipment, and international insurance services for seamless import and export operations. Our strategic presence at major ports and airports ensures efficient handling of shipments worldwide. Utilizing cutting-edge technology and a vast network of partners, we guarantee optimal logistics management and international product distribution. Experience excellence in freight forwarding with The Efficient Freight Company and Fast Track Shipping.',
                },
                { name: 'author', content: 'World Shipping Alliance' },
                { name: 'application-name', content: 'Fast Track Shipping' },
                {
                    name: 'keywords',
                    content:
                        'Freight Company, Efficient Freight Company, Customs Clearance, Sea Shipment, Air Shipment, International Insurance, Fast Track Shipping, Freight Market, Logistics Management, Global Market Access, Import and Export, Product Distribution, Strategic Gateway, Freight Forwarding Services',
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
        hid: 'fts-app-color-mode-script',
        globalName: '__FTS_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'fts-color-mode',
    },
});
