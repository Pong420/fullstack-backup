import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export function ValidUsername(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MinLength(6),
    MaxLength(20),
    Matches(/^[a-z][a-z0-9]*$/i, {
      message:
        'Username can only contain alphanumeric characters (letters A-Z, numbers 0-9)'
    })
  );
}

export function ValidPassword(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MinLength(8),
    MaxLength(20),
    Matches(/(?=.*?[a-z,A-Z])(?=.*?[0-9])/, {
      message: 'Password must contain at least one letter and one number'
    })
  );
}
