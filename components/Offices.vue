<script setup lang="ts">
defineProps({
    content: {
        type: Object as () => Section,
        required: true,
    },
});
</script>

<template>
    <div>
        <div class="container p-8">
            <div class="grid lg:grid-cols-2 gap-12">
                <div class="px-6">
                    <div>
                        <div class="section-title">{{ useSettingValue('map_title') ?? 'Location' }}</div>
                        <div class="mt-3 h-1 w-52 bg-warning" />
                    </div>
                    <div class="mt-5">
                        <div class="h-[18rem]" v-html="useSettingValue('contact_map_code')" />
                    </div>
                </div>
                <div class="px-6">
                    <div>
                        <div class="section-title">{{ content.title }}</div>
                        <div class="mt-3 h-1 w-52 bg-warning" />
                    </div>
                    <ul class="mt-5 divide-y divide-dashed !divide-slate-300/75">
                        <li v-for="item in content.items" :key="item.id" class="p-2">
                            <div class="text-lg">
                                <span>{{ item.url }},</span>
                                <span class="font-medium ml-1.5">{{ item.name }}</span>
                            </div>
                            <div>
                                <div class="section-description mt-0.5">{{ item.shortDescription }}</div>
                                <div class="section-description mt-0.5">{{ item.description }}</div>
                            </div>
                        </li>
                    </ul>
                    <div class="py-8">{{ content.description }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
