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

@Model()
export class Gender extends IdModel implements LookupModel {
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
