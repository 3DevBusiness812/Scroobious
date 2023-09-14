// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { IsUrl } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Index, ManyToOne } from 'typeorm';
import { BaseModel, IdField, IDType, Model, OneToMany, OneToOne, StringField } from 'warthog';
import { Course } from '../../courses/course/course.model';
import { Startup } from '../../founder/startup/startup.model';
import { User } from '../../identity/user/user.model';
import { Pitch } from '../../pitches/pitch/pitch.model';

@Model()
export class Organization extends BaseModel {
  @ManyToOne(() => User, (user: User) => user.organizations)
  user?: User;

  @Index()
  @IdField()
  userId!: IDType;

  @StringField()
  name!: string;

  @IsUrl()
  @StringField()
  website!: string;

  @OneToMany(() => Pitch, 'organization')
  pitches!: Pitch[];

  @OneToMany(() => Course, 'organization')
  courses!: Course[];

  @OneToOne(() => Startup, 'organization')
  startup!: Startup;
}

@ObjectType()
export class OrganizationSafe {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  website!: string;
}
