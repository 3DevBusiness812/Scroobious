import {
  BooleanField,
  FloatField,
  IntField,
  CreatedAtField,
  CreatedByField,
  IdModel,
  IDType,
  Model,
  PrimaryIdField,
  StringField,
  UpdatedAtField,
  UpdatedByField,
  ManyToOne,
} from 'warthog';
import { LookupModel } from '../../../db/lookup-model';
import { StateProvince } from '../state-province.model';

@Model()
export class City extends IdModel implements LookupModel {
  // Overloading as we don't want this filter from IdModel
  @PrimaryIdField()
  declare id: IDType;

  @FloatField({dataType: 'float8', nullable: true})
  lat?: number;

  @FloatField({dataType: 'float8', nullable: true})
  lon?: number;

  @IntField({ nullable: true })
  population?: number;

  @ManyToOne(() => StateProvince, 'cities')
  stateProvince!: StateProvince;

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
