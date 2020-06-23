import { escapeRegex } from './escapeRegex';
import { SearchRegex, SearchQuery } from '../typings';

export function formatSearchQuery(
  keys: string[] = [],
  search: string
): SearchQuery {
  const $regex = search && new RegExp(escapeRegex(search), 'gi');

  if ($regex) {
    return {
      $or: keys.map<SearchRegex>(key => ({
        [key]: { $regex }
      }))
    };
  }

  return {};
}
