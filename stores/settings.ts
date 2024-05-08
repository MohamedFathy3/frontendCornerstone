export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<SettingsData[]>([]);
    const countries = ref<CountryData[]>([]);
    const setSettings = (data?: SettingsData[]) => {
        // If data is undefined or not an array, set it to an empty array
        settings.value = Array.isArray(data) ? data : ([] as SettingsData[]);
    };

    const setCountries = (data?: CountryData[]) => {
        // If data is undefined or not an array, set it to an empty array
        countries.value = Array.isArray(data) ? data : ([] as CountryData[]);
    };

    const fetchSetting = async () => {
        const { data, error } = await useApiFetch('/api/setting-public', {
            lazy: true,
        });
        console.log(data.value);
        console.log(error.value);
        setSettings((data.value as { data: SettingsData[] | undefined }).data || []!);
    };
    const fetchCountries = async () => {
        const { data, error } = await useApiFetch('/api/country-public-list', {
            lazy: true,
        });
        console.log(data.value);
        console.log(error.value);
        setCountries((data.value as { data: CountryData[] | undefined }).data || []!);
    };

    return {
        settings,
        setSettings,
        fetchSetting,
        countries,
        setCountries,
        fetchCountries,
    };
});
