import { history } from '../store';
import qs, { IParseOptions, IStringifyOptions } from 'qs';

interface Options {
  parseOptions?: IParseOptions;
  stringifyOptions?: IStringifyOptions;
}

function createSetSearchParam({
  parseOptions,
  stringifyOptions
}: Options = {}) {
  return function setSearchParam<T extends Record<string, unknown>>(
    payload: Partial<T> | ((params: Partial<T>) => Partial<T>)
  ) {
    const newState =
      typeof payload === 'function'
        ? payload(
            qs.parse(history.location.search.slice(1), { ...parseOptions }) as T
          )
        : payload;

    // remove value equals to undefined and ''
    for (const key in newState) {
      if (typeof newState[key] === 'undefined' || newState[key] === '') {
        delete newState[key];
      }
    }

    history.push({
      search: qs.stringify(newState, {
        encodeValuesOnly: true,
        ...stringifyOptions
      })
    });
  };
}

export const setSearchParam = createSetSearchParam();
export const clearSearchParam = () => history.push({ search: '' });
