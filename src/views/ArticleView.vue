<template>
    <nav class="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="breadcrumbs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul class="flex space-x-4">
                <li>
                    <router-link to="/" class="text-blue-600 hover:text-blue-800">Home</router-link>
                </li>
                <li>
                    <a class="cursor-pointer text-gray-600">{{ lang }}</a>
                </li>
                <li class="text-gray-500" aria-current="page">
                    {{ article.Title }}
                </li>
            </ul>
        </div>
    </nav>
    <section class="bg-gray-100 text-black">
        <div class="container mx-auto py-8 px-4 text-center">
            <h1 class="text-3xl font-bold">{{ article.Title }}</h1>
            <p class="mt-4">{{ article.Description }}</p>
            <div class="flex justify-center space-x-4 mt-4 gap-2">
                <div v-for="author in article.Authors" :key="author" class="flex items-center -mr-6">
                    <img v-if="!imageError[author]" :src="`https://github.com/${author}.png?size=40`" :alt="author"
                        class="w-7 h-7 rounded-full object-cover " @error="imageError[author] = true" :title="author">
                    <span v-else
                        class="w-7 h-7 rounded-full overflow-hidden bg-blue-500 text-white font-bold inline-flex items-center justify-center -mr-3">
                        {{ getInitials(author) }}
                    </span>
                </div>
            </div>
        </div>
    </section>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex py-8">
        <aside class="hidden lg:block lg:w-1/4">
            <div class="sticky top-4 z-1">
                <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p class="font-semibold mb-4">Navigation</p>
                    <ul class="space-y-2">
                        <li v-for="(heading, index) in headings" :key="index" :class="`pl-${heading.level * 2}`">
                            <a @click="scrollToHeading(heading.id)"
                                class="cursor-pointer text-blue-600 hover:text-blue-800">{{ heading.text }}</a>
                        </li>
                    </ul>
                    <a v-if="editUrl != ''" :href="editUrl" target="_blank"
                        class="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </a>
                </div>
            </div>
        </aside>
        <div class="w-full lg:w-3/4 lg:pl-4">
            <div class="content prose article-content" v-html="article.Body"></div>
        </div>
    </div>

    <button @click="isSidebarVisible = !isSidebarVisible"
        class="material-icons fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full z-50 md:hidden">
        menu
    </button>

    <div v-if="isSidebarVisible" @click.self="isSidebarVisible = false"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden bottom-0 flex flex-col items-end justify-end">
        <aside class="relative bg-white p-4 shadow-lg overflow-auto w-full rounded-t-lg pb-16">
            <div class="p-2">
                <p class="font-semibold mb-4">Navigation</p>
                <ul class="space-y-2">
                    <li v-for="(heading, index) in headings" :key="index" :class="`pl-${heading.level * 2}`">
                        <a @click="scrollToHeading(heading.id)" class="cursor-pointer text-blue-600 hover:text-blue-800">{{
                            heading.text }}</a>
                    </li>
                </ul>
                <a v-if="editUrl != ''" :href="editUrl" target="_blank"
                    class="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                </a>
            </div>
        </aside>
    </div>
</template>


<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import type { Article, ChronosCollection, ChronosConfig } from "@/core/models";
import { useChronosStore } from "@/core/store";
import { useHead } from 'unhead';

