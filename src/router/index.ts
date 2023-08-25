import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticleView from "../views/ArticleView.vue";
import { useHead } from 'unhead'


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

  next();
});

export default router;