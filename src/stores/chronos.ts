export const useChronosStore = defineStore('chronos', {
  state: () => ({
    prefLang: 'en',
    lastUpdate: undefined as Date | undefined,
    logoUrl: 'https://docs.vanillaos.org/logo.svg',
    extraLinks: [
      {name: 'Website', url: 'https://vanillaos.org'},
      {name: 'GitHub', url: 'https://github.com/vanilla-os/documentation'}
    ] as { name: string, url: string }[],
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    setPrefLang(lang: string) {
      this.prefLang = lang;
    },
  },
})