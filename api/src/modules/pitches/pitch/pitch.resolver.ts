import DataLoader from 'dataloader';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import { Any } from 'typeorm';
import { BaseContext, PaginationArgs, UserId } from 'warthog';
import {
  PitchCreateInput,
  PitchOrderByEnum,
  PitchUpdateArgs,
  PitchWhereInput,
  PitchWhereUniqueInput,
} from '../../../../generated';
import { Permission } from '../../../core';
import { Course } from '../../courses/course/course.model';
import { CourseService } from '../../courses/course/course.service';
import { OrganizationSafe } from '../../identity/organization/organization.model';
import { UserSafe } from '../../identity/user/user.model';
import { PitchComment } from '../pitch-comment/pitch-comment.model';
import { PitchDeck, PitchDeckStatus } from '../pitch-deck/pitch-deck.model';
import { PitchUpdate } from '../pitch-update/pitch-update.model';
import { PitchVideo, PitchVideoStatus } from '../pitch-video/pitch-video.model';
import { Pitch } from './pitch.model';
import { PitchService } from './pitch.service';

@ObjectType()
export class WistiaStats {
  @Field({ nullable: false })
  load_count!: number;

  @Field({ nullable: false })
  play_count!: number;

  @Field({ nullable: false })
  play_rate!: number;

  @Field({ nullable: false })
  hours_watched!: number;

  @Field({ nullable: false })
  engagement!: number;

  @Field({ nullable: false })
  visitors!: number;
}

@ObjectType()
export class WistiaIframe {
  @Field({ nullable: false })
  url!: string;
}

// Note: this is how you do a query with complex filtering
@InputType()
export class PitchQueryInput extends PitchWhereInput {
  @Field({ nullable: true })
  watchStatus_eq?: string;

  @Field({ nullable: true })
  listStatus_eq?: string;

  @Field({ nullable: true })
  femaleLeader_eq?: string;

  @Field({ nullable: true })
  minorityLeader_eq?: string;

  @Field({ nullable: true })
  industry_eq?: string;

  @Field({ nullable: true })
  stateProvince_eq?: string;

  @Field({ nullable: true })
  fundingStatus_eq?: string;

  @Field({ nullable: true })
  companyStage_eq?: string;

  @Field({ nullable: true })
  revenue_eq?: string;
}

@ArgsType()
export class PitchQueryArgs extends PaginationArgs {
  @Field(() => PitchQueryInput, { nullable: true })
  where?: PitchQueryInput;

  @Field(() => PitchOrderByEnum, { nullable: true })
  orderBy?: PitchOrderByEnum;
}

@Resolver(Pitch)
export class PitchResolver {
  courseLoader: DataLoader<Pitch, Course>;

