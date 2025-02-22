export const buildRegexpParseElements =
  (regexp: RegExp) =>
  async (content: string): Promise<string[]> => {
    return content.match(regexp) ?? [];
  };
