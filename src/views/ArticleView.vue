<template>
  <nav
    class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 print:hidden"
    aria-label="breadcrumbs"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ul class="flex space-x-2">
        <li>
          <router-link
            to="/"
            class="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-400"
            >Home</router-link
          >
        </li>
        <li>
          <span
            class="material-symbols-outlined text-gray-500 dark:text-gray-300"
            >chevron_right</span
          >
        </li>
        <li v-if="collectionName">
          <router-link
            :to="{ name: 'collection', params: { collection: collectionName } }"
            class="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-400"
            >{{ collectionName }}</router-link
          >
        </li>
        <li v-if="collectionName">
          <span
            class="material-symbols-outlined text-gray-500 dark:text-gray-300"
            >chevron_right</span
          >
        </li>
        <li>
          <a class="cursor-pointer text-gray-600 dark:text-gray-400">{{
            lang
          }}</a>
        </li>
        <li v-if="article.Title" class="hidden md:flex">
          <span
            class="material-symbols-outlined text-gray-500 dark:text-gray-300"
            >chevron_right</span
          >
        </li>
        <li
          class="text-gray-500 dark:text-gray-300 hidden md:flex"
          aria-current="page"
          v-if="article.Title"
        >
          {{ article.Title }}
        </li>
      </ul>
    </div>
  </nav>
  <section class="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200">
    <div class="container mx-auto py-8 px-4 text-center print:text-black">
      <h1 class="text-3xl font-bold">{{ article.Title }}</h1>
      <p class="mt-4">{{ article.Description }}</p>
      <div class="flex justify-center mt-4 gap-2">
        <a
          v-for="author in article.Authors"
          :key="author"
          class="flex items-center hover:scale-120 transition-transform"
          :href="`https://github.com/${author}`"
          target="_blank"
        >
          <img
            v-if="!imageError[author]"
            :src="`https://github.com/${author}.png?size=40`"
            :alt="author"
            class="w-7 h-7 rounded-full object-cover hover:shadow-lg transition-shadow"
            @error="imageError[author] = true"
            :title="author"
          />
          <span
            v-else
            class="w-7 h-7 rounded-full overflow-hidden bg-blue-500 dark:bg-blue-700 text-white font-bold inline-flex items-center justify-center -mr-3 hover:shadow-lg transition-shadow"
          >
            {{ getInitials(author) }}
          </span>
        </a>
      </div>
      <div class="flex flex-row justify-center mt-2 align-middle">
        <p class="flex flex-row gap-2 justify-center items-center mt-4 text-gray-700 dark:text-gray-400">
          <b>Reading time:</b> {{ readingTime }}
          <span class="inline-flex items-center justify-center gap-2 print:hidden">
            <span>&middot;</span>
            <span
            class="mdi material-symbols-outlined select-none cursor-pointer"
            @click="printArticle"
            >print</span
            >
            <span>&middot;</span>
            <span
              class="mdi material-symbols-outlined select-none cursor-pointer"
              @click="shareModalVisible = true"
              >share</span
            >
          </span>
        </p>
      </div>
    </div>
  </section>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex py-8">
    <aside class="hidden lg:block lg:w-1/4">
      <div class="sticky top-4 z-1">
        <div
          class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 rounded-lg"
        >
          <p class="font-semibold mb-4 text-gray-900 dark:text-gray-200">
            Navigation
          </p>
          <ul class="space-y-2 max-h-[85vh] overflow-y-scroll">
            <li
              v-for="(heading, index) in headings"
              :key="index"
              :style="heading.style"
              class="text-gray-900 dark:text-gray-200"
            >
              <a
                @click="scrollToHeading(heading.id)"
                class="cursor-pointer text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-400"
                >{{ heading.text }}</a
              >
            </li>
          </ul>
          <a
            v-if="editUrl != ''"
            :href="editUrl"
            target="_blank"
            class="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </a>
        </div>
      </div>
    </aside>
    <div class="w-full lg:w-3/4 lg:pl-4">
      <div
        class="content prose dark:prose-invert print:text-black article-content"
        v-html="article.Body"
      ></div>
      <div class="flex justify-between mt-8 space-x-4">
        <div class="w-1/2">
          <router-link
            v-if="previousArticle && previousArticle.Slug !== undefined"
            :to="`/${collectionName}/${chronosStore.prefLang}/${previousArticle.Slug}`"
            class="flex justify-between items-center border border-gray-300 rounded-lg p-4 gap-4"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            <div class="flex flex-col">
              <span class="mr-2 text-gray-700 dark:text-gray-300 text-right"
                >Previous</span
              >
              <span
                class="mr-2 text-gray-700 dark:text-gray-300 text-right font-semibold text-lg"
              >
                {{ previousArticle.Title }}
              </span>
            </div>
          </router-link>
        </div>
        <div class="w-1/2 text-right">
          <router-link
            v-if="nextArticle && nextArticle.Slug !== undefined"
            :to="`/${collectionName}/${chronosStore.prefLang}/${nextArticle.Slug}`"
            class="flex justify-between items-center border border-gray-300 rounded-lg p-4 gap-4"
          >
            <div class="flex flex-col">
              <span class="ml-2 text-gray-700 dark:text-gray-300 text-left"
                >Next</span
              >
              <span
                class="ml-2 text-gray-700 dark:text-gray-300 text-left font-semibold text-lg"
              >
                {{ nextArticle.Title }}
              </span>
            </div>
            <span class="material-symbols-outlined">arrow_forward</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <button
    @click="isSidebarVisible = !isSidebarVisible"
    class="material-symbols-outlined fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full z-50 md:hidden print:hidden"
  >
    menu
  </button>

  <div
    v-if="isSidebarVisible"
    @click.self="isSidebarVisible = false"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden bottom-0 flex flex-col items-end justify-end"
  >
    <aside
      class="relative bg-white dark:bg-gray-700 p-4 shadow-lg overflow-auto w-full rounded-t-lg pb-16"
    >
      <div class="p-2">
        <p class="font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Navigation
        </p>
        <ul class="space-y-2">
          <li
            v-for="(heading, index) in headings"
            :key="index"
            :style="heading.style"
            class="text-gray-900 dark:text-gray-200"
          >
            <a
              @click="scrollToHeading(heading.id)"
              class="cursor-pointer text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-400"
              >{{ heading.text }}</a
            >
          </li>
        </ul>
        <a
          v-if="editUrl != ''"
          :href="editUrl"
          target="_blank"
          class="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </a>
      </div>
    </aside>
  </div>
  <div
    v-if="shareModalVisible"
    @click.self="shareModalVisible = false"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
  >
    <ShareModal @close="shareModalVisible = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import type { Article, ChronosCollection, ChronosConfig } from "@/core/models";
