<template>
  <section class="text-black dark:text-zinc-200 text-center py-8 mt-16.25">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold">{{ activeCollection!.title }}</h1>
      <p class="mt-4">{{ activeCollection!.description }}</p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 mt-4">

    <!-- Stories -->
    <div class="flex flex-col" v-if="stories">
      <h2 class="text-2xl font-semibold text-black dark:text-zinc-200">Stories</h2>
      <p class="text-zinc-700 dark:text-zinc-300">Stories are a collection of articles that are best read in order.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="stories">
      <article v-for="story in stories" :key="story.Name"
               class="flex flex-col bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out p-5">
        <router-link :to="`/${collectionName}/${chronosStore.prefLang}/${story.StartSlug}`" class="flex flex-col gap-2">
          <h4 class="text-xl font-semibold text-black dark:text-zinc-200">
            {{ story.Name }}
          </h4>
          <p class="text-zinc-700 dark:text-zinc-300">{{ story.Description }}</p>
          <div class="mt-auto">
            <span
              class="inline-flex items-center text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-150 ease-in-out">
              Start reading
              <i class="material-symbols-outlined ml-2">arrow_forward</i>
            </span>
          </div>
        </router-link>
      </article>
    </div>

    <!-- Toolbox -->
    <aside
      class="border dark:border-zinc-800 border-zinc-300 rounded-xl p-4 md:sticky top-2 flex flex-row gap-4 mt-2 items-center">
      <router-link class="text-blue-600 dark:text-blue-400 flex items-center mr-auto" to="/">
        <i class="material-symbols-outlined">arrow_back</i>
        <span class="hidden sm:inline">Back to collections</span>
      </router-link>

      <div class="flex flex-row items-center gap-2" v-if="articlesResponse.tags">
        <label for="tag-filter"
               class="whitespace-nowrap text-sm font-medium text-zinc-700 dark:text-zinc-300">Tags:</label>
        <CustomSelect :options="articlesResponse.tags" v-model="selectedTags" multiple placeholder="Select tags" />
      </div>

      <div class="flex flex-row items-center gap-2">
        <label for="date-filter"
               class="whitespace-nowrap text-sm font-medium text-zinc-700 dark:text-zinc-300">Order:</label>
        <CustomSelect :options="['Recent', 'Oldest']" v-model="selectedDate" placeholder="Select date" />
      </div>
    </aside>

    <!-- Articles -->
    <div class="flex flex-col" v-if="articlesResponse?.articles">
      <h2 class="text-2xl font-semibold text-black dark:text-zinc-200">Articles</h2>
      <p class="text-zinc-700 dark:text-zinc-300">All articles in this collection.</p>
    </div>
    <div class="flex-1" v-if="articlesResponse?.articles">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article v-for="article in filteredArticles" :key="article.Slug"
                 class="border dark:border-zinc-800 border-zinc-300 hover:border-zinc-400 hover:dark:border-zinc-700 rounded-xl overflow-hidden transition duration-300 ease-in-out flex flex-col p-8 gap-4">
          <div class="flex-1">
            <h4 class="text-xl font-semibold mb-2 text-black dark:text-zinc-200">
              {{ article.Title }}
            </h4>
            <p class="text-zinc-700 dark:text-zinc-300 mb-4">{{ article.Description }}</p>
            <div class="flex flex-wrap gap-2 mt-2 mb-4">
              <span v-for="tag in article.Tags" :key="tag" @click="setTag(tag)"
                    class="inline-block bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white/50 rounded-full px-3 py-1 text-xs font-medium cursor-pointer">
                {{ tag }}
              </span>
            </div>
          </div>
          <router-link :to="`/${collectionName}/${chronosStore.prefLang}/${article.Slug}`"
                       class="mt-auto inline-flex items-center text-lg text-black dark:text-white font-semibold transition-colors duration-150 ease-in-out">
            Read the article
            <i class="material-symbols-outlined ml-2">arrow_forward</i>
          </router-link>
        </article>
      </div>
    </div>

    <div v-else>
      <p class="text-black dark:text-zinc-200">Loading...</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ArticlesResponse, Article, Story, ChronosConfig, ChronosCollection } from "@/core/models";
import { useChronosStore } from "@/core/store";
import CustomSelect from "../components/CustomSelect.vue";

export default defineComponent({
  name: "CollectionView",
  components: {
    CustomSelect
  },
  data() {
    return {
      articlesResponse: {} as ArticlesResponse,
      articles: [] as Article[],
      stories: [] as Story[],
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
      let filtered = this.articles.filter((article) => article.Listed !== false);
      if (this.selectedTags.length > 0) {
        filtered = filtered.filter((article) => {
          if (article.Tags === null) return false;
          return this.selectedTags.every((tag) => article.Tags.includes(tag));
        });
      }

      if (this.selectedDate[0] === "Recent") {
        filtered = filtered.sort((a, b) => new Date(b.PublicationDate).getTime() - new Date(a.PublicationDate).getTime());
      } else if (this.selectedDate[0] === "Oldest") {
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
        this.stories = this.articlesResponse?.stories;
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
        { name: "twitter:image", content: this.chronosConfig!.logoUrl }
      ];
      for (const metaTag of metaTags) {
        const meta = document.createElement("meta");
        meta.name = metaTag.name;
        meta.content = metaTag.content;
        document.head.appendChild(meta);
      }
    },
    setTag(tag: string) {
      this.selectedTags = [tag as never];
    }
  }
});
</script>
