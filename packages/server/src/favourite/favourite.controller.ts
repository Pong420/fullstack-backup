import { Controller, Get, Post, Delete, HttpCode } from '@nestjs/common';
import { paths } from '@fullstack/common/constants';
import { FavouriteService } from './favourite.service';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { Favourite } from './schema/favourite.schema';
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
    @ObjectId('product') product: string,
    @UserId() user: UserId
  ): Promise<Favourite | void> {
    const query = { product, ...user };
    const favourite = await this.favouriteService.findOne(query);
    return favourite
      ? this.favouriteService.delete(query)
      : this.favouriteService.create(query);
  }

  @Delete(paths.favourite.delete_favourite)
  deleteFavourites(
    @ObjectId() id: string,
    @UserId([UserRole.CLIENT]) user: UserId
  ): Promise<void> {
    return this.favouriteService.delete({ _id: id, ...user });
  }
}
