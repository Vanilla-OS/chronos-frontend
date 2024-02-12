export default defineI18nLocale(async (locale) => {
    return {
      layouts: {
        title: '{title} - Chronos',
      },
      header: {
        documentation: 'Documentation',
      },
      index: {
        page_title: 'Welcome to Chronos',
        title: 'Vanilla OS Documentation',
        subtitle: 'Collections',
        articles: 'Articles',
      },
    }
  })