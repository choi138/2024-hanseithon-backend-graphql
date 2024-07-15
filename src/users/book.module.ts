import { Module } from '@nestjs/common';
import { BooksService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
  providers: [BooksService, BookResolver],
})
export class BooksModule {}
