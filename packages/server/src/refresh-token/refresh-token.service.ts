import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  PaginateModel,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { MongooseCRUDService } from 'src/utils/MongooseCRUDService';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refersh-token.dto';
import { RefreshTokenModel, RefreshToken } from './schemas/refreshToken.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService extends MongooseCRUDService<
  RefreshTokenModel
> {
  constructor(
    @InjectModel(RefreshTokenModel.name)
    model: PaginateModel<RefreshTokenModel>,
    private readonly configService: ConfigService
  ) {
    super(model);

    const index: keyof RefreshToken = 'expires';
    const num = 1;
    async function init() {
      if (process.env.NODE_ENV !== 'development') {
        await model.deleteMany({});
      }
      try {
        await model.collection.dropIndex(`${index}_${num}`);
      } catch (error) {}
      await model.collection.createIndex(
        { [index]: num },
        {
          expireAfterSeconds:
            Number(configService.get('REFRESH_TOKEN_EXPIRES_IN_MINUTES')) * 60
        }
      );
    }

    init();
  }

  create(
    createRefreshTokenDto: CreateRefreshTokenDto
  ): Promise<RefreshTokenModel> {
    return super.create(createRefreshTokenDto);
  }

  update(
    query: FilterQuery<RefreshTokenModel>,
    changes: UpdateRefreshTokenDto,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<RefreshTokenModel> {
    return super.update(query, changes, options);
  }
}