import { useChronosStore } from "@/core/store";
import { useHead } from "unhead";
import ShareModal from "../components/ShareModal.vue";

export default defineComponent({
  name: "ArticleView",
  components: {
    ShareModal,
  },
  data() {
    return {
      article: {} as Article,
      lang: "",
      headings: [] as {
        text: string;
        id: string;
        level: number;
        style: string;
      }[],
      chronosConfig: {} as ChronosConfig,
      collectionName: "",
      editUrl: "",
      isSidebarVisible: false,
      imageError: reactive({} as any),
      previousArticle: {} as Article,
      nextArticle: {} as Article,
      shareModalVisible: false,
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
    readingTime() {
      if (!this.article || !this.article.Body) return "0m 0s";

      const wordCount = this.article.Body.split(/\s+/).length;

      // assuming an average reading speed of 200 words per minute
      const readingSpeed = 200;
      const minutes = Math.floor(wordCount / readingSpeed);
      const seconds = Math.round((wordCount / readingSpeed - minutes) * 60);

      return `${minutes}m ${seconds}s`;
    },
  },
  async mounted() {
    await this.initializeArticle();
    const collectionConfig = this.chronosConfig.chronosCollections.find(
      (c) => c.shortName === this.collectionName,
    );

    this.addCopyToClipboardToPres();

    document
      .getElementById(window.location.hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
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
        this.collectionName,
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
        this.collectionName,
      );
      this.handleArticleResponse(response, lang);
      this.setNextAndPreviousArticles();
    },
    async setNextAndPreviousArticles() {
      this.previousArticle = {} as Article;
      this.nextArticle = {} as Article;

      if (this.article.Previous && this.article.Previous !== "") {
        // @ts-ignore
        this.previousArticle =
          await this.$chronosAPI.getArticleByLanguageAndSlug(
            this.lang,
            this.article.Previous,
            this.collectionName,
          );
      }

      if (this.article.Next && this.article.Next !== "") {
        // @ts-ignore
        this.nextArticle = await this.$chronosAPI.getArticleByLanguageAndSlug(
          this.lang,
          this.article.Next,
          this.collectionName,
        );
      }

      console.log(this.previousArticle, this.nextArticle);
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
          {
            name: "og:title",
            content: `${this.article!.Title} - ${this.chronosConfig.title}`,
          },
          { name: "og:description", content: this.article!.Description },
          {
            name: "og:url",
            content: `${this.chronosConfig.baseURL}/${this.article!.Slug}`,
          },
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content: `${this.article!.Title} - ${this.chronosConfig.title}`,
          },
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
        hTag.id = hTag.textContent
          ?.replace(/\s+/g, "-")
          .toLowerCase() as string;
      });

      return doc.body.innerHTML;
    },
    setupRouteWatcher() {
      watch(
        () => this.$route,
        async (newRoute, oldRoute) => {
          if (
            newRoute.params.slug !== oldRoute.params.slug ||
            newRoute.params.lang !== oldRoute.params.lang
          ) {
            const lang = Array.isArray(newRoute.params.lang)
              ? newRoute.params.lang[0]
              : newRoute.params.lang;
            const slug = Array.isArray(newRoute.params.slug)
              ? newRoute.params.slug[0]
              : newRoute.params.slug;
            await this.loadArticle(lang, slug);
          }
        },
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
      const headings = [] as {
        text: string;
        id: string;
        level: number;
        style: string;
      }[];
      const parser = new DOMParser();
      const doc = parser.parseFromString(body, "text/html");
      const hTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

      hTags.forEach((hTag) => {
        const level = parseInt(hTag.tagName.slice(1));
        const heading = {
          text: hTag.textContent as string,
          id: hTag.id,
          level: level,
          style: `padding-left: ${level - 2}rem;`,
        };
        headings.push(heading);
      });

      return headings;
    },
    scrollToHeading(headingId: string) {
      const offset = 53;
      const element = document.getElementById(headingId);
      const y = element?.getBoundingClientRect().top;
      window.scrollTo({
        top: y ? y + window.scrollY - offset : 0,
        behavior: "smooth",
      });
      history.replaceState(null, null, "#" + headingId);
      window.scrollTo({
        top: y ? y + window.scrollY - offset : 0,
        behavior: "smooth",
      });
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
      event.target.style.display = "none";
    },
    printArticle() {
      window.print();
    },
    addCopyToClipboardToPres() {
      const codeBlocks = document.querySelectorAll("pre");
      codeBlocks.forEach((block) => {
        const div = document.createElement("div");
        div.className = "relative pre-div";

        const pre = document.createElement("pre");
        pre.textContent = block.textContent;
        div.appendChild(pre);

        const button = document.createElement("button");
        const iconStyle = "p-0 m-0 text-lg leading-none";
        button.className =
          "bg-blue-500 text-white p-[6px] rounded absolute right-2 top-2 opacity-0 transition-opacity size-fit flex items-center justify-center";
        button.type = "button";
        button.innerHTML = `<span class="material-symbols-outlined ${iconStyle}">content_copy</span>`;

        button.addEventListener("click", () => {
          if (pre.textContent !== null) {
            navigator.clipboard.writeText(pre.textContent);
          }
          button.classList.add("bg-green-600");
          button.innerHTML = `<span class="material-symbols-outlined ${iconStyle}">done</span>`;
          setTimeout(() => {
            button.classList.remove("bg-green-600");
            button.innerHTML = `<span class="material-symbols-outlined ${iconStyle}">content_copy</span>`;
          }, 2000);
        });

        div.appendChild(button);
        block.replaceWith(div);
      });
    },
  },
});
</script>
