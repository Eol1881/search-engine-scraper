export type SearchResult = {
  searchQuery: string;
  links: {
    url: string;
    index: number;
  }[];
};
