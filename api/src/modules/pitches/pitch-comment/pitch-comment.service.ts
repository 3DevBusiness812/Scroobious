import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { PitchComment } from './pitch-comment.model';

@Service('PitchCommentService')
export class PitchCommentService extends BaseService<PitchComment> {
  constructor(
    @InjectRepository(PitchComment) protected readonly repository: Repository<PitchComment>
  ) {
    super(PitchComment, repository);
  }
}
