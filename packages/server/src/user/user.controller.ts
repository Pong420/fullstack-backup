import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { UserRole } from '@fullstack/typings';
import { FastifyRequest } from 'fastify';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Access } from '../utils/access.guard';
import { MultiPartInterceptor } from '../utils/MultiPartInterceptor';
import {
  MongooseCRUDController,
  PaginateResult,
  ObjectId,
  Condition
} from '../utils/MongooseCRUDController';
import { Cloudinary } from '../cloudinary/cloudinary.decorator';
import { UserRolePipe } from './user-role.pipe';

const roles = Object.values(UserRole)
  .filter((v): v is number => !isNaN(Number(v)))
  .map(role => ({ role }));

@Controller('user')
@Access('ADMIN', 'MANAGER', 'SELF')
export class UserController extends MongooseCRUDController<User> {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    super(userService);
  }

  @Get()
  @Access('ADMIN', 'MANAGER')
  getAll(
    @Query() query: QueryUserDto,
    @Req() req: FastifyRequest
  ): Promise<PaginateResult<User>> {
    const { user } = req;
    const condition: Condition[] = user
      ? [
          {
            $or: roles.filter(({ role }) => role > user.role)
          },
          { $nor: [{ username: req.user.username }] } // Exclude self
        ]
      : undefined;
    return this.userService.paginate({
      ...query,
      condition
    });
  }

  @Post()
  @Access('ADMIN', 'MANAGER')
  @UseInterceptors(MultiPartInterceptor())
  create(
    @Body(UserRolePipe) dto: CreateUserDto,
    @Cloudinary('avatar') [avatar]: (string | null)[]
  ): Promise<User> {
    return this.userService.create({ ...dto, avatar });
  }

  @Patch(':id')
  @Access('ADMIN', 'MANAGER', 'SELF')
  @UseInterceptors(MultiPartInterceptor())
  async update(
    @ObjectId() id: string,
    @Body(UserRolePipe) changes: UpdateUserDto,
    @Cloudinary('avatar') [avatar]: (string | null)[]
  ): Promise<User> {
    return this.userService.update({ _id: id }, { ...changes, avatar });
  }
}
