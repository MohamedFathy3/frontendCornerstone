export const useVisitStore = defineStore('visit', () => {
    // Main Objects
    const ipDetails = ref<ipDetailsResponse>();

    // Setting Data to the Main Objects
    const setIpDetails = (data?: ipDetailsResponse) => (ipDetails.value = data);

    return { ipDetails, setIpDetails };
});
