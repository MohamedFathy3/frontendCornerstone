<script setup lang="ts">
defineProps({
    content: {
        type: Object as () => Section,
        required: true,
    },
});
const { data: services, pending } = await useApiFetch<BackendResponse>(`/api/service-home`, { lazy: true });
</script>

<template>
    <div v-if="!pending" class="relative pt-8 pb-12 bg-slate-100">
        <div class="container px-8">
            <div class="text-center">
                <div class="section-post-title">{{ content.postTitle }}</div>
                <div class="section-title">{{ content.title }}</div>
                <div class="mt-1.5 mx-auto h-1 w-52 bg-warning" />
            </div>
            <ul v-if="((services as BackendResponse).data as Service[]).length" class="grid xl:grid-cols-3 md:grid-cols-2 gap-5 mt-8">
                <li v-for="service in (services as BackendResponse).data" :key="service.id">
                    <div class="flex flex-col bg-white rounded-xl overflow-hidden border h-full group hover:scale-105 ease-in-out duration-300">
                        <div class="h-52 object-cover w-full overflow-hidden">
                            <NuxtImg class="group-hover:scale-105 ease-in-out duration-300" :src="service.imageUrl" :alt="service.name" :title="service.name" />
                        </div>
                        <div class="grow pt-3 px-5">
                            <div class="font-medium text-lg text-center pb-1.5 border-b border-dashed">{{ service.name }}</div>
                            <div class="mt-2 section-description line-clamp-3">{{ service.shortDescription }}</div>
                        </div>
                        <div class="p-5">
                            <button class="btn btn-primary w-full">Read More</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
