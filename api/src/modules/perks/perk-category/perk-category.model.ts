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
import { Perk } from '../perk/perk.model';

@Model()
export class PerkCategory extends IdModel implements LookupModel {
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
  @OneToMany(() => Perk, 'perkCategory')
  perks!: Perk[];
}
