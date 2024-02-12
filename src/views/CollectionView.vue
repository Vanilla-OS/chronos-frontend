<template>
    <section class="bg-gray-100 text-black text-center py-8">
        <div class="container mx-auto px-4">
            <h1 class="text-3xl font-bold">{{ activeCollection!.title }}</h1>
            <p class="mt-4">{{ activeCollection!.description }}</p>
        </div>
    </section>
    <div class="container mx-auto px-4 my-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="articlesResponse?.articles">
            <div v-for="(article) in articles" :key="article.Slug">
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                    <div class="p-5">
                        <h4 class="text-xl font-semibold mb-2">{{ article.Title }}</h4>
                        <p class="text-gray-700 mb-4">{{ article.Description }}…</p>
                        <footer>
                            <router-link :to="`/${collectionName}/${chronosStore.prefLang}/${article.Slug}`"
                                class="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-150 ease-in-out">
                                <span>Read the article</span>
                                <span class="ml-2 flex items-center">
                                    <i class="material-icons text-base">arrow_forward</i>
                                </span>
                            </router-link>
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
