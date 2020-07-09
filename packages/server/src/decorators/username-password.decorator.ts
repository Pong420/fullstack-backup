import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ValidateIf,
  IsString,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_MESSAGE,
  USERNAME_REGEX,
  USERNAME_REGEX_MESSAGE,
  PASSWORD_EUQAL_TO_USERNAME,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REGEX_MESSAGE
} from '@fullstack/common/constants';

export function ValidUsername(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MinLength(USERNAME_MIN_LENGTH, { message: USERNAME_MIN_LENGTH_MESSAGE }),
    MaxLength(USERNAME_MAX_LENGTH, { message: USERNAME_MAX_LENGTH_MESSAGE }),
    Matches(USERNAME_REGEX, {
      message: USERNAME_REGEX_MESSAGE
    })
  );
}

export function ValidPassword(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ValidateIf((payload: Record<string, unknown>, value) => {
      if (payload && payload.username && payload.username === value) {
        throw new BadRequestException(PASSWORD_EUQAL_TO_USERNAME);
      }
      return true;
    }),
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_MESSAGE }),
    MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_MESSAGE }),
    Matches(PASSWORD_REGEX, {
      message: PASSWORD_REGEX_MESSAGE
    })
  );
}
