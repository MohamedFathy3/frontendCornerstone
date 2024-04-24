<script setup>
const slug = ref('home');
const { data, pending } = await useApiFetch(`/api/show-page/${slug.value}`, { lazy: true });

useSeoMeta({
    title: data.value ? data.value.title : 'Home',
    ogTitle: data.value ? data.value.title : 'Home',
    description: data.value ? data.value.description : null,
    keywords: data.value ? data.value.keywords : null,
    ogDescription: data.value ? data.value.description : null,
    ogImage: data.value ? data.value.imageUrl : null,
    twitterCard: data.value ? data.value.imageUrl : null,
});
</script>

<template>
    <div v-if="!pending">
        <HomeIntro v-if="data.data.sections.some((item) => item.slug === 'home_slider')" :content="data.data.sections.find((item) => item.slug === 'home_slider')" />
        <HomeInfo v-if="data.data.sections.some((item) => item.slug === 'home_about')" :content="data.data.sections.find((item) => item.slug === 'home_about')" />
        <HomeServices v-if="data.data.sections.some((item) => item.slug === 'home_services')" :content="data.data.sections.find((item) => item.slug === 'home_services')" />
        <CallToAction v-if="data.data.sections.some((item) => item.slug === 'home_cta')" :content="data.data.sections.find((item) => item.slug === 'home_cta')" />
        <Offices v-if="data.data.sections.some((item) => item.slug === 'home_offices')" :content="data.data.sections.find((item) => item.slug === 'home_offices')" />
    </div>
</template>
