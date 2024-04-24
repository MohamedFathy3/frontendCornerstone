<script setup lang="ts">
defineProps({
    content: {
        type: Object as () => Section,
        required: true,
    },
});
</script>

<template>
    <div class="relative py-12 bg-white">
        <div class="container px-8 grid lg:grid-cols-12 gap-8 items-start pb-8">
            <div class="lg:col-span-6 -intro-x">
                <NuxtImg class="w-full object-contain hover:scale-105 ease-in-out duration-300" :src="content.imageUrl" :alt="content.name" :title="content.name" />
            </div>
            <div class="lg:col-span-6 space-y-3 intro-x">
                <div>
                    <div class="section-post-title" v-html="content.postTitle" />
                    <div class="section-title" v-html="content.title" />
                </div>
                <div class="section-description" v-html="content.description" />
                <div class="flex items-center gap-5">
                    <div v-if="content.buttonOneActive">
                        <NuxtLink :to="content.buttonOne.url" :target="content.buttonOne.target">
                            <button :class="['px-6 btn btn-' + content.buttonOne.style]">{{ content.buttonOne.label }}</button>
                        </NuxtLink>
                    </div>
                    <div v-if="content.buttonTwoActive">
                        <NuxtLink :to="content.buttonTwo.url" :target="content.buttonTwo.target">
                            <button :class="['px-6 btn btn-' + content.buttonTwo.style]">
                                <Icon v-if="content.buttonTwo.icon" :name="content.buttonTwo.icon" class="w-5 h-5 mr-2" />
                                <span>{{ content.buttonTwo.label }}</span>
                            </button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="divider">
            <svg data-name="Arrow Down Divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" class="fill-slate-100" />
            </svg>
        </div>
    </div>
</template>
<style scoped>
.divider {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.divider svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 50px;
}
</style>
