interface Article {
    Title: string;
    Description: string;
    PublicationDate: string;
    Authors: string[];
    Tags: string[];
    Body: string;
    Slug: string;
}

interface SearchResponse {
    query: string;
    results: Article[];
}

interface ArticlesResponse {
    title: string;
    supportedLang: string[];
    tags: string[];
    articles: Article[];
}

interface ChronosConfig {
    title: string;
    logoTitle: string;
    logoUrl: string;
    description: string;
    baseURL: string;
    chronosCollections: ChronosCollection[];
    extraLinks?: ExtraLink[];
}

interface ChronosCollection {
    shortName: string;
    title: string;
    url: string;
    description: string;
    editUrl: string;
}

interface ExtraLink {
    url: string;
    name: string;
}

export type { Article, SearchResponse, ArticlesResponse, ChronosConfig, ChronosCollection, ExtraLink };
