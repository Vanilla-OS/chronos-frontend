<template>
  <div class="topbar" :class="{ 'is-sticky': stickyTopbar }">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item">
            <img :src="chronosConfig.logoUrl" height="28">
            <h1 class="title is-4">{{ chronosConfig.logoTitle }}</h1>
          </router-link>
        </div>
        <div class="navbar-end">
          <a class="navbar-item" :href="link.url" target="_blank" v-for="(link) in chronosConfig.extraLinks">
            {{ link.name }}
          </a>
          <button class="button is-white" @click="toggleSearch()" v-if="collectionShortName">
            <span class="icon is-left">
              <i class="mdi material-icons">search</i>
            </span>
          </button>
          <div class="dropdown" :class="{ 'is-active': showLangs }" v-if="collectionShortName">
            <div class="dropdown-trigger">
              <button class="button is-white" @click="showLangs = !showLangs">
                <span>{{ chronosStore.prefLang }}</span>
                <span class="icon is-small">
                  <i class="mdi material-icons">arrow_drop_down</i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a v-for="(lang) in langs" :key="lang" class="dropdown-item" @click="setLang(lang)">
                  {{ lang }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>

  <div class="modal search-overlay" :class="{ 'is-active': showSearch }">
    <div class="modal-background" @click="toggleSearch()"></div>
    <div class="modal-content">
      <nav class="panel">
        <p class="panel-heading">Search</p>
        <div class="panel-block">
          <p class="control has-icons-left">
            <input class="input" type="text" placeholder="Search" v-model="search" @input="searchArticles" ref="search">
            <span class="icon is-left">
              <i class="mdi material-icons">search</i>
            </span>
          </p>
        </div>
        <div class="panel-scrollable">
          <a class="panel-block flex-list" @click="goToArticle(result.Slug)" v-for="(result) in searchResponse"
            :key="result.Slug">
            <div class="panel-block-header panel-block-header--has-icon">
              <span class="panel-icon">
                <i class="mdi material-icons">book</i>
              </span>
              {{ result.Title }}
            </div>
            <div class="panel-block-content">
              <p class="is-size-7 has-text-grey">{{ result.Description }}</p>
            </div>
          </a>
        </div>
      </nav>
    </div>
  </div>

  <router-view />

  <br />
  <br />

  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Chronos</strong> by <a href="https://vanillaos.org">Vanilla OS</a>.
      </p>
    </div>
  </footer>
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
      showSearch: false,
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
      this.showSearch = false;
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.search = "";
      } else {
        this.$nextTick(() => {
          // @ts-ignore
          this.$refs.search.focus();
        });
      }
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