  constructor(
    @Inject('PitchService') public readonly service: PitchService,
    @Inject('CourseService') public readonly courseService: CourseService
  ) {
    this.courseLoader = new DataLoader(async (pitches) => {
      const courses = await courseService.find({
        pitchId_in: pitches.map((pitch) => pitch.id),
      });

      // console.log('courses :>> ', courses);

      return pitches.map((pitch) => {
        return courses.find((course) => {
          return course.pitchId === pitch.id;
        })!;
      });
    });
  }

  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => UserSafe)
  user(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<UserSafe> {
    return ctx.dataLoader.loaders.Pitch.user.load(pitch);
  }

  @FieldResolver(() => OrganizationSafe)
  organization(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<OrganizationSafe> {
    return ctx.dataLoader.loaders.Pitch.organization.load(pitch);
  }

  @FieldResolver(() => [PitchDeck])
  pitchDecks(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchDeck[]> {
    return ctx.dataLoader.loaders.Pitch.pitchDecks.load(pitch);
  }

  @FieldResolver(() => Course, { nullable: true })
  course(@Root() pitch: Pitch): Promise<Course> {
    return this.courseLoader.load(pitch);
  }

  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => UserSafe)
  updatedBy(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<UserSafe> {
    return ctx.dataLoader.loaders.Pitch.updatedBy.load(pitch);
  }

  @FieldResolver(() => PitchDeck, { nullable: true })
  activePitchDeck(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchDeck | undefined> {
    return ctx.dataLoader.loaders.Pitch.pitchDecks.load(pitch).then((pitchDecks: PitchDeck[]) => {
      // console.log('pitchDecks :>> ', pitchDecks);
      return (
        pitchDecks.sort((a: PitchDeck, b: PitchDeck) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }).find((deck) => {
          return deck.status === PitchDeckStatus.ACTIVE;
        }) || null
      );
    });
  }

  @FieldResolver(() => PitchDeck, { nullable: true })
  latestPitchDeck(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchDeck | undefined> {
    return ctx.dataLoader.loaders.Pitch.pitchDecks.load(pitch).then((pitchDecks: PitchDeck[]) => {
      if (!pitchDecks.length) {
        return null;
      }
      // console.log('pitchDecks :>> ', pitchDecks);
      return pitchDecks.sort((a: PitchDeck, b: PitchDeck) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })[0];
    });
  }

  @FieldResolver(() => PitchVideo, { nullable: true })
  activePitchVideo(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchVideo | undefined> {
    return ctx.dataLoader.loaders.Pitch.pitchVideos
      .load(pitch)
      .then((pitchVideos: PitchVideo[]) => {
        // console.log('pitchVideos :>> ', pitchVideos);
        return (
          pitchVideos.find((pitchVideo) => {
            return !pitchVideo.extendedVideo && pitchVideo.status === PitchVideoStatus.ACTIVE;
          }) || null
        );
      });
  }

  @FieldResolver(() => PitchVideo, { nullable: true })
  extendedPitchVideo(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchVideo | undefined> {
    return ctx.dataLoader.loaders.Pitch.pitchVideos
      .load(pitch)
      .then((pitchVideos: PitchVideo[]) => {
        // console.log('pitchVideos :>> ', pitchVideos);
        return (
          pitchVideos.find((pitchVideo) => {
            return pitchVideo.extendedVideo && pitchVideo.status === PitchVideoStatus.ACTIVE;
          }) || null
        );
      });
  }

  @FieldResolver(() => [PitchUpdate])
  updates(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchUpdate[]> {
    return ctx.dataLoader.loaders.Pitch.updates.load(pitch);
  }

  @FieldResolver(() => [PitchComment])
  comments(@Root() pitch: Pitch, @Ctx() ctx: BaseContext): Promise<PitchComment[]> {
    return ctx.dataLoader.loaders.Pitch.comments.load(pitch);
  }

  @Permission(['pitch:list', 'pitch:read', 'pitch:review'])
  @Query(() => [Pitch])
  async pitches(
    @Args() { where, orderBy, limit, offset }: PitchQueryArgs,
    // @Fields() fields: string[],
    @UserId() userId: string
  ): Promise<Pitch[]> {
    return this.service.query(where, userId, orderBy, limit, offset);
  }

  // This will allow both investors (pitch:list) and founders (pitch:read) to read
  @Permission(['pitch:list', 'pitch:read', 'pitch:review'])
  @Query(() => Pitch)
  async pitch(@Arg('where') where: PitchWhereUniqueInput, @UserId() userId: string): Promise<Pitch> {
    return this.service.findPitch(where, userId);
  }

  @Permission(['pitch:list', 'pitch:read'])
  @Query(() => WistiaStats)
  async pitchVideoStats(@UserId() userId: string): Promise<WistiaStats> {
    return this.service.pitchVideoStats(userId);
  }

  @Permission(['pitch:list', 'pitch:read', 'pitch:review'])
  @Query(() => [WistiaIframe])
  async pitchVideoIframes(@UserId() userId: string): Promise<WistiaIframe[]> {
    return this.service.pitchVideoIframes(userId);
  }

  @Permission('pitch:create')
  @Mutation(() => Pitch)
  async createPitch(@Arg('data') data: PitchCreateInput, @UserId() userId: string): Promise<Pitch> {
    return this.service.create(data, userId);
  }

  @Permission(['pitch:create', 'pitch:publish'])
  @Mutation(() => Pitch)
  async publishPitch(
    @Arg('where') where: PitchWhereUniqueInput,
    @UserId() userId: string
  ): Promise<Pitch> {
    return this.service.publish(where, userId);
  }

  @Permission(['pitch:create', 'pitch:publish'])
  @Mutation(() => Pitch)
  async unpublishPitch(
    @Arg('where') where: PitchWhereUniqueInput,
    @UserId() userId: string
  ): Promise<Pitch> {
    return this.service.unpublish(where, userId);
  }

  // Can just use pitch:create for now until we need more granular permissions
  @Permission('pitch:create')
  @Mutation(() => Pitch)
  async updatePitch(
    @Args() { data, where }: PitchUpdateArgs,
    @UserId() userId: string
  ): Promise<Pitch> {
    return this.service.update(data, where, userId);
  }
}
