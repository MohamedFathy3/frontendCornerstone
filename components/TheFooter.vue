<script setup>
const socialMedia = ref([
    {
        name: 'facebook',
        icon: 'fa6-brands:facebook-f',
        url: useSettingValue('social_facebook'),
    },
    {
        name: 'x',
        icon: 'fa6-brands:x-twitter',
        url: useSettingValue('social_x'),
    },
    {
        name: 'linkedin',
        icon: 'fa6-brands:linkedin-in',
        url: useSettingValue('social_linkedin'),
    },
    {
        name: 'youtube',
        icon: 'fa6-brands:youtube',
        url: useSettingValue('social_youtube'),
    },
]);
</script>

<template>
    <div class="bg-primary text-white py-3">
        <div class="md:flex block items-center container px-8 justify-between">
            <div class="text-sm md:text-left text-center">{{ useSettingValue('copyrights') }}</div>
            <ul class="flex items-center gap-6 mt-3 md:mt-0 md:place-content-end place-content-center">
                <template v-for="item in socialMedia" :key="item.name">
                    <li v-if="item.url">
                        <NuxtLink :to="item.url">
                            <Icon :name="item.icon" class="w-5 h-5 hover:scale-105 ease-in-out duration-300 hover:opacity-100 opacity-50" />
                        </NuxtLink>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
