import { JoinColumn } from 'typeorm';
import {
  BaseModel,
  IdField,
  IDType,
  ManyToOne,
  Model,
  OneToOne,
  StringField,
  UpdatedAtField,
} from 'warthog';
import { File } from '../../core/file/file.model';
import { PerkCategory } from '../perk-category/perk-category.model';

@Model()
export class Perk extends BaseModel {
  @StringField()
  companyName!: string;

  @StringField()
  companyBio!: string;

  @StringField()
  description!: string;

  @ManyToOne(() => PerkCategory, 'perks')
  perkCategory!: PerkCategory;

  @IdField({ filter: ['eq'] })
  perkCategoryId!: IDType;

  @StringField()
  url!: string;

  @OneToOne(() => File, 'perks')
  @JoinColumn()
  logoFile!: File;

  @IdField()
  logoFileId!: IDType;

  // Need to override defaults to get sorting, filtering, etc...
  @UpdatedAtField({ sort: true })
  declare updatedAt: Date;
}