export default defineComponent({
    name: "ArticleView",
    data() {
        return {
            article: {} as Article,
            lang: "",
            headings: [] as { text: string; id: string; level: number }[],
            chronosConfig: {} as ChronosConfig,
            collectionName: "",
            editUrl: "",
            isSidebarVisible: false,
            imageError: reactive({} as any),
        };
    },
    computed: {
        chronosStore() {
            return useChronosStore();
        },
    },
    async mounted() {
        await this.initializeArticle();
        const collectionConfig = this.chronosConfig.chronosCollections.find(
            (c) => c.shortName === this.collectionName
        );

        this.setEditUrl(collectionConfig);
    },
    methods: {
        async initializeArticle() {
            // @ts-ignore
            this.chronosConfig = await this.$chronosAPI.config();
            this.collectionName = this.$route.params.collection as string;

            this.setupRouteWatcher();

            const lang = Array.isArray(this.$route.params.lang)
                ? this.$route.params.lang[0]
                : this.$route.params.lang;
            const slug = Array.isArray(this.$route.params.slug)
                ? this.$route.params.slug[0]
                : this.$route.params.slug;
            await this.loadArticle(lang, slug);

            this.chronosStore.$subscribe(() => {
                if (this.lang !== this.chronosStore.prefLang) {
                    this.loadArticleAndHandleResponse(this.chronosStore.prefLang);
                }
            });
        },
        async loadArticleAndHandleResponse(lang: string) {
            // @ts-ignore
            const response = await this.$chronosAPI.getArticleByLanguageAndSlug(
                lang,
                this.$route.params.slug,
                this.collectionName
            );
            this.handleArticleResponse(response, lang);
        },
        async loadArticle(lang: string, slug: string) {
            if (slug === undefined) {
                return;
            }

            // @ts-ignore
            const response = await this.$chronosAPI.getArticleByLanguageAndSlug(
                lang,
                slug,
                this.collectionName
            );
            this.handleArticleResponse(response, lang);
        },
        handleArticleResponse(response: Article, lang: string) {
            const { article, headings } = this.handleResponse(response);

            this.lang = lang;
            this.article = article;
            this.headings = headings;
            document.title = `${this.article!.Title} - ${this.chronosConfig.title}`;
        },
        handleResponse(response: Article) {
            let _article = response;
            _article.Body = this.setHeadingIds(_article.Body);
            let _headings = this.extractHeadings(_article.Body);

            useHead({
                title: `${this.article!.Title} - ${this.chronosConfig.title}`,
                meta: [
                    { name: "description", content: this.article!.Description },
                    { name: "og:title", content: `${this.article!.Title} - ${this.chronosConfig.title}` },
                    { name: "og:description", content: this.article!.Description },
                    { name: "og:url", content: `${this.chronosConfig.baseURL}/${this.article!.Slug}` },
                    { name: "twitter:card", content: "summary_large_image" },
                    { name: "twitter:title", content: `${this.article!.Title} - ${this.chronosConfig.title}` },
                    { name: "twitter:description", content: this.article!.Description },
                ],
            });

            return {
                article: _article,
                headings: _headings,
            };
        },
        setHeadingIds(body: string) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(body, "text/html");
            const hTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

            hTags.forEach((hTag) => {
                hTag.id = hTag.textContent?.replace(/\s+/g, "-").toLowerCase() as string;
            });

            return doc.body.innerHTML;
        },
        setupRouteWatcher() {
            watch(
                () => this.$route,
                async (newRoute, oldRoute) => {
                    if (newRoute.params.slug !== oldRoute.params.slug || newRoute.params.lang !== oldRoute.params.lang) {
                        const lang = Array.isArray(newRoute.params.lang)
                            ? newRoute.params.lang[0]
                            : newRoute.params.lang;
                        const slug = Array.isArray(newRoute.params.slug)
                            ? newRoute.params.slug[0]
                            : newRoute.params.slug;
                        await this.loadArticle(lang, slug);
                    }
                }
            );
        },
        setEditUrl(collectionConfig: ChronosCollection | undefined) {
            if (collectionConfig && collectionConfig.editUrl) {
                this.editUrl = collectionConfig.editUrl
                    .replace("{{lang}}", this.lang)
                    .replace("{{slug}}", this.article.Slug);
            }
        },
        extractHeadings(body: string) {
            const headings = [] as { text: string; id: string; level: number }[];
            const parser = new DOMParser();
            const doc = parser.parseFromString(body, "text/html");
            const hTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

            hTags.forEach((hTag) => {
                const level = parseInt(hTag.tagName.slice(1));
                const heading = {
                    text: hTag.textContent as string,
                    id: hTag.id,
                    level: level,
                };
                headings.push(heading);
            });

            return headings;
        },
        scrollToHeading(headingId: string) {
            const offset = 53;
            const element = document.getElementById(headingId);
            const y = element?.getBoundingClientRect().top;
            window.scrollTo({ top: y ? y + window.scrollY - offset : 0, behavior: "smooth" });
            this.isSidebarVisible = false;
        },
        getInitials(name: string) {
            const names = name.split(" ");
            if (names.length > 1) {
                return names[0].charAt(0) + names[names.length - 1].charAt(0);
            }
            return names[0].charAt(0);
        },
        onImageError(event: any, author: string) {
            event.target.style.display = 'none';
        },
    },
});
</script>