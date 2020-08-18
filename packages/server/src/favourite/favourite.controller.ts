import { Controller, Get, Post, Delete, HttpCode, Param } from '@nestjs/common';
import { paths } from '@fullstack/common/constants';
import { PaginateResult, UserRole, FavouriteAction } from '@fullstack/typings';
import { FavouriteService } from './favourite.service';
import { Favourite } from './schema/favourite.schema';
import { ToggleFavouriteDto } from './dto/toggle-favourite.dto';
import { ObjectId, UserId } from '../decorators';
import { Access } from '../utils/access.guard';

@Controller('favourite')
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get(paths.favourite.get_favourites)
  getFavourites(@UserId() user: UserId): Promise<PaginateResult<Favourite>> {
    return this.favouriteService.paginate(user);
  }

  @Post(paths.favourite.toggle_favourite)
  @HttpCode(200)
  async toggleFavourites(
    @ObjectId('product') _for_checking: string,
    @UserId() user: UserId,
    @Param() { action, product }: ToggleFavouriteDto
  ): Promise<Favourite | void> {
    const query = { product, ...user };
    return action === FavouriteAction.Add
      ? this.favouriteService.update(query, { product }, { upsert: true })
      : this.favouriteService.delete(query);
  }

  @Delete(paths.favourite.delete_favourite)
  deleteFavourites(
    @ObjectId() id: string,
    @UserId([UserRole.CLIENT]) user: UserId
  ): Promise<void> {
    return this.favouriteService.delete({ _id: id, ...user });
  }
}
