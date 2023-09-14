import { JoinColumn } from 'typeorm';
import { BaseModel, IdField, IDType, Model, OneToOne, StringField } from 'warthog';
import { File } from '../../core/file/file.model';

@Model()
export class Video extends BaseModel {
  @OneToOne(() => File, 'pitchDeck')
  @JoinColumn()
  file!: File;

  @IdField()
  fileId!: IDType;

  @StringField({ computed: true })
  wistiaId!: string;

  // Autogenerates the wistiaUrl type that we will serve from a FieldResolver in the resolver file
  @StringField({ computed: true, apiOnly: true })
  wistiaUrl!: string;
}
