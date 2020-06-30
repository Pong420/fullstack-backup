export * from './service';
export * from './utils';

export function isNotEmpty<T>(payload: T | Partial<T>): payload is T {
  return Object.keys(payload).length > 0;
}
