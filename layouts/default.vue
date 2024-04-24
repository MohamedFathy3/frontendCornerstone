<script setup></script>

<template>
    <div class="relative flex min-h-screen flex-col">
        <TheHeader />
        <main class="grow">
            <slot />
        </main>
        <TheFooter />
    </div>
</template>
