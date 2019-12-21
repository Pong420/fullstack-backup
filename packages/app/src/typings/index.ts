export type PromiseOf<T> = T extends Promise<infer T> ? T : never;
