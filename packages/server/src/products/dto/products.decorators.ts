import {
  IsInt,
  IsNumber,
  IsString,
  IsArray,
  IsLowercase,
  IsBoolean,
  IsPositive,
  Max,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

// export const PRICE_MIN = 0;
export const AMOUNT_MIN = 1;
export const DISCOUNT_MIN = 0;
export const DISCOUNT_MAX = 100;

export function Price(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    //
    IsNumber(),
    IsPositive(),
    Transform(Number)
  );
}

export function Amount(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    //
    IsInt(),
    Min(AMOUNT_MIN),
    Transform(Number)
  );
}

export function Disscount(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsInt(),
    Max(DISCOUNT_MAX),
    Min(DISCOUNT_MIN),
    Transform(Number)
  );
}

export function Hidden(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsBoolean(),
    Transform(Boolean)
    //
  );
}

export function Tags(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsArray(),
    IsString({ each: true }),
    IsLowercase({ each: true }),
    Transform(arr =>
      Array.isArray(arr) ? arr.map((s: string) => s.toLowerCase()) : arr
    )
  );
}
