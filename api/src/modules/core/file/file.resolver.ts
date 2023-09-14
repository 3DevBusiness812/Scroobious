import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { File } from './file.model';
import { FileService } from './file.service';

export interface FileCreateInput {
  url: string; // The path the file was uploaded to in S3
}

@InputType()
export class FileCreateSignedURLInput {
  @Field({ nullable: false })
  fileName!: string;
}

@ObjectType()
export class FileSignedURLResponse {
  @Field({ nullable: true })
  signedUrl!: string;
}

@Resolver(File)
export class FileResolver {
  constructor(@Inject('FileService') public readonly service: FileService) {}

  @Mutation(() => FileSignedURLResponse)
  async createUploadSignedUrl(
    @Arg('data') data: FileCreateSignedURLInput
  ): Promise<FileSignedURLResponse> {
    return this.service.createUploadSignedUrl(data);
  }
}
