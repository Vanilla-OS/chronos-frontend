interface Article {
    Title: string;
    Description: string;
    PublicationDate: string;
    Authors: string[];
    Tags: string[];
    Body: string;
    Slug: string;
    StoryId: string;
    Story: Story;
    Previous: string | null;
    Next: string | null;
    Listed: boolean;
}

interface SearchResponse {
    query: string;
    results: Article[];
}

interface Story {
    Id: string;
    Name: string;
    Description: string;
    StartSlug: string;
}

interface ArticlesResponse {
    title: string;
    supportedLang: string[];
    tags: string[];
    articles: Article[];
    stories: Story[];
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

export type { Article, SearchResponse, ArticlesResponse, ChronosConfig, ChronosCollection, ExtraLink, Story };
