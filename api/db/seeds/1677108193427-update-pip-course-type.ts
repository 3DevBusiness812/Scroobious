import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { CourseDefinitionService } from '../../src/modules/courses/course-definition/course-definition.service';
import {
  CourseStepDefinition,
  CourseStepDefinitionType,
} from '../../src/modules/courses/course-step-definition/course-step-definition.model';
import { CourseStepDefinitionService } from '../../src/modules/courses/course-step-definition/course-step-definition.service';
import { UserService } from '../../src/modules/identity/user/user.service';

const steps: Array<Partial<CourseStepDefinition>> = [
  // Film 1 Minute Video
  {
    section: 'Film 1 Minute Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'How to Film 1 Minute Video',
    sequenceNum: 343,
    description:
        "A description of how to film 1 minute video.",
    config: {
    },
  },
  {
    section: 'Film 1 Minute Video',
    type: CourseStepDefinitionType.UPLOAD_SHORT_PITCH_VIDEO,
    name: 'Upload your video',
    sequenceNum: 346,
    eventType: 'pip-submit-final-video',
    description: 'Upload the video you just downloaded below',
    config: {},
  },
]

export class updatePipCourseType1677108193427 implements MigrationInterface {
  name = 'updatePipCourseType1677108193427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const courseDefinitionService = getContainer(CourseDefinitionService);
    const courseStepDefinitionService = getContainer(CourseStepDefinitionService);
    const userService = getContainer(UserService);

    const admin = await userService.findOne({ email: process.env.SCROOBIOUS_ADMIN_EMAIL });

    const pipDefinitions = await courseDefinitionService.find({
      name: 'Pitch it Plan',
    });
    const pipDefinitionId = pipDefinitions[0].id;

    // Create new steps
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      step.courseDefinitionId = pipDefinitionId;

      await courseStepDefinitionService.create(step, admin.id);
    }

    // Update Film Video section type
    await queryRunner.query(`
      UPDATE course_step_definition
      SET type = '${CourseStepDefinitionType.UPLOAD_EXTENDED_PITCH_VIDEO}'
      WHERE section = 'Film Video'
        AND type = '${CourseStepDefinitionType.UPLOAD_PITCH_VIDEO}'
        AND course_definition_id = '${pipDefinitionId}';`);

    // Update Film Video section name
    await queryRunner.query(`
      UPDATE course_step_definition 
      SET section = 'Film 5 Minute Video'
      WHERE section = 'Film Video' 
        AND course_definition_id = '${pipDefinitionId}';`);

    // Change existing videos to the extended type
    await queryRunner.query(`
      UPDATE pitch_video 
      SET extended_video = true;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
