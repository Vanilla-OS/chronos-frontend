<template>
    <section class="hero is-primary is-title">
        <div class="container">
            <div class="hero-body has-text-centered">
                <h1 class="title">{{ activeCollection!.title }}</h1>
                <p class="subtitle">{{ activeCollection!.description }}</p>
            </div>
        </div>
    </section>
    <div class="container">
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
import type { ArticlesResponse, Article, ChronosConfig, ChronosCollection } from "@/core/models";
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
            activeCollection: {} as ChronosCollection | undefined,
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

        }
    },
});
</script>
