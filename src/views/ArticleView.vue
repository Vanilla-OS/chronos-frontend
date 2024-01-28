<template>
    <nav class="breadcrumb is-main" aria-label="breadcrumbs">
        <div class="container">
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><a>{{ lang }}</a></li>
                <li class="is-active">
                    <a href="#" aria-current="page">
                        {{ article.Title }}
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    <section class="hero is-primary is-title">
        <div class="container">
            <div class="hero-body has-text-centered">
                <h1 class="title">{{ article.Title }}</h1>
                <p class="subtitle">{{ article.Description }}</p>
            </div>
        </div>
    </section>
    <div class="paned container">
        <div class="sidebar">
            <aside class="menu">
                <p class="menu-label">
                    Navigation
                </p>
                <ul class="menu-list">
                    <li v-for="(heading) in headings" :key="heading.id" :class="`indent-${heading.level}`">
                        <a @click="scrollToHeading(heading.id)">{{ heading.text }}</a>
                    </li>
                </ul>
                <a v-if="editUrl != ''" :href="editUrl" target="_blank" class="button is-secondary is-fullwidth">
                    <span class="icon">
                        <i class="material-icons">edit</i>
                    </span>
                    <span>Edit</span>
                </a>
            </aside>
        </div>
        <div v-html="article.Body" class="content"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
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
        },
    },
});
</script>