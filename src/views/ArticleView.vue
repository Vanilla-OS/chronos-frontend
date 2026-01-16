<template>
  <nav
    class="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 print:hidden"
    aria-label="breadcrumbs"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    </div>
  </nav>
  <div class="flex flex-row">
    <aside
      class="w-76 fixed inset-y-0 left-0 pt-20 pb-8 px-6 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto hidden lg:block bg-white dark:bg-zinc-950 z-40 transform transition-transform duration-300 -translate-x-full lg:translate-x-0">
      <div
        class="flex flex-col gap-4 p-4 rounded-lg h-full opacity-70"
      >
        <ul class="flex flex-col space-x-2 text-sm">
          <li class="flex flex-row items-center gap-2">
            <p class="w-max">
              <router-link
                to="/"
                class="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 dark:text-zinc-400 font-bold"
              >Home
              </router-link
              >
            </p>
            <p class="flex flex-row items-center">
          <span
            class="material-symbols-outlined text-zinc-500 dark:text-zinc-300 text-sm"
          >chevron_right</span
          >
            </p>
            <p v-if="collectionName" class="flex flex-row items-center">
              <router-link
                :to="{ name: 'collection', params: { collection: collectionName } }"
                class="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 dark:text-zinc-400"
              >{{ collectionName }}
              </router-link
              >
            </p>
          </li>
          <li class="flex flex-row gap-2">
            <p v-if="collectionName" class="flex flex-row items-center">
          <span
            class="material-symbols-outlined inline-flex items-center justify-center text-zinc-500 dark:text-zinc-300 text-md"
          >chevron_right</span
          >
            </p>
            <p>
              <a class="cursor-pointer text-zinc-600 dark:text-zinc-400">{{
                  lang
                }}</a>
            </p>
            <p v-if="article.Title" class="hidden md:flex flex flex-row items-center">
          <span
            class="material-symbols-outlined text-zinc-500 dark:text-zinc-300 text-md"
          >chevron_right</span
          >
            </p>
            <p
              class="text-zinc-500 dark:text-zinc-300 hidden md:flex"
              aria-current="page"
              v-if="article.Title"
            >
              {{ article.Title }}
            </p>
          </li>
        </ul>
        <p
          class="font-semibold text-zinc-900 dark:text-zinc-500 cursor-pointer uppercase tracking-[0.2em] text-xs"
          @click="isSidebarVisible = !isSidebarVisible"
        >
          Navigation
        </p>
        <ul v-if="!isSidebarVisible"
            class="space-y-2 h-full overflow-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <li
            v-for="(heading, index) in headings"
            :key="index"
            :style="heading.style"
            class="text-zinc-900 dark:text-zinc-200"
          >
            <a
              @click="scrollToHeading(heading.id)"
              class="cursor-pointer text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-400 dark:text-zinc-400 lowercase"
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
        <div class="flex flex-row justify-center gap-12 items-center mt-8">
          <p class="flex flex-row gap-2 justify-center items-center text-zinc-700 dark:text-zinc-400">
            <span class="material-symbols-outlined text-sm">schedule</span>
            {{ readingTime }}
          </p>
          <div class="flex items-center justify-center gap-5 print:hidden text-zinc-700 dark:text-zinc-400">
            <span
              class="material-symbols-outlined select-none cursor-pointer"
              @click="printArticle"
            >print</span
            >
            <span
              class="material-symbols-outlined select-none cursor-pointer"
              @click="shareModalVisible = true"
            >share</span
            >
          </div>
        </div>
      </div>
    </aside>
    <section class="text-black dark:text-zinc-200 w-full lg:ml-76 flex-1">
      <div class="container mx-auto pt-24 py-12 px-4 text-center print:text-black">
        <h1 class="text-3xl font-bold">{{ article.Title }}</h1>
        <p class="mt-4">{{ article.Description }}</p>
        <div class="flex justify-center mt-4 gap-2">
          <a
            v-for="author in article.Authors"
            :key="author"
            class="flex items-center hover:scale-120 grayscale-100 hover:grayscale-0 transition-all"
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
      </div>
    </section>
  </div>

  <div
    class="flex-1 lg:ml-76 px-4 sm:px-6 lg:px-12 py-12"
    :class="{'flex-col gap-6': isSidebarVisible, 'flex-row': !isSidebarVisible}"
  >
    <div class="w-full max-w-full mx-auto"
         :class="{'lg:w-full': isSidebarVisible, 'lg:w-3/4 lg:pl:4': !isSidebarVisible}"
    >
      <div
        class="content prose dark:prose-invert print:text-black article-content prose-blockquote:"
        v-html="article.Body"
      ></div>
      <div class="flex justify-between mt-8 space-x-4">
        <div class="w-1/2">
          <router-link
            v-if="previousArticle && previousArticle.Slug !== undefined"
            :to="`/${collectionName}/${chronosStore.prefLang}/${previousArticle.Slug}`"
            class="flex justify-between items-center border border-zinc-300 rounded-lg p-4 gap-4"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            <div class="flex flex-col">
              <span class="mr-2 text-zinc-700 dark:text-zinc-300 text-right"
              >Previous</span
              >
              <span
                class="mr-2 text-zinc-700 dark:text-zinc-300 text-right font-semibold text-lg"
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
            class="flex justify-between items-center border border-zinc-300 rounded-lg p-4 gap-4"
          >
            <div class="flex flex-col">
              <span class="ml-2 text-zinc-700 dark:text-zinc-300 text-left"
              >Next</span
              >
              <span
                class="ml-2 text-zinc-700 dark:text-zinc-300 text-left font-semibold text-lg"
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

  <nav class="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50 md:hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ul class="flex justify-between items-center h-14">
        <li class="flex-1">
          <router-link to="/" class="w-full h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <span class="material-symbols-outlined">home</span>
            <span class="text-[10px] mt-0.5">Home</span>
          </router-link>
        </li>

        <li class="flex-1">
          <button @click="isSidebarVisible = !isSidebarVisible" class="w-full h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <span class="material-symbols-outlined">menu</span>
            <span class="text-[10px] mt-0.5">Contents</span>
          </button>
        </li>

        <li class="flex-1">
          <a v-if="editUrl !== ''" :href="editUrl" target="_blank" class="w-full h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <span class="material-symbols-outlined">edit</span>
            <span class="text-[10px] mt-0.5">Edit</span>
          </a>
          <button v-else class="w-full h-full flex flex-col items-center justify-center text-zinc-400 cursor-not-allowed" disabled>
            <span class="material-symbols-outlined">edit</span>
            <span class="text-[10px] mt-0.5">Edit</span>
          </button>
        </li>

        <li class="flex-1">
          <button @click="shareModalVisible = true" class="w-full h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <span class="material-symbols-outlined">share</span>
            <span class="text-[10px] mt-0.5">Share</span>
          </button>
        </li>

        <li class="flex-1">
          <button @click="printArticle" class="w-full h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <span class="material-symbols-outlined">print</span>
            <span class="text-[10px] mt-0.5">Print</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <div
    v-if="isSidebarVisible"
    @click.self="isSidebarVisible = false"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden bottom-0 flex flex-col items-end justify-end"
  >
    <aside
      class="relative bg-white dark:bg-zinc-800 p-4 shadow-lg overflow-auto w-full rounded-t-lg pb-16"
    >
      <div class="p-2">
        <p class="font-semibold mb-4 text-zinc-900 dark:text-zinc-200">
          Navigation
        </p>
        <ul class="space-y-2">
          <li
            v-for="(heading, index) in headings"
            :key="index"
            :style="heading.style"
            class="text-zinc-900 dark:text-zinc-200"
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
  <footer class="bg-white dark:bg-zinc-950 mt-12 lg:ml-76">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-base text-zinc-600 dark:text-zinc-400 print:hidden">
        <strong>Chronos</strong> by <a href="https://vanillaos.org"
                                       class="text-zinc-500 dark:text-zinc-300">Vanilla OS</a>.
      </p>
      <p class="text-base text-zinc-600 dark:text-zinc-400 hidden print:block">
        PDF generated with <strong>Chronos</strong> by <a href="https://vanillaos.org"
                                                          class="text-blue-800 dark:text-blue-400 hover:underline">Vanilla
        OS</a>.
      </p>
    </div>
  </footer>

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
    ShareModal
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
      shareModalVisible: false
    };
  },
  computed: {
    chronosStore() {
      return useChronosStore();
    },
    readingTime() {
      if (!this.article || !this.article.Body) return "0m 0s";

      const wordCount = this.article.Body.split(/\s+/).length;

      const readingSpeed = 200;
      const minutes = Math.floor(wordCount / readingSpeed);
      const seconds = Math.round((wordCount / readingSpeed - minutes) * 60);

      return `${minutes}m ${seconds}s`;
    }
  },
  async mounted() {
    await this.initializeArticle();
    const collectionConfig = this.chronosConfig.chronosCollections.find(
      (c) => c.shortName === this.collectionName
    );

    this.$nextTick(() => {
      this.transformPreBlocks();
    });

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
      this.setNextAndPreviousArticles();

      this.$nextTick(() => {
        this.transformPreBlocks();
      });
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
            this.collectionName
          );
      }

      if (this.article.Next && this.article.Next !== "") {
        // @ts-ignore
        this.nextArticle = await this.$chronosAPI.getArticleByLanguageAndSlug(
          this.lang,
          this.article.Next,
          this.collectionName
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
            content: `${this.article!.Title} - ${this.chronosConfig.title}`
          },
          { name: "og:description", content: this.article!.Description },
          {
            name: "og:url",
            content: `${this.chronosConfig.baseURL}/${this.article!.Slug}`
          },
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content: `${this.article!.Title} - ${this.chronosConfig.title}`
          },
          { name: "twitter:description", content: this.article!.Description }
        ]
      });

      return {
        article: _article,
        headings: _headings
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
          style: `padding-left: ${level - 2}rem;`
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
        behavior: "smooth"
      });
      history.replaceState(null, null, "#" + headingId);
      window.scrollTo({
        top: y ? y + window.scrollY - offset : 0,
        behavior: "smooth"
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
    transformPreBlocks() {
      const containerSelector = ".article-content";
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const knownLangLabel = new Set([
        "bash", "sh", "shell", "zsh", "fish", "go", "js", "javascript", "ts", "typescript",
        "json", "yaml", "yml", "toml", "ini", "dockerfile", "html", "css", "python", "py",
        "rust", "rs", "c", "cpp", "java", "md", "markdown"
      ]);

      const aliasMap: Record<string, string> = {
        md: "markdown",
        markdown: "markdown",
        sh: "bash",
        bash: "bash",
        py: "python",
        js: "javascript",
        ts: "typescript",
        yml: "yaml",
        rs: "rust",
        cpp: "cpp",
        csharp: "csharp"
      };

      container.querySelectorAll("pre").forEach((pre) => {
        if ((pre.parentElement && pre.parentElement.classList.contains("not-prose")) || pre.dataset.transformed === "true") {
          return;
        }

        const code = pre.querySelector("code");
        const rawText = (code?.textContent ?? pre.textContent ?? "").replace(/\r\n/g, "\n");
        const firstLine = rawText.split("\n")[0]?.trim() ?? "";

        let lang = "";
        if (code) {
          const langClass = Array.from(code.classList).find((c) =>
            c.startsWith("language-")
          );
          if (langClass) lang = langClass.replace("language-", "");
        }
        if (!lang && knownLangLabel.has(firstLine.toLowerCase())) {
          lang = firstLine.toLowerCase();
          if (code) {
            code.textContent = rawText.split("\n").slice(1).join("\n");
          } else {
            pre.textContent = rawText.split("\n").slice(1).join("\n");
          }
        }
        if (!lang) lang = "code";

        const normalized = aliasMap[lang] ?? lang;
        let hljsLang = normalized;

        const wrapper = document.createElement("div");
        wrapper.className =
          "not-prose relative group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700 my-6";

        const header = document.createElement("div");
        header.className =
          "flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50";
        const leftSpan = document.createElement("span");
        leftSpan.className = "text-xs font-mono text-zinc-500";
        leftSpan.textContent = lang;
        const controls = document.createElement("div");
        controls.className = "flex items-center gap-2";

        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "copy-btn text-zinc-500 dark:text-zinc-300 p-1 rounded flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100";
        button.setAttribute("aria-label", "Copy code");
        button.innerHTML = `<span class="material-symbols-outlined text-md">content_copy</span>`;

        button.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const textToCopy = code ? code.textContent ?? "" : pre.textContent ?? "";
          try {
            await navigator.clipboard.writeText(textToCopy);
            const prev = button.innerHTML;
            button.innerHTML = `<span class="material-symbols-outlined text-md">done</span>`;
            setTimeout(() => (button.innerHTML = prev), 1500);
          } catch (e) {
            button.classList.add("bg-red-600", "text-white");
            setTimeout(() => button.classList.remove("bg-red-600", "text-white"), 1200);
          }
        });

        pre.style.cssText =
          "background: transparent !important; margin: 0 !important; padding: 1rem !important; border: none !important;";
        pre.classList.add("overflow-x-auto", "text-sm", "scrollbar-thin", "scrollbar-thumb-zinc-300", "dark:scrollbar-thumb-zinc-700", "scrollbar-track-transparent");

        controls.appendChild(button);
        header.appendChild(leftSpan);
        header.appendChild(controls);

        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        pre.dataset.transformed = "true";

        try {
          // @ts-ignore
          const hljs = window.hljs;
          if (hljs && code instanceof HTMLElement) {
            const hasLang = hljs.getLanguage(hljsLang);
            if (hasLang) {
              Array.from(code.classList)
                .filter(c => c.startsWith("language-"))
                .forEach(c => code.classList.remove(c));
              code.classList.add(`language-${hljsLang}`);
              try {
                // @ts-ignore
                hljs.highlightElement(code);
              } catch {
                const res = hljs.highlightAuto(code.textContent ?? "");
                code.innerHTML = res.value;
              }
            } else {
              Array.from(code.classList)
                .filter(c => c.startsWith("language-"))
                .forEach(c => code.classList.remove(c));
              try {
                const res = hljs.highlightAuto(code.textContent ?? "");
                code.innerHTML = res.value;
              } catch {
              }
            }
          } else if (hljs) {
            try {
              const res = hljs.highlightAuto(pre.textContent ?? "");
              pre.innerHTML = res.value;
            } catch {
              // ignore
            }
          }
        } catch (err) {
        }
      });
    }
  }
});
</script>

<style scoped>
.article-content pre {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.article-content code {
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 0.875rem;
  font-weight: 400;
}

.copy-btn {
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.12s ease, color 0.12s ease;
  line-height: 1;
  height: 1.75rem;
  min-width: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
}

.not-prose.group:hover .copy-btn,
.not-prose.group:focus-within .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.dark .copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.article-content pre code {
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 0.875rem;
  font-weight: 400;
}

nav.fixed.bottom-0 {
  backdrop-filter: blur(6px);
  background-color: rgba(255,255,255,0.9);
}
.dark nav.fixed.bottom-0 {
  background-color: rgba(17,17,19,0.8);
}

nav ul li span.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 20px;
  line-height: 1;
}

nav ul li .text-[10px] {
  display: block;
  line-height: 1;
  font-size: 10px;
}

@media print {
  nav.fixed.bottom-0 { display: none !important; }
}
</style>

