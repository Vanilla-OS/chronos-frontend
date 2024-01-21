interface Article {
    Title: string;
    Description: string;
    PublicationDate: string;
    Authors: string[];
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
    articles: Article[];
}

interface ChronosConfig {
    title: string;
    logoTitle: string;
    logoUrl: string;
    description: string;
    baseURL: string;
    chronosCollections: ChronosCollection[];
    extraLinks: ExtraLink[];
}

interface ChronosCollection {
    shortName: string;
    title: string;
    url: string;
    description: string;
}

interface ExtraLink {
    url: string;
    name: string;
}

export type { Article, SearchResponse, ArticlesResponse, ChronosConfig, ChronosCollection, ExtraLink };