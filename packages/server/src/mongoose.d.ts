declare module 'mongoose' {
  interface PaginateOptions {
    projection?: Record<string, any>;
  }

  type MongooseFuzzySearchingField<T> =
    | keyof T
    | {
        name: keyof T;
        minSize?: number;
        weight?: number;
        prefixOnly?: boolean;
        escapeSpecialCharacters?: boolean;
        keys?: (string | number)[];
      };

  interface MongooseFuzzySearchingOptions<T extends Record<string, unknown>> {
    fields: MongooseFuzzySearchingField<T>[];
  }
}

declare module 'mongoose-fuzzy-searching';

declare module 'mongoose-fuzzy-searching/helpers' {
  export function nGrams(
    query: string,
    escapeSpecialCharacters: boolean,
    defaultNgamMinSize: number,
    checkPrefixOnly: boolean
  ): string[];
}
