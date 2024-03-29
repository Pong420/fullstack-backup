import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Document,
  FilterQuery,
  PaginateModel,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { MongooseCRUDService } from '../utils/mongoose-crud.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshToken } from './schemas/refreshToken.schema';

@Injectable()
export class RefreshTokenService extends MongooseCRUDService<RefreshToken> {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: PaginateModel<RefreshToken & Document>,
    private readonly configService: ConfigService
  ) {
    super(refreshTokenModel);

    const index: keyof RefreshToken = 'updatedAt';
    const num = 1;
    async function init() {
      try {
        await refreshTokenModel.collection.dropIndex(`${index}_${num}`);
      } catch (error) {}

      await refreshTokenModel.collection.createIndex(
        { [index]: num },
        {
          expireAfterSeconds:
            configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES') * 60
        }
      );
    }

    init();
  }

  create(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshToken> {
    return super.create(createRefreshTokenDto);
  }

  update(
    query: FilterQuery<RefreshToken>,
    changes: Partial<RefreshToken>,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<RefreshToken> {
    return super.update(query, changes, options);
  }
}
