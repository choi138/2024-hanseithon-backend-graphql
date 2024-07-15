import { Query, Resolver } from '@nestjs/graphql';
import { CreateBookDto } from './book.dto';

@Resolver('Book')
export class BookResolver {
  @Query((returns) => [CreateBookDto])
  getAllBooks() {
    return [
      {
        id: 1,
        title: 'Book 1',
        author: 'Author 1',
        price: 10,
      },
      {
        id: 2,
        title: 'Book 2',
        author: 'Author 2',
        price: 20,
      },
      {
        id: 3,
        title: 'Book 3',
        author: 'Author 3',
        price: 30,
      },
    ];
  }
}
