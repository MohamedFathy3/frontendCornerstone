<script setup>
const states = [
    { id: 1, name: 'Projects', number: 150, icon: 'projects' },
    { id: 2, name: 'Designs', number: 750, icon: 'designs' },
    { id: 3, name: 'Campaigns', number: 100, icon: 'campaigns' },
    { id: 4, name: 'Clients', number: 70, icon: 'clients' },
];
</script>

<template>
    <div class="relative z-40">
        <div class="mini-box mx-5 -mt-24 max-w-5xl p-2 md:mx-auto 2xl:max-w-7xl">
            <ul class="hidden items-center text-center md:grid md:grid-cols-4 md:divide-x md:divide-dashed md:divide-slate-200 dark:md:divide-white/10">
                <li v-for="(item, index) in states" :key="index" class="intro-x p-2 text-white dark:text-slate-200">
                    <CustomIcon :name="item.icon" class="mx-auto h-12 w-12 fill-current stroke-current" />
                    <div class="mt-4 text-xl">
                        {{ item.name }}
                    </div>
                    <AutoCounter class="mt-2 text-4xl font-extrabold text-white dark:text-green-500" :start-amount="0" :end-amount="item.number" suffix="+" :name="`state-counter-${index}`" :decimals="0" :autoinit="true" />
                </li>
            </ul>
            <ul class="hidden grid-cols-2 items-center text-center sm:grid md:hidden md:divide-x md:divide-dashed md:divide-slate-200 dark:md:divide-white/10">
                <li v-for="(item, index) in states" :key="index" class="border-dashed border-white/10 p-2 first:border-b first:border-r last:border-l last:border-t">
                    <CustomIcon :name="item.icon" class="mx-auto h-12 w-12 fill-current stroke-current" />
                    <div class="mt-4 text-xl">
                        {{ item.name }}
                    </div>
                    <AutoCounter class="mt-2 text-4xl font-extrabold text-green-500" :start-amount="0" :end-amount="item.number" suffix="+" :name="`state-counter-${index}`" :decimals="0" :autoinit="true" />
                </li>
            </ul>
            <ul class="grid grid-cols-1 items-center divide-y divide-dashed text-center sm:hidden md:divide-slate-200 dark:md:divide-white/10">
                <li v-for="(item, index) in states" :key="index" class="p-2">
                    <CustomIcon :name="item.icon" class="mx-auto h-12 w-12 fill-current stroke-current" />
                    <div class="mt-4 text-xl">
                        {{ item.name }}
                    </div>
                    <AutoCounter class="mt-2 text-4xl font-extrabold text-green-500" :start-amount="0" :end-amount="item.number" suffix="+" :name="`state-counter-${index}`" :decimals="0" :autoinit="true" />
                </li>
            </ul>
        </div>
    </div>
</template>
