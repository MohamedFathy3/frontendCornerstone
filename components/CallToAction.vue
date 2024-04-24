<script setup lang="ts">
defineProps({
    content: {
        type: Object as () => Section,
        required: true,
    },
});
</script>

<template>
    <div :style="{ backgroundImage: `url(${content.imageUrl})` }" class="flex bg-scroll bg-cover bg-no-repeat bg-center bg-slate-900/70 bg-blend-multiply">
        <div class="container px-8 py-12 text-white">
            <div class="max-w-4xl px-6 mx-auto text-center mb-8">
                <div class="section-post-title" v-html="content.postTitle" />
                <div class="section-title text-warning" v-html="content.title" />
                <div class="section-description !text-center mt-1" v-html="content.subTitle" />
                <div class="mt-3 h-1 w-52 bg-white mx-auto" />
            </div>
            <ul class="grid xl:grid-cols-4 md:grid-cols-2 gap-5">
                <li v-for="item in content.items" :key="item.id">
                    <NuxtImg v-if="item.imageUrl" :src="item.imageUrl" :alt="item.description" :title="item.description" class="w-ful object-contain h-20 mx-auto" />
                    <div class="text-center">
                        <div class="text-3xl text-warning font-bold mt-3">
                            <span>{{ item.name }}</span>
                            <span class="ml-1">{{ item.shortDescription }}</span>
                        </div>
                        <div class="font-medium text-lg">{{ item.description }}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
