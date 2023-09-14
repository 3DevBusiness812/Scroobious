import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import {BaseContext, Fields, StandardDeleteResponse, UserId} from 'warthog'
import {
  PitchVideoWhereUniqueInput,
  PitchVideoUpdateArgs,
  PitchVideoWhereArgs,
  VideoCreateInput
} from '../../../../generated'
import { Video } from '../../core/video/video.model';
import { Pitch } from '../pitch/pitch.model';
import { PitchVideo } from './pitch-video.model';
import { PitchVideoService } from './pitch-video.service';

@InputType()
export class PitchVideoCreateExtendedInput {
  @Field()
  pitchId!: string;

  @Field()
  video!: VideoCreateInput;

  @Field({ nullable: true })
  extendedVideo?: boolean;
}

@Resolver(PitchVideo)
export class PitchVideoResolver {
  constructor(@Inject('PitchVideoService') public readonly service: PitchVideoService) {}

  // TODO: Lock this down
  @FieldResolver(() => Pitch)
  pitch(@Root() pitchVideo: PitchVideo, @Ctx() ctx: BaseContext): Promise<Pitch> {
    return ctx.dataLoader.loaders.PitchVideo.pitch.load(pitchVideo);
  }

  // TODO: Lock this down
  @FieldResolver(() => Video)
  video(@Root() pitchVideo: PitchVideo, @Ctx() ctx: BaseContext): Promise<Video> {
    return ctx.dataLoader.loaders.PitchVideo.video.load(pitchVideo);
  }

  // TODO: How can I lock down list endpoints so that it's easy to apply My World filtering?
  @Query(() => [PitchVideo])
  async pitchVideos(
    @Args() { where, orderBy, limit, offset }: PitchVideoWhereArgs,
    @Fields() fields: string[]
  ): Promise<PitchVideo[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Mutation(() => PitchVideo)
  async createPitchVideo(
    @Arg('data') data: PitchVideoCreateExtendedInput,
    @UserId() userId: string
  ): Promise<PitchVideo> {
    return this.service.createExtended(data, userId);
  }

  @Mutation(() => PitchVideo)
  async updatePitchVideo(
      @Args() { data, where }: PitchVideoUpdateArgs,
      @UserId() userId: string
  ): Promise<PitchVideo> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => PitchVideo)
  async deletePitchVideo(
      @Arg( 'where' ) where: PitchVideoWhereUniqueInput,
      @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
