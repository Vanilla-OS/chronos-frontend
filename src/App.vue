<template>
  <div class="topbar">
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
          <button class="button is-white" @click="toggleSearch()">
            <span class="icon is-left">
              <i class="mdi material-icons">search</i>
            </span>
          </button>
          <div class="dropdown" :class="{ 'is-active': showLangs }">
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
          <a class="panel-block" @click="goToArticle(result.Slug)" v-for="(result) in searchResponse.results"
            :key="result.Slug">
            <span class="panel-icon">
              <i class="mdi material-icons">book</i>
            </span>
            {{ result.Title }}
          </a>
        </div>
      </nav>
    </div>
  </div>

  <div class="container">
    <router-view />
  </div>

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
import type { SearchResponse } from "@/core/models";
import ChronosConfig from "@/config";

export default defineComponent({
  data() {
    return {
      title: "",
      langs: [] as string[],
      showLangs: false,
      showSearch: false,
      searchResponse: {} as SearchResponse,
      search: "",
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
    chronosConfig() {
      return ChronosConfig;
    },
  },
  async mounted() {
    // @ts-ignore
    this.$chronosAPI.getLangs().then((response) => {
      this.langs = response;
      console.log(this.langs);
    });
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
      this.$chronosAPI.searchArticles(this.search).then((response) => {
        this.searchResponse = response;
        console.log(this.searchResponse);
      });
    },
    goToArticle(slug: string) {
      this.$router.push(`/${this.chronosStore.prefLang}/${slug}`);
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
  },
});
</script>