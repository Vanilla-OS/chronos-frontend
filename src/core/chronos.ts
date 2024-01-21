import type { App } from "vue";
import axios from "axios";
import type { Article, ArticlesResponse, SearchResponse, ChronosConfig } from "@/core/models";

interface ChronosAPI {
  config(): Promise<ChronosConfig>;
  getStatus(collectionShortName: string): Promise<string>;
  getLangs(collectionShortName: string): Promise<string[]>;
  getArticles(lang: string, collectionShortName: string): Promise<ArticlesResponse>;
  countArticles(lang: string, collectionShortName: string): Promise<number>;
  getArticleByLanguageAndSlug(lang: string, slug: string, collectionShortName: string): Promise<Article | null>;
  searchArticles(lang: string, query: string, collectionShortName: string): Promise<SearchResponse>;
}

const findCollectionByUrl = (config: ChronosConfig, url: string) => {
  return config.chronosCollections.find(collection => collection.url === url);
};

const ChronosPlugin = {
  install: async (app: App) => {
    const api: ChronosAPI = {
      async config() {
        try {
          const response = await axios.get("/chronos.json");
          return response.data as ChronosConfig;
        } catch (error) {
          throw new Error("Failed to fetch Chronos configuration");
        }
      },

      async getStatus(collectionShortName: string) {
        try {
          const config = await api.config();
          const collection = config.chronosCollections.find(c => c.shortName === collectionShortName);
          if (!collection) {
            throw new Error(`Collection with shortName ${collectionShortName} not found`);
          }

          const response = await axios.get(collection.url);
          return response.data.status;
        } catch (error) {
          throw new Error('Failed to get server status');
        }
      },

      async getLangs(collectionShortName: string) {
        try {
          const config = await api.config();
          const collection = config.chronosCollections.find(c => c.shortName === collectionShortName);
          if (!collection) {
            throw new Error(`Collection with shortName ${collectionShortName} not found`);
          }

          const response = await axios.get(`${collection.url}/langs`);
          return response.data;
        } catch (error) {
          throw new Error('Failed to get langs');
        }
      },

      async getArticles(lang: string, collectionShortName: string) {
        try {
          const config = await api.config();
          const collection = config.chronosCollections.find(c => c.shortName === collectionShortName);
          if (!collection) {
            throw new Error(`Collection with shortName ${collectionShortName} not found`);
          }

          const response = await axios.get(`${collection.url}/articles/${lang}`);
          return response.data;
        } catch (error) {
          throw new Error('Failed to get articles');
        }
      },

      async countArticles(lang: string, collectionShortName: string) {
        try {
          const articles = await api.getArticles(lang, collectionShortName);
          return articles.articles.length;
        } catch (error) {
          throw new Error('Failed to count articles');
        }
      },

      async getArticleByLanguageAndSlug(lang: string, slug: string, collectionShortName: string) {
        try {
          const config = await api.config();
          const collection = config.chronosCollections.find(c => c.shortName === collectionShortName);
          if (!collection) {
            throw new Error(`Collection with shortName ${collectionShortName} not found`);
          }

          const response = await axios.get(`${collection.url}/articles/${lang}/${slug}`);
          return response.data;
        } catch (error) {
          throw new Error('Failed to get article');
        }
      },

      async searchArticles(lang: string, query: string, collectionShortName: string): Promise<SearchResponse> {
        try {
          const config = await api.config();
          const collection = config.chronosCollections.find(c => c.shortName === collectionShortName);
          if (!collection) {
            throw new Error(`Collection with shortName ${collectionShortName} not found`);
          }

          const response = await axios.get(`${collection.url}/search/${lang}?q=${query}`);
          console.log(`${collection.url}/search/${lang}?q=${query}`);
          return response.data;
        } catch (error) {
          throw new Error('Failed to search articles');
        }
      }
    };

    app.config.globalProperties.$chronosAPI = api;
  }
};

export default ChronosPlugin;
