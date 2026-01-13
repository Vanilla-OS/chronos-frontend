<template>
  <div :class="{ 'sticky top-0 z-50 shadow': stickyTopbar }" class="bg-white dark:bg-zinc-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center py-4 print:hidden" aria-label="main navigation">
        <router-link to="/" class="flex items-center">
          <img :src="chronosConfig.logoUrl" class="w-7 min-w-7 h-7 min-h-7" alt="Logo" />
          <h1 class="text-lg font-semibold ml-2 hidden sm:block text-zinc-900 dark:text-zinc-100">
            {{ chronosConfig.logoTitle }}
          </h1>
        </router-link>

        <div class="flex-1 mx-4 relative">
          <div v-if="collectionShortName"
            class="flex items-center border bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 border-zinc-200 dark:border-zinc-600">
            <input class="flex-1 px-4 py-2 text-zinc-600 dark:text-zinc-300 bg-transparent focus:outline-none w-full"
              type="text" placeholder="Search for articles.." v-model="search" @input="searchArticles"
              @blur="emptySearch()">
            <i class="material-symbols-outlined p-2 text-zinc-400 dark:text-zinc-500">search</i>

            <div v-if="collectionShortName" class="relative border-l border-zinc-200 dark:border-zinc-600">
              <button @click="showLangs = !showLangs"
                class="flex items-center p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
                <span>{{ chronosStore.prefLang }}</span>
                <i class="material-symbols-outlined">arrow_drop_down</i>
              </button>
            </div>
          </div>

          <div v-show="showLangs"
            class="absolute right-0 mt-2 w-max bg-white dark:bg-zinc-800 shadow-lg rounded-md z-50">
            <div class="py-1">
              <a v-for="(lang, index) in langs" :key="index" @click="setLang(lang)"
                class="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                {{ lang }}
              </a>
            </div>
          </div>

          <div v-if="searchResponse.length > 0"
            class="absolute w-full mt-1 z-50 max-h-80 overflow-auto bg-white dark:bg-zinc-800 rounded-md shadow-lg m-2">
            <span class="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              v-for="(result, index) in searchResponse" :key="index" @mousedown.prevent="goToArticle(result.Slug)">
              <div class="flex items-center space-x-2">
                <i class="mdi material-symbols-outlined text-zinc-500 dark:text-zinc-400">book</i>
                <div class="flex-1">
                  <p class="font-semibold text-zinc-900 dark:text-zinc-100">
                    {{ result.Title }}
                  </p>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400">
                    {{ result.Description }}
                  </p>
                </div>
              </div>
            </span>
          </div>
        </div>

        <button @click="toggleThemeMode"
          class="flex items-center p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
          <i class="material-symbols-outlined" v-if="theme === 'light'">light_mode</i>
          <i class="material-symbols-outlined" v-if="theme === 'system'">contrast</i>
          <i class="material-symbols-outlined" v-if="theme === 'dark'">dark_mode</i>
        </button>

        <div class="hidden sm:flex items-center space-x-4">
          <a class="text-base text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            :href="link.url" target="_blank" v-for="(link, index) in chronosConfig.extraLinks" :key="index">
            {{ link.name }}
          </a>
        </div>
      </nav>
    </div>

    <router-view />

    <footer class="bg-white dark:bg-zinc-900 mt-12">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-base text-zinc-600 dark:text-zinc-400 print:hidden">
          <strong>Chronos</strong> by <a href="https://vanillaos.org"
            class="text-blue-800 dark:text-blue-400 hover:underline">Vanilla OS</a>.
        </p>
        <p class="text-base text-zinc-600 dark:text-zinc-400 hidden print:block">
          PDF generated with <strong>Chronos</strong> by <a href="https://vanillaos.org"
            class="text-blue-800 dark:text-blue-400 hover:underline">Vanilla OS</a>.
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
      theme: "system",
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
    theme() {
      this.applyTheme();
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

    // Theme
    this.theme = localStorage.getItem("theme") || "system";
    this.applyTheme();
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
        const response = await this.$chronosAPI.searchArticles(
          this.chronosStore.prefLang,
          this.search,
          this.collectionShortName,
        );
        if (response != null) {
          this.searchResponse = response;
        } else {
          this.searchResponse = [];
        }
      } catch (error) {
        console.error("Error searching articles:", error);
        this.searchResponse = [];
      }
    },
    goToArticle(slug: string) {
      this.$router.push(
        `/${this.collectionShortName}/${this.chronosStore.prefLang}/${slug}`,
      );
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
          this.langs = await this.$chronosAPI.getLangs(
            this.collectionShortName,
          );
        } catch (error) {
          console.error(
            `Error fetching languages for collection ${this.collectionShortName}:`,
            error,
          );
        }
      }
    },
    applyTheme() {
      if (this.theme === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else if (this.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    toggleThemeMode() {
      if (this.theme === "system") {
        this.theme = "dark";
      } else if (this.theme === "dark") {
        this.theme = "light";
      } else {
        this.theme = "system";
      }
      localStorage.setItem("theme", this.theme);
      this.applyTheme();
    },
    emptySearch() {
      this.searchResponse = [];
      console.log("Focus lost")
    },
  },
});
</script>
