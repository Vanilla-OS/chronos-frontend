export default defineI18nLocale(async (locale) => {
    return {
      layouts: {
        title: '{title} - Chronos',
      },
      header: {
        documentation: 'Documentazione',
      },
      index: {
        page_title: 'Benvenuti in Chronos',
        title: 'Documentazione Vanilla OS',
        subtitle: 'Collezioni',
        articles: 'Articoli',
      },
    }
  })