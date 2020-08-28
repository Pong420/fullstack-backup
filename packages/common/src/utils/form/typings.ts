type ValueOf<T> = T[keyof T];

type Cons<H, T> = T extends readonly any[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

// https://stackoverflow.com/a/58436959
export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends any[] // for array
  ? [number]
  : T extends object // eslint-disable-line @typescript-eslint/ban-types
  ? {
      [K in keyof T]-?: K extends keyof T[K] & keyof ValueOf<T[K]>
        ? (keyof T)[] // this turn [string, string, string] into string[]
        :
            | [K]
            | (Paths<T[K], Prev[D]> extends infer P
                ? P extends []
                  ? never
                  : Cons<K, P>
                : never);
    }[keyof T]
  : [];

export type DeepPartial<T> = T extends any[] | (() => void)
  ? T
  : T extends object // eslint-disable-line @typescript-eslint/ban-types
  ? {
      [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]; // eslint-disable-line @typescript-eslint/ban-types
    }
  : T;

interface NextInt {
  0: 1;
  1: 2;
  2: 3;
  3: 4;
  4: 5;
  [rest: number]: number;
}

export type PathType<T, P extends any[], Index extends keyof P & number = 0> = {
  [K in keyof P & number & Index]: P[K] extends undefined
    ? T
    : P[K] extends keyof T
    ? NextInt[K] extends keyof P & number
      ? PathType<T[P[K]], P, Extract<NextInt[K], keyof P & number>>
      : T[P[K]]
    : never;
}[Index];

export type NamePath<T, D extends number = 4> = keyof T | Paths<T, D>;

export interface Control<T = any> {
  value?: T;
  onChange?: (value?: T) => void;
}

export interface ControlProps<T = unknown> extends Control<T> {
  name?: (string | number)[];
}
