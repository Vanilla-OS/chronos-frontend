<template>
    <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><a>{{ lang }}</a></li>
            <li class="is-active">
                <a href="#" aria-current="page">
                    {{ article.Title }}
                </a>
            </li>
        </ul>
    </nav>
    <section class="hero">
        <div class="hero-body">
            <h1 class="title">{{ article.Title }}</h1>
            <p class="subtitle">{{ article.Description }}</p>
        </div>
    </section>
    <div class="paned">
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
            </aside>
        </div>
        <div v-html="article.Body" class="content"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import type { Article, ChronosConfig } from "@/core/models";
import { useChronosStore } from "@/core/store";
import { useHead } from 'unhead'


export default defineComponent({
    name: "ArticleView",
    data() {
        return {
            article: {} as Article,
            lang: "",
            headings: [] as { text: string, id: string, level: number }[],
            chronosConfig: {} as ChronosConfig,
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

        // @ts-ignore
        await this.loadArticle(this.$route.params.lang, this.$route.params.slug);
        this.setupRouteWatcher();

        this.chronosStore.$subscribe(() => {
            if (this.lang !== this.chronosStore.prefLang) {
                // @ts-ignore
                this.$chronosAPI.getArticleByLanguageAndSlug(this.chronosStore.prefLang, this.$route.params.slug).then((response) => {
                    this.lang = this.chronosStore.prefLang;
                    const hResponse = this.handleResponse(response);
                    this.article = hResponse.article;
                    this.headings = hResponse.headings;
                    document.title = `${this.article!.Title} - ${this.chronosConfig.title}`;
                });
                window.history.pushState({}, "", `/${this.chronosStore.prefLang}/${this.$route.params.slug}`);
            }
        });
    },
    methods: {
        async loadArticle(lang: string, slug: string) {
            if (slug === undefined) {
                return;
            }

            // @ts-ignore
            this.$chronosAPI.getArticleByLanguageAndSlug(this.$route.params.lang, this.$route.params.slug).then((response) => {
                this.lang = this.$route.params.lang as string;
                const hResponse = this.handleResponse(response);
                this.article = hResponse.article;
                this.headings = hResponse.headings;
                document.title = `${this.article!.Title} - ${this.chronosConfig.title}`;
            });
        },
        handleResponse(response: Article) {
            let _article = response;
            _article.Body = this.setHeadingIds(_article.Body);
            let _headings = this.extractHeadings(_article.Body);

            useHead({
                title: `${this.article!.Title} - ${this.chronosConfig.title}`,
                meta: [
                    {
                        name: 'description',
                        content: this.article!.Description,
                    },
                    {
                        name: 'og:title',
                        content: `${this.article!.Title} - ${this.chronosConfig.title}`,
                    },
                    {
                        name: 'og:description',
                        content: this.article!.Description,
                    },
                    {
                        name: 'og:url',
                        content: `${this.chronosConfig.baseURL}/${this.article!.Slug}`,
                    },
                    {
                        name: 'twitter:card',
                        content: 'summary_large_image',
                    },
                    {
                        name: 'twitter:title',
                        content: `${this.article!.Title} - ${this.chronosConfig.title}`,
                    },
                    {
                        name: 'twitter:description',
                        content: this.article!.Description,
                    },
                ],
            })

            return {
                article: _article,
                headings: _headings,
            }
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
                        // @ts-ignore
                        await this.loadArticle(newRoute.params.lang, newRoute.params.slug);
                    }
                }
            );
        },
        extractHeadings(body: string) {
            const headings = [] as { text: string, id: string, level: number }[];
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
