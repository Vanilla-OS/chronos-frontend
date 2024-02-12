// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@pinia/nuxt', // needed
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-mdi',
  ],
  i18n: {
    baseUrl: 'https://fabricators.ltd',
    strategy: 'prefix',
    locales: [
      {
        code: 'en',
        iso: 'en',
        file: 'en.ts',
        isCatchallLocale: true
      },
      {
        code: 'it',
        file: 'it.ts',
        iso: 'it-IT'
      }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'lang',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',  // recommended
    },
  },
})