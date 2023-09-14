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
import { BaseContext, Fields, UserId } from 'warthog';
import {FileCreateInput, PitchDeckUpdateArgs, PitchDeckWhereArgs} from '../../../../generated'
import { File } from '../../core/file/file.model';
import { Pitch } from '../pitch/pitch.model';
import { PitchDeck } from './pitch-deck.model';
import { PitchDeckService } from './pitch-deck.service';

@InputType()
export class PitchDeckCreateExtendedInput {
  @Field()
  pitchId!: string;

  @Field()
  file!: FileCreateInput;

  @Field({ nullable: true })
  draft?: boolean;
}

@Resolver(PitchDeck)
export class PitchDeckResolver {
  constructor(@Inject('PitchDeckService') public readonly service: PitchDeckService) {}

  // TODO: Lock this down
  @FieldResolver(() => Pitch)
  pitch(@Root() pitchDeck: PitchDeck, @Ctx() ctx: BaseContext): Promise<Pitch> {
    return ctx.dataLoader.loaders.PitchDeck.pitch.load(pitchDeck);
  }

  // TODO: Lock this down
  @FieldResolver(() => File)
  file(@Root() pitchDeck: PitchDeck, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.PitchDeck.file.load(pitchDeck);
  }

  // TODO: How can I lock down list endpoints so that it's easy to apply My World filtering?
  @Query(() => [PitchDeck])
  async pitchDecks(
    @Args() { where, orderBy, limit, offset }: PitchDeckWhereArgs,
    @Fields() fields: string[]
  ): Promise<PitchDeck[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Mutation(() => PitchDeck)
  async createPitchDeck(
    @Arg('data') data: PitchDeckCreateExtendedInput,
    @UserId() userId: string
  ): Promise<PitchDeck> {
    return this.service.createExtended(data, userId);
  }

  @Mutation(() => PitchDeck)
  async updatePitchDeck(
      @Args() { data, where }: PitchDeckUpdateArgs,
      @UserId() userId: string
  ): Promise<PitchDeck> {
    return this.service.update(data, where, userId);
  }
}
