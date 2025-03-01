<template>
  <div
    class="flex fixed top-0 left-0 justify-center items-center z-40 size-full"
  >
    <div
      class="flex absolute top-0 left-0 size-full bg-gray-100 dark:bg-gray-800 backdrop-blur-xl z-40"
      @click="$emit('close')"
    ></div>
    <div
      class="relative shadow-lg rounded-xl bg-white dark:bg-gray-900 w-[30%] h-max z-50"
    >
      <div class="grid gap-4 p-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-neutral-50">
            Share
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-900 dark:text-neutral-50 hover:text-gray-600 dark:hover:text-neutral-300"
          >
            ✕
          </button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <a
          v-for="(link, index) in socialLinks"
            :key="index"
            :href="link.url"
            target="_blank"
            class="p-4 bg-gray-100 dark:bg-gray-800 dark:bg-opacity-50 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <i :class="link.icon" class="text-gray-900 dark:text-white"></i>
          </a>
          <div
            @click="sendEmail"
            class="p-4 bg-gray-100 dark:bg-gray-800 dark:bg-opacity-50 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          >
            <i class="fa-regular fa-envelope text-gray-900 dark:text-white"></i>
          </div>
          <div
            @click="copyLink"
            class="p-4 bg-gray-100 dark:bg-gray-800 dark:bg-opacity-50 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 col-span-3 cursor-pointer"
          >
            <i class="fa-regular fa-copy text-gray-900 dark:text-white"></i>
            <span class="ml-2 text-gray-900 dark:text-white">
              {{ copied ? "Copied!" : "Copy to Clipboard" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const copied = ref(false);

const socialLinks = ref([
  { icon: "fa-brands fa-mastodon", url: `https://shareopenly.org/share/?title=${document.title}&url=${window.location.href}` },
  { icon: "fa-brands fa-twitter", url: `https://twitter.com/intent/tweet?text=${window.location.href}` },
  { icon: "fa-brands fa-telegram", url: `https://t.me/share/url?url=${window.location.href}` },
  { icon: "fa-brands fa-facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` },
  { icon: "fa-brands fa-whatsapp", url: `https://api.whatsapp.com/send?text=${window.location.href}` },
  { icon: "fa-brands fa-linkedin", url: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}` },
]);

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const sendEmail = () => {
  const subject = "Check out this article";
  const body = `I thought
    you might like this article: ${window.location.href}`;
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};
</script>
