import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { PitchUpdate } from './pitch-update.model';

@Service('PitchUpdateService')
export class PitchUpdateService extends BaseService<PitchUpdate> {
  constructor(
    @InjectRepository(PitchUpdate) protected readonly repository: Repository<PitchUpdate>
  ) {
    super(PitchUpdate, repository);
  }
}
