import { Module } from '@nestjs/common';
import { UploadModule } from '../upload';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [UploadModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule {}
