export default defineNuxtPlugin(async (nuxtApp) => {
    const settingsStore = useSettingsStore();
    await settingsStore.fetchSetting();
    await settingsStore.fetchCountries();
});
