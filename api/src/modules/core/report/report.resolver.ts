import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import { ReportService } from './report.service';

@ObjectType()
export class ReportResult {
  @Field(() => String, { nullable: false })
  result!: string;
}

@Resolver(ReportResult)
export class ReportResolver {
  constructor(@Inject('ReportService') public readonly service: ReportService) {}

  // TODO: @RequirePermission('pitch:admin')
  @Query(() => ReportResult)
  async generateReport(@Arg('type') type: string, @UserId() userId: string): Promise<ReportResult> {
    return this.service.runReport(type, userId);
  }
}
