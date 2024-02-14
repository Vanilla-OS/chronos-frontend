<template>
  <div :class="{ 'sticky top-0 z-50 bg-white shadow': stickyTopbar }" class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center py-4" aria-label="main navigation">
        <router-link to="/" class="flex items-center">
          <img :src="chronosConfig.logoUrl" class="w-7 min-w-7 h-7 min-h-7" alt="Logo" />
          <h1 class="text-lg font-semibold ml-2 hidden sm:block">{{ chronosConfig.logoTitle }}</h1>
        </router-link>

        <div class="flex-1 mx-4 relative" v-if="collectionShortName">
          <div
            class="flex items-center border bg-gray-100 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
            <input class="flex-1 px-4 py-2 text-gray-600 bg-transparent focus:outline-none" type="text"
              placeholder="Search for articles.." v-model="search" @input="searchArticles">
            <i class="material-icons p-2 text-gray-400">search</i>
          </div>
          <div v-if="searchResponse.length > 0"
            class="absolute w-full mt-1 z-50 max-h-80 overflow-auto bg-white rounded-md shadow-lg m-2">
            <span class="block p-4 hover:bg-gray-50 cursor-pointer" v-for="(result, index) in searchResponse" :key="index"
              @click="goToArticle(result.Slug)">
              <div class="flex items-center space-x-2">
                <i class="mdi material-icons text-gray-500">book</i>
                <div class="flex-1">
                  <p class="font-semibold">{{ result.Title }}</p>
                  <p class="text-sm text-gray-500">{{ result.Description }}</p>
                </div>
              </div>
            </span>
          </div>
        </div>


        <div class="hidden sm:flex items-center space-x-4">
          <a class="text-base text-gray-600 hover:text-gray-900" :href="link.url" target="_blank"
            v-for="(link, index) in chronosConfig.extraLinks" :key="index">
            {{ link.name }}
          </a>
        </div>
        <div v-if="collectionShortName" class="relative">
          <button @click="showLangs = !showLangs" class="flex items-center p-2 text-gray-600 hover:text-gray-900">
            <span>{{ chronosStore.prefLang }}</span>
            <i class="material-icons">arrow_drop_down</i>
          </button>
          <div v-show="showLangs" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
            <div class="py-1">
              <a v-for="(lang, index) in langs" :key="index" @click="setLang(lang)"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                {{ lang }}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>


    <router-view />

    <footer class="bg-white mt-12">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-base text-gray-600">
          <strong>Chronos</strong> by <a href="https://vanillaos.org" class="text-blue-600 hover:underline">Vanilla
            OS</a>.
        </p>
      </div>
    </footer>
  </div>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import { useChronosStore } from "@/core/store";
import type { Article, ChronosConfig } from "@/core/models";

export default defineComponent({
  data() {
    return {
      title: "",
      langs: [] as string[],
      showLangs: false,
      searchResponse: [] as Article[],
      search: "",
      chronosConfig: {} as ChronosConfig,
      collectionShortName: "",
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
    stickyTopbar() {
      return this.$route.name !== "article";
    },
  },
  watch: {
    $route(to, from) {
      this.fetchLanguages();
    },
  },
  async mounted() {
    try {
      // @ts-ignore
      this.chronosConfig = await this.$chronosAPI.config();
    } catch (error) {
      console.error("Error fetching Chronos config:", error);
    }

    // Fetch languages initially
    this.fetchLanguages();

    this.chronosStore.$patch((state) => {
      state.prefLang = "en";
    });
  },
  methods: {
    setLang(lang: string) {
      this.chronosStore.$patch((state) => {
        state.prefLang = lang;
      });
      this.showLangs = false;
    },
    async searchArticles() {
      // @ts-ignore
      this.$chronosAPI.searchArticles(this.chronosStore.prefLang, this.search, this.collectionShortName).then((response) => {
        this.searchResponse = response;
      });
    },
    goToArticle(slug: string) {
      this.$router.push(`/${this.collectionShortName}/${this.chronosStore.prefLang}/${slug}`);
      this.searchResponse = [];
      this.search = "";
    },
    async fetchLanguages() {
      // Check if the collection parameter is available in the route
      this.collectionShortName = this.$route.params.collection as string;

      if (this.collectionShortName) {
        // Fetch languages for the specific collection
        try {
          // @ts-ignore
          this.langs = await this.$chronosAPI.getLangs(this.collectionShortName);
        } catch (error) {
          console.error(`Error fetching languages for collection ${this.collectionShortName}:`, error);
        }
      }
    },
  },
});
</script>
