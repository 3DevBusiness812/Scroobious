import {
  BooleanField,
  CreatedAtField,
  CreatedByField,
  IdModel,
  IDType,
  Model,
  OneToMany,
  PrimaryIdField,
  StringField,
  UpdatedAtField,
  UpdatedByField,
} from 'warthog';
import { LookupModel } from '../../../db/lookup-model';
import { SuggestedResource } from '../suggested-resource/suggested-resource.model';

@Model()
export class SuggestedResourceCategory extends IdModel implements LookupModel {
  // Overloading as we don't want this filter from IdModel
  @PrimaryIdField()
  declare id: IDType;

  @StringField()
  description!: string;

  @BooleanField({ filter: ['eq'] })
  archived!: boolean;

  @CreatedAtField()
  createdAt!: Date;

  @CreatedByField()
  createdById!: IDType;

  @UpdatedAtField()
  updatedAt!: Date;

  @UpdatedByField()
  updatedById!: IDType;

  // Associations
  @OneToMany(() => SuggestedResource, 'suggestedResourceCategory')
  suggestedResources!: SuggestedResource[];
}
