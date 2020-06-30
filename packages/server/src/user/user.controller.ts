import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Req,
  UseGuards
} from '@nestjs/common';
import { UserRole } from '@fullstack/typings';
import { FastifyRequest } from 'fastify';
import { UserRoleGuard } from './user-role.guard';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Access } from '../utils/access.guard';
import {
  MongooseCRUDController,
  PaginateResult,
  ObjectId,
  Condition
} from '../utils/MongooseCRUDController';

const roles = Object.values(UserRole)
  .filter((v): v is number => !isNaN(Number(v)))
  .map(role => ({ role }));

@Controller('user')
@Access('ADMIN', 'MANAGER', 'SELF')
export class UserController extends MongooseCRUDController<User> {
  constructor(private readonly userService: UserService) {
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
  @UseGuards(UserRoleGuard)
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Patch(':id')
  @Access('ADMIN', 'MANAGER', 'SELF')
  @UseGuards(UserRoleGuard)
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateUserDto
  ): Promise<User> {
    return this.userService.update({ _id: id }, changes);
  }
}
