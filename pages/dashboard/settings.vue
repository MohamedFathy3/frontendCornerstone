<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});
const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch(`/api/setting-sections`, {
    lazy: true,
    transform: (rows) => {
        return rows.data;
    },
});
const isLoading = ref(false);
const selectedSectionIndex = ref(0);

function setSelectedSectionIndex(index) {
    selectedSectionIndex.value = index;
}

const updateSettings = async () => {
    const originalSettingsArray = rows.value[selectedSectionIndex.value].children;
    const updateArrayValues = originalSettingsArray.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        value: item.value,
    }));

    const { data, error } = await useApiFetch(`/api/setting-sections`, {
        method: 'PATCH',
        body: {
            fields: updateArrayValues,
        },
        lazy: true,
    });

    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }

    console.log('updating settings', updateArrayValues);
};
const buttonStyles = ref([
    { name: 'Primary', id: 'primary' },
    { name: 'Secondary', id: 'secondary' },
    { name: 'Success', id: 'success' },
    { name: 'Yellow', id: 'warning' },
    { name: 'Red', id: 'danger' },
    { name: 'Dark', id: 'dark' },
]);
const buttonTargets = ref([
    { name: 'Self (Same Tab)', id: '_self' },
    { name: 'New Tab', id: '_blank' },
]);
</script>
<template>
    <div v-if="!pending && rows" class="grid lg:grid-cols-12 gap-5 items-start">
        <div class="2xl:col-span-3 lg:col-span-3">
            <div class="intro-y first:my-0">
                <ul class="text-sm font-medium">
                    <template v-for="(section, index) in rows" :key="section.id">
                        <li :class="[index === selectedSectionIndex ? 'text-white bg-primary' : 'bg-slate-100', 'intro-y cursor-pointer group hover:bg-slate-900 p-3 my-1 rounded-md ease-in-out duration-150']" @click="setSelectedSectionIndex(index)">
                            <div :class="[index === selectedSectionIndex ? 'text-white' : '', 'group-hover:text-white group-hover:translate-x-4 flex items-center ease-in-out duration-150']">
                                <Icon name="solar:double-alt-arrow-right-linear" class="w-4 h-4 mr-2 opacity-50" />
                                {{ section.label }}
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="2xl:col-span-9 lg:col-span-9">
            <div class="flex flex-col min-h-[15rem]">
                <div class="flex items-center border-b border-slate-200/60 pb-3 mb-3">
                    <div class="font-medium truncate">{{ rows[selectedSectionIndex].label }}</div>
                </div>
                <div class="grow">
                    <div class="space-y-8">
                        <template v-for="field in rows[selectedSectionIndex].children" :key="field.id">
                            <template v-if="field.type === 'text' || field.type === 'number' || field.type === 'textarea'">
                                <FormInputField v-model="field.value" :label="field.label" class="intro-y" :name="field.name" :type="field.type" :placeholder="field.placeholder" />
                            </template>
                            <template v-if="field.type === 'boolean'">
                                <div class="lg:col-span-6">
                                    <div data-tw-merge class="flex items-center justify-between gap-5">
                                        <label for="active-switch" class="cursor-pointer text-sm font-medium capitalize">
                                            <span>{{ field.name }}</span>
                                        </label>
                                        <input id="active-switch" v-model.number="field.value" type="checkbox" class="form-checkbox-input" />
                                    </div>
                                </div>
                            </template>
                            <template v-if="field.type === 'select'">
                                <FormSelectField v-model.number="field.value" class="intro-y" label-value="name" key-value="id" :select-data="getSelectData(field.data)" :label="field.label" :name="field.name" :placeholder="field.placeholder" />
                            </template>
                            <template v-if="field.type === 'uploader'">
                                <FormUploader v-model="field.value" :allowed-types="['image', 'svg']" :label="field.label" class="intro-y" :name="field.name" :max="1" />
                            </template>
                            <template v-if="field.type === 'button'">
                                <div>
                                    <div>{{ field.label }}</div>
                                    <div class="mt-3 rounded-md p-5 border border-slate-100 grid grid-cols-12 gap-5 bg-slate-50">
                                        <FormInputField v-model="field.value.label" class="col-span-12 sm:col-span-6" label="Label" :name="field.name + '-button-label-' + field.id" placeholder="Label" />
                                        <FormInputField v-model="field.value.icon" class="col-span-12 sm:col-span-6" label="Icon" :name="field.name + '-button-icon-' + field.id" placeholder="Icon" />
                                        <FormSelectField
                                            v-model="field.value.style"
                                            class="col-span-12 sm:col-span-6"
                                            :select-data="buttonStyles"
                                            labelvalue="name"
                                            label="Style"
                                            keyvalue="id"
                                            :name="field.name + '-button-style-' + field.id"
                                            placeholder="Style"
                                        />
                                        <FormSelectField
                                            v-model="field.value.target"
                                            class="col-span-12 sm:col-span-6"
                                            :select-data="buttonTargets"
                                            labelvalue="name"
                                            label="Target"
                                            keyvalue="id"
                                            :name="field.name + '-button-target-' + field.id"
                                            placeholder="Url Target"
                                        />
                                        <FormInputField v-model="field.value.url" class="col-span-12 sm:col-span-6" label="Url" :name="field.name + '-button-url-' + field.id" placeholder="Url" />
                                    </div>
                                </div>
                            </template>
                            <template v-if="field.type === 'list'">
                                <pre>
                                        {{ field.value }}
                                    </pre
                                >
                                <!--                                    <div>-->
                                <!--                                        <div class="flex items-center justify-between gap-5">-->
                                <!--                                            <div>{{ field.label }}</div>-->
                                <!--                                            <div>-->
                                <!--                                                <button type="button" class="btn btn-sm btn-primary" @click="openItemModal(null, field.id)">-->
                                <!--                                                    <PlusIcon class="w-4 h-4 mr-2" />-->
                                <!--                                                    <span>Add New</span>-->
                                <!--                                                </button>-->
                                <!--                                            </div>-->
                                <!--                                        </div>-->
                                <!--                                        <div class="border border-slate-100 p-3 rounded-md space-y-3 mt-3">-->
                                <!--                                            <template v-for="(item, itemIndex) in field.value" :key="itemIndex">-->
                                <!--                                                <div v-if="field.data === 'menu'" class="group bg-slate-50 hover:bg-slate-200/75 hover:scale-[101%] ease-in-out duration-300 rounded-md p-3 grid sm:grid-cols-12 gap-5 items-center">-->
                                <!--                                                    <div class="sm:col-span-5">-->
                                <!--                                                        <div class="font-medium text-slate-700">{{ item.title }}</div>-->
                                <!--                                                        <div class="mt-1 text-xs italic text-slate-500">{{ item.url }}</div>-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-4">-->
                                <!--                                                        <div class="text-xs">{{ buttonTargets.find((_) => _.id === item.target).name }}</div>-->
                                <!--                                                        <div :class="[item.active ? 'text-success' : 'text-danger', 'mt-1 text-xs font-semibold']" v-html="item.active ? 'Active' : 'Not Active'" />-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-3 flex items-center space-x-4">-->
                                <!--                                                        <button type="button" class="btn btn-sm group-hover:btn-dark btn-secondary grow" @click="openItemModal(itemIndex, field.id)">Update</button>-->
                                <!--                                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeItem(itemIndex, field.id)">-->
                                <!--                                                            <Icon name="solar:close-square-linear" class="w-4 h-4" />-->
                                <!--                                                        </button>-->
                                <!--                                                    </div>-->
                                <!--                                                </div>-->
                                <!--                                                <div v-else-if="field.data === 'list'" class="group bg-slate-50 hover:bg-slate-200/75 hover:scale-[101%] ease-in-out duration-300 rounded-md p-3 grid sm:grid-cols-12 gap-5 items-center">-->
                                <!--                                                    <div class="sm:col-span-7">-->
                                <!--                                                        <div class="text-slate-700 line-clamp-1">{{ item.title }}</div>-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-2">-->
                                <!--                                                        <div :class="[item.active ? 'text-success' : 'text-danger', 'mt-1 text-xs font-semibold']" v-html="item.active ? 'Active' : 'Not Active'" />-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-3 flex items-center space-x-4">-->
                                <!--                                                        <button type="button" class="btn btn-sm group-hover:btn-dark btn-secondary grow" @click="openItemModal(itemIndex, field.id)">Update</button>-->
                                <!--                                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeItem(itemIndex, field.id)">-->
                                <!--                                                            <Icon name="solar:close-square-linear" class="w-4 h-4" />-->
                                <!--                                                        </button>-->
                                <!--                                                    </div>-->
                                <!--                                                </div>-->
                                <!--                                                <div v-else-if="field.data === 'table'" class="group bg-slate-50 hover:bg-slate-200/75 hover:scale-[101%] ease-in-out duration-300 rounded-md p-3 grid sm:grid-cols-12 gap-5 items-center">-->
                                <!--                                                    <div class="sm:col-span-7">-->
                                <!--                                                        <div class="text-slate-700 line-clamp-2">{{ item.title }}</div>-->
                                <!--                                                        <div class="mt-1 font-light text-slate-500 line-clamp-2">{{ item.target }}</div>-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-2">-->
                                <!--                                                        <div :class="[item.active ? 'text-success' : 'text-danger', 'mt-1 text-xs font-semibold']" v-html="item.active ? 'Active' : 'Not Active'" />-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="sm:col-span-3 flex items-center space-x-4">-->
                                <!--                                                        <button type="button" class="btn btn-sm group-hover:btn-dark btn-secondary grow" @click="openItemModal(itemIndex, field.id)">Update</button>-->
                                <!--                                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeItem(itemIndex, field.id)">-->
                                <!--                                                            <Icon name="solar:close-square-linear" class="w-4 h-4" />-->
                                <!--                                                        </button>-->
                                <!--                                                    </div>-->
                                <!--                                                </div>-->
                                <!--                                            </template>-->
                                <!--                                        </div>-->
                                <!--                                    </div>-->
                            </template>
                            <template v-if="field.type === 'datetime'">
                                <div>
                                    <div>{{ field.label }}</div>
                                    <VueDatePicker v-model="field.value" class="mt-3" :auto-apply="true" :teleport="true" :time-picker-inline="true" format="dd-MM-yyyy - HH:mm" />
                                </div>
                            </template>
                            <template v-if="field.type === 'datetime_range'">
                                <div>
                                    <div>{{ field.label }}</div>
                                    <VueDatePicker v-model="field.value" range class="mt-3" :teleport="true" :auto-apply="true" :enable-time-picker="false" format="dd-MM-yyyy" />
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
                <div class="pt-5 mt-5 border-t border-slate-200/60 dark:border-darkmode-400">
                    <button class="btn btn-primary btn-lg w-full" :disabled="isLoading" type="submit" @click="updateSettings">Update</button>
                </div>
            </div>
        </div>
        <!-- END: Settings Sections -->
        <!--        <Modal v-can="['page-conference-setting']" :show="itemModalOpen" size="modal-xl" @hidden="closeItemModal()">-->
        <!--            <form class="validate-form" @submit.prevent="addItem(fieldItemIndex, fieldItemId)">-->
        <!--                <ModalHeader>-->
        <!--                    <h2 class="font-medium text-base mr-auto">-->
        <!--                        {{ editMode ? 'Update Item' : 'Add New Item' }}-->
        <!--                    </h2>-->
        <!--                </ModalHeader>-->
        <!--                <ModalBody class="grid grid-cols-12 gap-5">-->
        <!--                    <InputField-->
        <!--                        v-model="item.title"-->
        <!--                        :class="[itemDataType === 'list' ? 'col-span-12' : 'col-span-12 sm:col-span-6', '']"-->
        <!--                        :label="$t('forms.attributes.title')"-->
        <!--                        name="list-item-label"-->
        <!--                        :type="itemDataType === 'list' ? 'textarea' : 'text'"-->
        <!--                        :placeholder="$t('forms.attributes.title')"-->
        <!--                    />-->
        <!--                    <template v-if="itemDataType === 'menu'">-->
        <!--                        <SelectField-->
        <!--                            v-model="item.target"-->
        <!--                            label-value="name"-->
        <!--                            key-value="id"-->
        <!--                            :select-data="buttonTargets"-->
        <!--                            class="col-span-12 sm:col-span-6"-->
        <!--                            :label="$t('forms.attributes.target')"-->
        <!--                            name="list-item-target"-->
        <!--                            :placeholder="$t('forms.attributes.target')"-->
        <!--                        />-->
        <!--                    </template>-->
        <!--                    <template v-else>-->
        <!--                        <InputField v-if="itemDataType === 'table'" v-model="item.target" class="col-span-12 sm:col-span-6" :label="$t('forms.attributes.target')" name="list-item-label" :placeholder="$t('forms.attributes.title')" />-->
        <!--                    </template>-->
        <!--                    <template v-if="itemDataType === 'menu'">-->
        <!--                        <InputField v-model="item.url" class="col-span-12 sm:col-span-6" :label="$t('forms.attributes.url')" name="list-item-url" :placeholder="$t('forms.attributes.url')" />-->
        <!--                    </template>-->
        <!--                    <Switch v-model.number="item.active" :label="$t('forms.attributes.active')" name="list-item-active" />-->
        <!--                </ModalBody>-->
        <!--                <ModalFooter class="space-x-2">-->
        <!--                    <button class="btn btn-outline-secondary" type="button" @click="closeItemModal()">-->
        <!--                        {{ $t('g.cancel') }}-->
        <!--                    </button>-->
        <!--                    <button class="btn btn-primary" :disabled="isLoading" type="submit">-->
        <!--                        <LoadingIcon :show="isLoading" icon="three-dots" color="white" class="w-4 h-4 mr-2" />-->
        <!--                        {{ editMode ? $t('g.update') : $t('g.save') }}-->
        <!--                    </button>-->
        <!--                </ModalFooter>-->
        <!--            </form>-->
        <!--        </Modal>-->
    </div>
</template>
