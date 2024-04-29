<script setup>
const route = useRoute();

const { data: service, pending } = await useApiFetch(`/api/show-service/${route.params.slug}`, {
    lazy: true,
    transform: (service) => {
        return service.data;
    },
});
</script>

<template>
    <div v-if="!pending" class="">
        <div :style="{ backgroundImage: `url(${service.imageUrl})` }" class="min-h-64 flex flex-col place-content-center items-center bg-scroll bg-cover bg-no-repeat bg-center bg-primary bg-blend-multiply">
            <div class="text-center max-w-5xl px-6 mx-auto pb-8">
                <div v-if="service.name" class="text-4xl font-medium text-white">{{ service.name }}</div>
                <p v-if="service.subTitle" class="text-xl font-light text-white mt-4">{{ service.subTitle }}</p>
            </div>
        </div>
        <div class="px-6 sm:px-12">
            <div class="-mt-12 container box p-8 px-6 sm:px-12 space-y-5 mb-5 shadow-none">
                <div v-if="service.shortDescription" class="font-light" v-html="service.shortDescription" />
                <div v-if="service.description" class="font-light" v-html="service.description" />
                <ul v-if="service.list.length > 0" class="font-light divide-y divide-dashed">
                    <template v-for="(item, i) in service.list" :key="i">
                        <li class="py-2">
                            <div class="flex items-center gap-5">
                                <Icon class="size-5 text-primary" name="solar:check-square-outline" />
                                <div class="font-medium">{{ item.title }}</div>
                            </div>
                            <p class="mt-2 ml-10">{{ item.description }}</p>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
