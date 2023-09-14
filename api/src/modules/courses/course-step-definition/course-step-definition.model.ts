import {
  BaseModel,
  EnumField,
  IdField,
  IDType,
  IntField,
  JSONField,
  JsonObject,
  ManyToOne,
  Model,
  StringField,
} from 'warthog';
import { CourseDefinition } from '../course-definition/course-definition.model';

export enum CourseStepDefinitionType {
  VIDEO = 'VIDEO',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD_PITCH_VIDEO = 'UPLOAD_PITCH_VIDEO', // @Deprecated
  UPLOAD_SHORT_PITCH_VIDEO = 'UPLOAD_SHORT_PITCH_VIDEO',
  UPLOAD_EXTENDED_PITCH_VIDEO = 'UPLOAD_EXTENDED_PITCH_VIDEO',
  UPLOAD_PITCH_DECK = 'UPLOAD_PITCH_DECK',
  FORM = 'FORM',
  MARKDOWN = 'MARKDOWN',
  // COMPLETION = 'COMPLETION',
  INSTRUCTIONS = 'INSTRUCTIONS',
}

@Model()
export class CourseStepDefinition extends BaseModel {
  @StringField()
  name!: string;

  @StringField()
  section!: string;

  @IntField({ sort: true, filter: ['gt'] })
  sequenceNum!: number;

  @StringField()
  description!: string;

  @StringField({ nullable: true })
  eventType?: string;

  @EnumField('CourseStepDefinitionType', CourseStepDefinitionType)
  type!: CourseStepDefinitionType;

  @JSONField()
  config!: JsonObject;

  @ManyToOne(
    () => CourseDefinition,
    (courseDefinition: CourseDefinition) => courseDefinition.courseStepDefinitions,
    {
      nullable: false,
    }
  )
  courseDefinition?: CourseDefinition;

  @IdField()
  courseDefinitionId!: IDType;
}
