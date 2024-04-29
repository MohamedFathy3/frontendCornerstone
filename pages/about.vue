<script setup>
const { data: page, pending } = await useApiFetch(`/api/show-page/about`, {
    lazy: true,
    transform: (page) => {
        return page.data;
    },
});
</script>

<template>
    <div v-if="!pending">
        <div :style="{ backgroundImage: `url(${page.imageUrl})` }" class="min-h-64 flex flex-col place-content-center items-center bg-scroll bg-cover bg-no-repeat bg-center bg-primary bg-blend-multiply">
            <div class="text-center max-w-5xl px-6 mx-auto pb-8">
                <div v-if="page.name" class="text-4xl font-medium text-white">{{ page.name }}</div>
                <p v-if="page.description" class="text-xl font-light text-white mt-4">{{ page.description }}</p>
            </div>
        </div>
        <ul class="container px-6 sm:px-12 mt-8 divide-y">
            <template v-for="(section, i) in page.sections" :key="i">
                <li class="flex justify-between sm:gap-12 gap-8 items-start py-8">
                    <div :class="[section.image && 'lg:w-7/12', 'w-full  space-y-3']">
                        <div>
                            <div class="section-title">{{ section.name }}</div>
                            <div class="section-sub-title mt-2">{{ section.subTitle }}</div>
                        </div>
                        <div class="mt-5 space-y-3">
                            <p v-if="section.shortDescription" class="font-light text-lg" v-html="section.shortDescription" />
                            <ul>
                                <template v-for="(item, l) in section.items" :key="l">
                                    <li class="py-2">
                                        <div class="flex items-center gap-5">
                                            <Icon class="size-5 text-primary" name="solar:check-square-outline" />
                                            <div class="font-medium">{{ item.name }}</div>
                                        </div>
                                        <p class="mt-2 ml-10 font-light">{{ item.description }}</p>
                                    </li>
                                </template>
                            </ul>
                            <p v-if="section.description" class="font-light text-lg" v-html="section.description" />
                        </div>
                    </div>
                    <div v-if="section.image" :class="[i % 2 !== 0 ? 'order-first' : '', 'w-full lg:w-5/12 lg:col-span-4']">
                        <NuxtImg v-if="section.imageUrl" :alt="section.name" :src="section.imageUrl" :title="section.name" class="w-full h-96 object-cover bg-white !rounded-md zoom-in" />
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>
