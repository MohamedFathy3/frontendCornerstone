<script setup>
definePageMeta({
    ssr: false,
});
const menu = ref([
    { name: 'Overview', path: '/dashboard', icon: 'ph:monitor-light', subMenus: [] },
    {
        name: 'WebsiteData',
        path: '/dashboard/website-data',
        icon: 'ph:list-bullets-light',
        subMenus: [
            {
                name: 'Countries',
                path: '/dashboard/website-data',
                icon: 'ph:globe-hemisphere-west-light',
                subMenus: [],
            },
            { name: 'Services', path: '/dashboard/website-data/services', icon: 'ph:grid-four-light', subMenus: [] },
            { name: 'Pages', path: '/dashboard/website-data/pages', icon: 'ph:layout-light', subMenus: [] },
            // { name: 'Media', path: '/dashboard/website-data/media', icon: 'ph:image-light', subMenus: [] },
            // { name: 'Team', path: '/dashboard/website-data/team', icon: 'ph:user-circle-plus', subMenus: [] },
        ],
    },
    { name: 'Contact Messages', path: '/dashboard/messages', icon: 'ph:envelope-light', subMenus: [] },
    { name: 'Users', path: '/dashboard/users', icon: 'ph:users-duotone', subMenus: [] },
    { name: 'employee', path: '/dashboard/empley', icon: 'ph:users-duotone', subMenus: [] },
        { name: 'company', path: '/dashboard/company', icon: 'ph:gear-six-light', subMenus: [] },

    { name: 'Settings', path: '/dashboard/settings', icon: 'ph:gear-six-light', subMenus: [] },
]);

const userStore = useUserStore();
</script>

<template>
    <div class="relative flex min-h-screen flex-col">
        <ToastList />
        <div class="flex h-full relative">
            <div class="flex flex-col gap-5 p-5 min-w-64 min-h-screen border-r bg-primary">
                <div class="text-slate-300 border-b pb-3 border-white/10"><span class="font-semibold text-warning">CSM</span> Dashboard</div>
                <div class="grow">
                    <ul class="space-y-3 text-sm">
                        <template v-for="item in menu" :key="item.path">
                            <li>
                                <NuxtLink :class="[$route.path !== item.path ? 'text-white hover:bg-white/15' : 'gap-2 bg-white text-slate-800', 'flex items-center p-1.5 rounded-md group']" :to="item.subMenus.length > 0 ? '' : item.path">
                                    <div class="z-10 flex items-center truncate gap-5 justify-between w-full">
                                        <div class="inline-flex items-center">
                                            <Icon v-if="item.icon" :name="item.icon" class="w-6 h-6 mr-4 shrink-0 opacity-75" />
                                            <span class="truncate">{{ item.name }}</span>
                                        </div>
                                        <!-- <Icon v-if="item.subMenus.length > 0" name="solar:alt-arrow-down-outline" class="w-4 h-4 shrink-0 opacity-75" />-->
                                    </div>
                                </NuxtLink>
                                <ul v-if="item.subMenus.length > 0" class="bg-white/10 rounded-xl p-2 mt-2 gap-2">
                                    <li v-for="subItem in item.subMenus" :key="subItem.path" class="py-1.5">
                                        <NuxtLink :class="[$route.path !== subItem.path ? 'text-white hover:bg-white/15' : 'gap-2 bg-white text-slate-800', 'flex items-center p-1.5 rounded-md']" :to="subItem.path">
                                            <div class="z-10 inline-flex items-center truncate">
                                                <Icon v-if="subItem.icon" :name="subItem.icon" class="w-6 h-6 mr-4 shrink-0 opacity-75" />
                                                <span class="truncate">{{ subItem.name }}</span>
                                            </div>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="border-t pt-3 border-white/10 text-white">
                    <div v-if="userStore.user" class="flex items-center gap-3">
                        <div class="w-12 h-12 ring-4 ring-white/10 rounded-full">
                            <NuxtImg v-if="userStore.user.imageUrl" :alt="userStore.user.name" :src="userStore.user.imageUrl" :title="userStore.user.name" class="w-12 h-12 object-cover bg-white !rounded-full" />
                        </div>
                        <div>
                            <div class="font-medium">{{ userStore.user.name }}</div>
                            <div class="mt-1 text-xs">{{ userStore.user.email }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grow px-5">
                <div class="p-4 flex items-center justify-between gap-5">
                    <div>Path's</div>
                    <div>
                        <button class="btn btn-sm btn-danger" @click="userStore.logout()">Logout</button>
                    </div>
                </div>
                <main class="p-5 box mb-8">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>
