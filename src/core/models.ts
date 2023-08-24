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
    groupedArticles: { [lang: string]: { [path: string]: Article } };
}

export type { Article, SearchResponse, ArticlesResponse };