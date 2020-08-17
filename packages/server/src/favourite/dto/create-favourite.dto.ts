import { Schema$Favourite, Param$CreateFavourite } from '@fullstack/typings';
import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

class Excluded implements Partial<Schema$Favourite> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: string;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateFavourite extends Excluded
  implements
    Partial<
      Omit<Param$CreateFavourite, keyof Excluded | keyof CreateFavouriteDto>
    > {}

export class CreateFavouriteDto extends CreateFavourite
  implements Required<Omit<Param$CreateFavourite, keyof CreateFavourite>> {
  @IsString()
  product: string;
}
