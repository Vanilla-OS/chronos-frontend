<script setup lang="ts">
const chronosStore = useChronosStore()
const localePath = useLocalePath()
</script>

<template>
  <div :class="{ 'sticky top-0 z-50 bg-white shadow': false }" class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center py-4" aria-label="main navigation">
        <div class="flex items-center">
        <NuxtLink :to="localePath('index')" class="flex items-center">
          <NuxtImg :src="chronosStore.$state.logoUrl" class="h-7" alt="Logo" />
          <h1 class="text-lg font-semibold ml-2">{{ $t('header.documentation') }}</h1>
        </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
        <NuxtLink class="text-base text-gray-600 hover:text-gray-900" :href="link.url" target="_blank"
          v-for="(link, index) in chronosStore.$state.extraLinks" :key="index">
          {{ link.name }}
        </NuxtLink>
        <button class="flex items-center p-2 text-gray-600 hover:text-gray-900" @click="toggleSearch()"
          v-if="collectionShortName">
          <MdiIcon icon="mdiMagnify" />
        </button>
        <div v-if="collectionShortName" class="relative">
          <button @click="showLangs = !showLangs" class="flex items-center p-2 text-gray-600 hover:text-gray-900">
          <span>{{ chronosStore.prefLang }}</span>
          <MdiIcon icon="mdiChevronDown" />
          </button>
          <div v-show="showLangs" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <div class="py-1">
                <a v-for="(lang, index) in langs" :key="index" @click="setLang(lang)"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  {{ lang }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      showSearch: false,
      collectionShortName: '',
      showLangs: false,
      langs: ['en'],
    }
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    setLang(lang: string) {
      // todo
    }
  }
})
</script>