<template>
    <div>
        <HeadlessMenu as="div" class="relative inline-block text-left">
            <HeadlessMenuButton class="">
                <Icon :name="'prime:language'" class="h-6 w-6 duration-300 ease-in-out" />
            </HeadlessMenuButton>
            <TransitionSlide>
                <div>
                    <HeadlessMenuItems class="box absolute ltr:right-0 rtl:left-0 mt-2 ltr:origin-top-right rtl:origin-top-right divide-y divide-slate-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-white/10">
                        <HeadlessMenuItem v-for="{ code, name, icon } in locales" :key="code" class="group flex w-full items-center p-3">
                            <NuxtLink :to="switchLocalePath(code)" :class="[locale === code ? 'text-primary' : '']">
                                <Icon :name="icon" class="mr-2 rtl:mr-0 rtl:ml-4 h-5 w-5 text-slate-400 group-hover:text-primary" />
                                <span :class="[code === 'ar' ? 'font-cairo' : '', 'font-medium group-hover:text-primary text-sm']">{{ name }}</span>
                            </NuxtLink>
                        </HeadlessMenuItem>
                    </HeadlessMenuItems>
                </div>
            </TransitionSlide>
        </HeadlessMenu>
    </div>
</template>

<script setup>
const { locales, locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

watch(
    () => locale.value,
    (newLocale) => {
        document.documentElement.lang = newLocale;
        document.documentElement.dir = locale.value === 'ar' || newLocale === 'ar' ? 'rtl' : 'ltr';
        if (newLocale === 'ar' || locale.value === 'ar') {
            document.body.classList.add('font-cairo');
        } else {
            document.body.classList.remove('font-cairo');
        }
    },
);
</script>
