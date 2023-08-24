import { defineStore } from 'pinia';

export const useChronosStore = defineStore('atlas', {
    state: () => ({
        prefLang: 'en',
    }),
    persist: {
        storage: window.localStorage,
    },
    actions: {
        setPrefLang(lang: string) {
            this.prefLang = lang;
        },
    },
});
