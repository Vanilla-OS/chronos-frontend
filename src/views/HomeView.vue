<template>
  <div v-if="chronosConfig">
    <section class="hero is-primary is-title">
      <div class="container">
        <div class="hero-body has-text-centered">
          <h1 class="title">{{ chronosConfig.title }}</h1>
          <p class="subtitle">Collections</p>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns is-multiline">
        <div v-for="(collection, index) in chronosConfig.chronosCollections" :key="index" class="column is-half">
          <router-link :to="`/collections/${collection.shortName}`">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">{{ collection.title }}</p>
                <p class="subtitle is-6">{{ collection.description }}</p>
                <div class="content">
                  <p class="is-size-7 is-uppercase has-text-weight-bold flex items-center no-gap">
                    <span class="icon is-small">
                      <i class="mdi material-icons">book</i>
                    </span>
                    <span v-if="articleCounts[collection.shortName] !== undefined" class="ml-2">
                      {{ articleCounts[collection.shortName] }} Articles
                    </span>
                    <span v-else>Loading...</span>
                  </p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
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
    this.chronosConfig = await this.$chronosAPI.config();

    useHead({
      title: this.chronosConfig!.title,
      meta: [
        {
          name: "description",
          content: this.chronosConfig!.description,
        },
      ],
    });

    await this.fetchArticleCounts();

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
  },
});
</script>
