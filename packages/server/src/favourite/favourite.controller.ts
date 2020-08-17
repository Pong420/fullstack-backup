import { Controller, Get, Req, Post, Delete, Body } from '@nestjs/common';
import { paths } from '@fullstack/common/constants';
import { FastifyRequest } from 'fastify';
import { FavouriteService } from './favourite.service';
import { Access } from '../utils/access.guard';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { Favourite } from './schema/favourite.schema';
import { AttachUserPipe } from 'src/utils/attach-user.pipe';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { ObjectId } from 'src/decorators';

@Controller('favourite')
@Access('ADMIN', 'MANAGER', 'CLIENT')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get(paths.favourite.get_favourites)
  getFavourites(
    @Req() req: FastifyRequest
  ): Promise<PaginateResult<Favourite>> {
    return this.favouriteService.paginate({ user: req.user.user_id });
  }

  @Post(paths.favourite.create_favourite)
  createFavourites(
    @Body(AttachUserPipe) createFavourite: CreateFavouriteDto
  ): Promise<Favourite> {
    return this.favouriteService.create(createFavourite);
  }

  @Delete(paths.favourite.delete_favourite)
  deleteFavourites(
    @ObjectId() id: string,
    @Req() req: FastifyRequest
  ): Promise<void> {
    const user =
      req.user.role === UserRole.CLIENT ? { user: req.user.user_id } : {};
    return this.favouriteService.delete({ _id: id, ...user });
  }
}
