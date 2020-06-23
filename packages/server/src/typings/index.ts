export * from './jwt';

export type Condition = Record<string, unknown>;
export type SearchRegex = Record<string, { $regex: RegExp }>;
export type SearchQuery = Record<string, (SearchRegex | Condition)[]>;

export enum Order {
  ASC,
  DESC
}
