import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { BaseContext } from 'warthog';
import { File } from '../../core/file/file.model';
import { User, UserSafe } from './user.model';

@Resolver(UserSafe)
export class UserSafeResolver {
  @FieldResolver(() => File)
  profilePictureFile(@Root() user: User, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.User.profilePictureFile.load(user);
  }
}
