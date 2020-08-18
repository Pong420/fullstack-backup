import { IsString, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$Favourite,
  Param$ToggleFavourite,
  DTOExcluded,
  FavouriteAction
} from '@fullstack/typings';

class Excluded
  implements DTOExcluded<Omit<Schema$Favourite, keyof Param$ToggleFavourite>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class ToggleFavourite extends Excluded
  implements
    Partial<
      Omit<Param$ToggleFavourite, keyof Excluded | keyof ToggleFavouriteDto>
    > {}

export class ToggleFavouriteDto extends ToggleFavourite
  implements Required<Omit<Param$ToggleFavourite, keyof ToggleFavourite>> {
  @IsString()
  product: string;

  @IsEnum(FavouriteAction)
  action: FavouriteAction;
}
