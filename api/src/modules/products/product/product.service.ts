import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { Product } from './product.model';

@Service('ProductService')
export class ProductService extends BaseService<Product> {
  constructor(@InjectRepository(Product) protected readonly repository: Repository<Product>) {
    super(Product, repository);
  }
}
