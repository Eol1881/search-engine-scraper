export const buildRegexpParseElements =
  (regexp: RegExp) =>
  async (content: string): Promise<string[]> => {
    return [...new Set(content.match(regexp) ?? [])];
  };
