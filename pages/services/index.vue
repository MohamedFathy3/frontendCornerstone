<script setup>
const { data, error, pending } = await useApiFetch(`/api/service`, {
    lazy: true,
    transform: (page) => {
        return page.data;
    },
});
</script>

<template>
    <div>
        <div class="pt-12 pb-5 container text-center">
            <div class="text-lg opacity-75">CSM</div>
            <div class="flex items-center place-content-center">
                <div class="flex items-center gap-5">
                    <div class="content-[''] border-b-4 border-warning min-w-30" />
                    <div class="text-5xl mt-2 font-bold">Services</div>
                    <div class="content-[''] border-b-4 border-warning min-w-30" />
                </div>
            </div>
        </div>
        <HomeServices v-if="!pending" :content="data" />
    </div>
</template>
