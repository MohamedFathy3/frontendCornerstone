<script setup>
const props = defineProps({
    flexTitle: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: null,
    },
    rows: {
        type: Number,
        default: 5,
    },
    maxlength: {
        type: Number,
        default: 524288,
    },
    size: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'text',
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    errors: {
        type: Array,
        default: () => [],
    },
    required: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
        default: '',
    },
    modelValue: {
        type: [String],
        default: '',
    },
});

const emit = defineEmits(['update:model-value']);
const value = ref(props.modelValue);
onMounted(() => {
    value.value = props.modelValue;
});
watchEffect(() => {
    emit('update:model-value', value.value);
});
</script>

<template>
    <div :class="[flexTitle ? 'form-inline' : '']" class="text-base">
        <label v-if="label" :class="[flexTitle ? '!text-left sm:w-20' : '']" :for="name" class="form-label">
            <span>{{ label }}</span>
            <span v-if="label && required" class="ml-1 text-sm text-danger">*</span>
        </label>
        <template v-if="type !== 'textarea'">
            <div :class="[icon ? 'relative' : '']" class="grow">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon :name="icon" class="h-5 w-5 text-slate-400 dark:text-slate-600" />
                </div>
                <input
                    :id="id === null ? name : id"
                    v-model="value"
                    :aria-label="label ?? name"
                    :autocomplete="autocomplete"
                    :autofocus="autofocus"
                    :class="[size === 'lg' ? 'form-control-lg' : '', size === 'sm' ? 'form-control-sm' : '', icon ? 'pl-10' : '', errors?.length > 0 ? '!border-danger' : '', rounded ? 'form-control-rounded' : '']"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :required="required"
                    :type="type"
                    class="form-control placeholder:!text-slate-400"
                />
            </div>
            <div v-if="description" class="form-help" v-html="description" />
            <template v-if="errors.length > 0">
                <ul class="mt-1">
                    <li v-for="(error, errorIndex) in errors" :key="errorIndex" class="text-sm text-danger">
                        {{ error.$message }}
                    </li>
                </ul>
            </template>
        </template>
        <template v-if="type === 'textarea'">
            <div class="grow">
                <textarea
                    :id="id === null ? name : id"
                    v-model="value"
                    :aria-label="label ?? name"
                    :autocomplete="autocomplete"
                    :autofocus="autofocus"
                    :class="[size === 'lg' ? 'form-control-lg' : '', size === 'sm' ? 'form-control-sm' : '', errors?.length > 0 ? '!border-danger' : '', rounded ? 'form-control-rounded' : '']"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :required="required"
                    :rows="rows"
                    class="form-control"
                />
            </div>
            <div v-if="description" class="form-help" v-html="description" />
            <template v-if="errors.length > 0">
                <ul class="mt-1">
                    <li v-for="(error, errorIndex) in errors" :key="errorIndex" class="text-sm text-danger">
                        {{ error.$message }}
                    </li>
                </ul>
            </template>
        </template>
    </div>
</template>
