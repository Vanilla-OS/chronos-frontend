<template>
  <div :class="{ 'sticky top-0 z-50 shadow': stickyTopbar }" class="bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center py-4" aria-label="main navigation">
        <router-link to="/" class="flex items-center">
          <img :src="chronosConfig.logoUrl" class="w-7 min-w-7 h-7 min-h-7" alt="Logo" />
          <h1 class="text-lg font-semibold ml-2 hidden sm:block text-gray-900 dark:text-gray-100">{{
            chronosConfig.logoTitle }}</h1>
        </router-link>

        <div class="flex-1 mx-4 relative">
          <div v-if="collectionShortName"
            class="flex items-center border bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 border-gray-200 dark:border-gray-600">
            <input class="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 bg-transparent focus:outline-none w-full"
              type="text" placeholder="Search for articles.." v-model="search" @input="searchArticles">
            <i class="material-icons p-2 text-gray-400 dark:text-gray-500">search</i>

            <div v-if="collectionShortName" class="relative border-l border-gray-200 dark:border-gray-600">
              <button @click="showLangs = !showLangs"
                class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span>{{ chronosStore.prefLang }}</span>
                <i class="material-icons">arrow_drop_down</i>
              </button>
            </div>
          </div>

          <div v-show="showLangs"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
            <div class="py-1">
              <a v-for="(lang, index) in langs" :key="index" @click="setLang(lang)"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                {{ lang }}
              </a>
            </div>
          </div>

          <div v-if="searchResponse.length > 0"
            class="absolute w-full mt-1 z-50 max-h-80 overflow-auto bg-white dark:bg-gray-800 rounded-md shadow-lg m-2">
            <span class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              v-for="(result, index) in searchResponse" :key="index" @click="goToArticle(result.Slug)">
              <div class="flex items-center space-x-2">
                <i class="mdi material-icons text-gray-500 dark:text-gray-400">book</i>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-gray-100">{{ result.Title }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ result.Description }}</p>
                </div>
              </div>
            </span>
          </div>
        </div>

        <button @click="toggleDarkMode"
          class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <i class="material-icons" v-if="isDarkMode">light_mode</i>
          <i class="material-icons" v-else>dark_mode</i>
        </button>

        <div class="hidden sm:flex items-center space-x-4">
          <a class="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            :href="link.url" target="_blank" v-for="(link, index) in chronosConfig.extraLinks" :key="index">
            {{ link.name }}
          </a>
        </div>
      </nav>
    </div>

    <router-view />

    <footer class="bg-white dark:bg-gray-900 mt-12">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-base text-gray-600 dark:text-gray-400">
          <strong>Chronos</strong> by <a href="https://vanillaos.org"
            class="text-blue-600 dark:text-blue-400 hover:underline">Vanilla OS</a>.
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
      isDarkMode: false,
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

    // Dark mode
    const userPrefersDark = localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.isDarkMode = userPrefersDark;
    if (userPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  methods: {
    setLang(lang: string) {
      this.chronosStore.$patch((state) => {
        state.prefLang = lang;
      });
      this.showLangs = false;
    },
    async searchArticles() {
      try {
        // @ts-ignore
        const response = await this.$chronosAPI.searchArticles(this.chronosStore.prefLang, this.search, this.collectionShortName);
        this.searchResponse = response;
      } catch (error) {
        console.error("Error searching articles:", error);
        this.searchResponse = [];
      }
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

    toggleDarkMode() {
      document.documentElement.classList.toggle('dark');
      const isDarkMode = document.documentElement.classList.contains('dark');
      localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
      this.isDarkMode = isDarkMode;
    },
  },
});
</script>
