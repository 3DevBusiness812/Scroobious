import { IsUrl } from 'class-validator';
import { JoinColumn } from 'typeorm';
import { BaseModel, IdField, IDType, ManyToOne, Model, OneToOne, StringField } from 'warthog';
import { File } from '../../core/file/file.model';
import { SuggestedResourceCategory } from '../suggested-resource-category/suggested-resource-category.model';

@Model()
export class SuggestedResource extends BaseModel {
  @StringField()
  companyName!: string;

  @StringField({ nullable: true })
  description?: string;

  @ManyToOne(() => SuggestedResourceCategory, 'suggestedResourceCategories')
  suggestedResourceCategory!: SuggestedResourceCategory;

  @IdField({ filter: ['eq'] })
  suggestedResourceCategoryId!: IDType;

  @IsUrl()
  @StringField()
  url!: string;

  @OneToOne(() => File, 'suggestedResourceCategories')
  @JoinColumn()
  logoFile!: File;

  @IdField()
  logoFileId!: IDType;
}
