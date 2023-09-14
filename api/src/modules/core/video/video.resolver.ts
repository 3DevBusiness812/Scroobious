import { Ctx, Field, FieldResolver, InputType, Resolver, Root } from 'type-graphql';
import { BaseContext } from 'warthog';
import { FileCreateInput } from '../../../../generated';
import { File } from '../file/file.model';
import { Video } from './video.model';

@InputType()
export class VideoCreateExtendedInput {
  @Field()
  pitchId!: string;

  @Field()
  file!: FileCreateInput;
}

@Resolver(Video)
export class VideoResolver {
  @FieldResolver()
  wistiaUrl(@Root() video: Video): Promise<string | undefined> {
    if (!video.wistiaId) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(`https://scroobious.wistia.com/medias/${video.wistiaId}`);
  }

  // TODO: Lock this down
  @FieldResolver(() => File)
  file(@Root() video: Video, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.Video.file.load(video);
  }
}
