<template>
    <div>
        <div class="flex-grid flex-grid--cols-2" v-if="articlesResponse?.articles">
            <div v-for="(article) in articles" :key="article.Slug">
                <div class="card">
                    <div class="card-content">
                        <div class="content">
                            <h4 class="title is-4">{{ article.Title }}</h4>
                            <p class="subtitle is-5">{{ article.Description }}…</p>
                        </div>
                        <footer class="card-footer">
                            <div class="block">
                                <router-link :to="`/${collectionName}/${chronosStore.prefLang}/${article.Slug}`"
                                    class="button is-ghost is-plain is-size-16 is-uppercase has-text-weight-semibold">
                                    <span>Read the article</span>
                                    <span class="icon is-small">
                                        <i class="mdi material-icons">arrow_forward</i>
                                    </span>
                                </router-link>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import type { ArticlesResponse, Article, ChronosConfig } from "@/core/models";
import { useChronosStore } from "@/core/store";
import { useHead } from 'unhead'

export default defineComponent({
    name: "CollectionView",
    data() {
        return {
            articlesResponse: {} as ArticlesResponse,
            articles: [] as Article[],
            chronosConfig: {} as ChronosConfig,
            collectionName: "",
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
        this.collectionName = this.$route.params.collection as string;

        this.fetchArticles();

        this.chronosStore.$subscribe(() => {
            this.fetchArticles();
        });

        useHead({
            title: this.chronosConfig.title,
            meta: [
                {
                    name: "description",
                    content: this.chronosConfig.description,
                },
            ],
        });
    },
    methods: {
        async fetchArticles() {
            // @ts-ignore
            this.$chronosAPI.getArticles(this.chronosStore.prefLang, this.collectionName).then((response) => {
                this.articlesResponse = response;
                this.articles = this.articlesResponse.articles;
            });
        },
    },
});
</script>
