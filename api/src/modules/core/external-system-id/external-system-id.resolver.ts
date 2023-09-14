import { Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { ExternalSystemId } from './external-system-id.model';
import { ExternalSystemIdService } from './external-system-id.service';

@Resolver(ExternalSystemId)
export class ExternalSystemIdResolver {
  constructor(
    @Inject('ExternalSystemIdService') public readonly service: ExternalSystemIdService
  ) {}

  // @Mutation(() => ExternalSystemId)
  // async createExternalSystemId(
  //   @Arg('data') data: ExternalSystemIdCreateInput,
  //   @UserId() userId: string
  // ): Promise<ExternalSystemId> {
  //   return this.service.create(data, userId);
  // }
}
