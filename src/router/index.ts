import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticleView from "../views/ArticleView.vue";
import CollectionView from "../views/CollectionView.vue";
import NotFoundView from "../views/NotFoundView.vue";
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
      path: "/collections/:collection",
      name: "collection",
      component: CollectionView,
    },
    {
      path: "/:collection/:lang/:slug",
      name: "article",
      component: ArticleView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundView,
    }
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
