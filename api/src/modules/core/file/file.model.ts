import { BaseModel, Model, StringField } from 'warthog';

@Model()
export class File extends BaseModel {
  @StringField()
  url!: string;
}
