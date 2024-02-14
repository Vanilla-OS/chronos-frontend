<template>
  <section class="bg-gray-100 text-black text-center py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold">{{ activeCollection!.title }}</h1>
      <p class="mt-4">{{ activeCollection!.description }}</p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

    <aside class="bg-white p-4 rounded-lg shadow md:sticky top-2 flex flex-row gap-4 mt-2 items-center">
      <router-link class="text-blue-600 flex items-center mr-auto" to="/">
        <i class="material-icons">arrow_back</i>
        <span class="hidden sm:inline">Back to collections</span>
      </router-link>

      <div class="flex flex-row items-center gap-2" v-if="articlesResponse.tags">
        <label for="tag-filter" class="whitespace-nowrap text-sm font-medium text-gray-700">Tags:</label>
        <CustomSelect :options="articlesResponse.tags" v-model="selectedTags" multiple placeholder="Select tags" />
      </div>

      <div class="flex flex-row items-center gap-2">
        <label for="date-filter" class="whitespace-nowrap text-sm font-medium text-gray-700">Order:</label>
        <CustomSelect :options="['Recent', 'Oldest']" v-model="selectedDate" placeholder="Select date" />
      </div>
    </aside>

    <div class="flex-1" v-if="articlesResponse?.articles">
      <div class="my-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article v-for="article in filteredArticles" :key="article.Slug"
            class="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out p-5">
            <div class="flex-1">
              <h4 class="text-xl font-semibold mb-2">{{ article.Title }}</h4>
              <p class="text-gray-700 mb-4">{{ article.Description }}</p>
              <div class="flex flex-wrap gap-2 mt-2 mb-4">
                <span v-for="tag in article.Tags" :key="tag"
                  class="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium">
                  {{ tag }}
                </span>
              </div>
            </div>
            <router-link :to="`/${collectionName}/${chronosStore.prefLang}/${article.Slug}`"
              class="mt-auto inline-flex items-center text-lg text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-150 ease-in-out">
              Read the article
              <i class="material-icons ml-2">arrow_forward</i>
            </router-link>
          </article>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Loading...</p>
    </div>

  </section>
</template>

  
<script lang="ts">
import { defineComponent } from "vue";
import type { ArticlesResponse, Article, ChronosConfig, ChronosCollection } from "@/core/models";
import { useChronosStore } from "@/core/store";
import CustomSelect from "../components/CustomSelect.vue";

export default defineComponent({
  name: "CollectionView",
  components: {
    CustomSelect,
  },
  data() {
    return {
      articlesResponse: {} as ArticlesResponse,
      articles: [] as Article[],
      chronosConfig: {} as ChronosConfig,
      collectionName: "",
      activeCollection: {} as ChronosCollection | undefined,
      selectedTags: [],
      selectedDate: ["Recent"]
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
    filteredArticles() {
      let filtered = this.articles;
      if (this.selectedTags.length > 0) {
        filtered = filtered.filter((article) => {
          if (article.Tags === null) return false;
          return this.selectedTags.every((tag) => article.Tags.includes(tag));
        });
      }

      if (this.selectedDate[0] === 'Recent') {
        filtered = filtered.sort((a, b) => new Date(b.PublicationDate).getTime() - new Date(a.PublicationDate).getTime());
      } else if (this.selectedDate[0] === 'Oldest') {
        filtered = filtered.sort((a, b) => new Date(a.PublicationDate).getTime() - new Date(b.PublicationDate).getTime());
      }

      return filtered;
    }
  },
  async mounted() {
    // @ts-ignore
    this.chronosConfig = await this.$chronosAPI.config();
    this.collectionName = this.$route.params.collection as string;
    this.activeCollection = this.chronosConfig.chronosCollections.find((collection) => collection.shortName === this.collectionName);

    this.fetchArticles();

    this.chronosStore.$subscribe(() => {
      this.fetchArticles();
    });

    this.setHead();
  },
  methods: {
    async fetchArticles() {
      // @ts-ignore
      this.$chronosAPI.getArticles(this.chronosStore.prefLang, this.collectionName).then((response) => {
        this.articlesResponse = response;
        this.articles = this.articlesResponse.articles;
      });
    },
    setHead() {
      window.document.title = this.activeCollection!.title;
      const metaTags = [
        { name: "description", content: this.activeCollection!.description },
        { name: "og:title", content: this.activeCollection!.title },
        { name: "og:description", content: this.activeCollection!.description },
        { name: "og:image", content: this.chronosConfig!.logoUrl },
        { name: "og:url", content: window.location.href },
        { name: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: this.activeCollection!.title },
        { name: "twitter:description", content: this.activeCollection!.description },
        { name: "twitter:image", content: this.chronosConfig!.logoUrl },
      ];
      for (const metaTag of metaTags) {
        const meta = document.createElement("meta");
        meta.name = metaTag.name;
        meta.content = metaTag.content;
        document.head.appendChild(meta);
      }
    },
  },
});
</script>
