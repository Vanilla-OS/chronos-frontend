<template>
  <div v-if="chronosConfig">
    <section class="bg-gray-100 text-black text-center py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">{{ chronosConfig.title }}</h1>
        <p class="mt-4">Collections</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8" v-if="chronosConfig.chronosCollections">
        <div v-for="(collection, index) in chronosConfig.chronosCollections" :key="index"
          class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out flex flex-col p-5 gap-4">
          <router-link :to="`/collections/${collection.shortName}`" class="hover:no-underline flex-1 flex gap-2 flex-col">
            <h4 class="text-xl font-semibold">{{ collection.title }}</h4>
            <p class="text-gray-700">{{ collection.description }}</p>
            <div
              class="inline-flex items-center text-gray-600 hover:text-gray-800 font-semibold text-sm transition-colors duration-150 ease-in-out mb-4">
              <span class="flex items-center">
                <i class="material-icons text-base mr-2">book</i>
                <span v-if="articleCounts[collection.shortName] !== undefined">
                  {{ articleCounts[collection.shortName] }} Articles
                </span>
                <span v-else>Loading...</span>
              </span>
            </div>
            <div class="mt-auto">
              <span
                class="inline-flex items-center text-lg text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-150 ease-in-out">
                View collection
                <i class="material-icons ml-2">arrow_forward</i>
              </span>
            </div>
          </router-link>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import type { ChronosConfig, ChronosCollection } from "@/core/models";
import { useChronosStore } from "@/core/store";
import { useHead } from 'unhead';

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      chronosConfig: null as ChronosConfig | null,
      articleCounts: {} as Record<string, number | undefined>,
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
  },
  async mounted() {
    // @ts-ignore
    await this.$chronosAPI.config()
      .then((config: ChronosConfig) => {
        this.chronosConfig = config;
      })
      .catch((error: Error) => {
        console.error("Error fetching Chronos config:", error);
      });

    await this.fetchArticleCounts();
    this.setHead();

    // Redirect if there's only one collection
    if (this.chronosConfig!.chronosCollections.length === 1) {
      const collection = this.chronosConfig!.chronosCollections[0];
      this.$router.replace(`/collections/${collection.shortName}`);
    }
  },
  methods: {
    async fetchArticleCounts() {
      const articleCounts: Record<string, number | undefined> = {};

      for (const collection of this.chronosConfig!.chronosCollections) {
        try {
          // @ts-ignore
          const count = await this.$chronosAPI.countArticles(this.chronosStore.prefLang, collection.shortName);
          articleCounts[collection.shortName] = count;
        } catch (error) {
          console.error(`Error fetching article count for collection ${collection.shortName}:`, error);
          articleCounts[collection.shortName] = undefined;
        }
      }

      this.articleCounts = articleCounts;
    },
    setHead() {
      window.document.title = this.chronosConfig!.title;
      const metaTags = [
        { name: "description", content: this.chronosConfig!.description },
        { name: "og:title", content: this.chronosConfig!.title },
        { name: "og:description", content: this.chronosConfig!.description },
        { name: "og:image", content: this.chronosConfig!.logoUrl },
        { name: "og:url", content: window.location.href },
        { name: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: this.chronosConfig!.title },
        { name: "twitter:description", content: this.chronosConfig!.description },
        { name: "twitter:image", content: this.chronosConfig!.logoUrl },
      ];
      for (const metaTag of metaTags) {
        const meta = document.createElement("meta");
        meta.name = metaTag.name;
        meta.content = metaTag.content;
        document.head.appendChild(meta);
      }

    }
  },
});
</script>
