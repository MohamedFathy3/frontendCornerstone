<script setup>
import Vue3Autocounter from 'vue3-autocounter';

const props = defineProps({
    startAmount: {
        type: Number,
        default: 0,
    },
    endAmount: {
        type: Number,
        default: 5000,
    },
    duration: {
        type: Number,
        default: 5,
    },
    name: {
        type: String,
        default: 'counter',
    },
    prefix: {
        type: String,
        default: '',
    },
    suffix: {
        type: String,
        default: '+',
    },
    separator: {
        type: String,
        default: ',',
    },
    decimalSeparator: {
        type: String,
        default: '.',
    },
    decimals: {
        type: Number,
        default: 2,
    },
    autoinit: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <div>
        <Vue3Autocounter
            :ref="props.name"
            :start-amount="props.startAmount"
            :end-amount="props.endAmount"
            :duration="props.duration"
            :prefix="props.prefix"
            :suffix="props.suffix"
            :separator="props.separator"
            :decimal-separator="props.decimalSeparator"
            :decimals="props.decimals"
            :autoinit="props.autoinit"
        />
    </div>
</template>
