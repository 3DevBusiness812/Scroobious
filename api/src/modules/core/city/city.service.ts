import { CityWhereUniqueInput } from 'generated';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { City } from './city.model';

@Service('CityService')
export class CityService {
  service: BaseService<City>;
  
  constructor(
    @InjectRepository(City) protected readonly repository: Repository<City>,
  ) {
    this.service = new BaseService(City, repository);
  }

  async query(
    where: any = {},
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<City[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  async findCity(where: any): Promise<City | null> {
    try {
      const city = await this.service.findOne<CityWhereUniqueInput>(where);
      return city;
    } catch (error) {
      return null;
    }
  }
}
