import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticleView from "../views/ArticleView.vue";
import ChronosConfig from "@/config";
import { useHead } from 'unhead'

const chronosConfig = ChronosConfig;
let logoUrl = chronosConfig.logoUrl;
if (logoUrl.startsWith("/")) {
  logoUrl = chronosConfig.baseUrl + logoUrl;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:lang/:slug",
      name: "article",
      component: ArticleView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to === undefined) {
    next();
    return;
  }

  useHead({
    title: chronosConfig.title,
    meta: [
      {
        name: "description",
        content: chronosConfig.description,
      },
      {
        name: "og:title",
        content: chronosConfig.title,
      },
      {
        name: "og:description",
        content: chronosConfig.description,
      },
      {
        name: "og:image",
        content: logoUrl,
      },
      {
        name: "og:url",
        content: chronosConfig.baseUrl + "/" + to.path,
      },
      {
        name: 'twitter:title',
        content: chronosConfig.title,
      },
      {
        name: 'twitter:description',
        content: chronosConfig.description,
      },
      {
        name: 'twitter:image',
        content: logoUrl,
      },
      {
        name: 'twitter:url',
        content: chronosConfig.baseUrl + "/" + to.path,
      },
    ],
  });

  next();
});

export default router;