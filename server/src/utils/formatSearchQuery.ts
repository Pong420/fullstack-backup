import { escapeRegex } from 'utils';

export function formatSearchQuery(keys: string[], search?: string) {
  const $regex = search && new RegExp(escapeRegex(search), 'gi');

  if ($regex) {
    return {
      $or: keys.map(key => ({ [key]: { $regex } }))
    };
  }

  return {};
}
