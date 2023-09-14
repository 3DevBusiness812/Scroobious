import {
  BooleanField,
  CreatedAtField,
  CreatedByField,
  IdModel,
  IDType,
  Model,
  PrimaryIdField,
  StringField,
  UpdatedAtField,
  UpdatedByField,
} from 'warthog';
import { LookupModel } from '../../db/lookup-model';

// TODO: Create a more thorough LookupModel that contains most of the fields below by default
@Model()
export class Criteria extends IdModel implements LookupModel {
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
}
