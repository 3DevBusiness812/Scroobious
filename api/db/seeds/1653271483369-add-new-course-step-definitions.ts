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

// Net new steps
const steps: Array<Partial<CourseStepDefinition>> = [
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Pitch time & goals',
    sequenceNum: 43,
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/vfc09zdzem',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Core vs. appendix',
    sequenceNum: 46,
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/hn983sma6y',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Title slide',
    sequenceNum: 115,
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/ms9b3jrmcz',
    },
  },
];

export class addNewCourseStepDefinitions1653271483369 implements MigrationInterface {
  name = 'addNewCourseStepDefinitions1653271483369';

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

    // Update steps
    await queryRunner.query(`
      UPDATE course_step_definition 
      SET name = 'Core 10 framework',
        config = '{"url": "https://scroobious.wistia.com/medias/irjgsi83q6"}'
      WHERE name = 'How to make your pitch' 
        AND type = 'VIDEO'  
        AND course_definition_id = '${pipDefinitionId}';`);

    await queryRunner.query(`
      UPDATE course_step_definition 
      SET name = 'Storytelling & de-risking', 
        config = '{"url": "https://scroobious.wistia.com/medias/oi0fa2n419"}'
      WHERE name = 'What you get at the end' 
        AND type = 'VIDEO'  
        AND course_definition_id = '${pipDefinitionId}';`);

    await queryRunner.query(`
      UPDATE course_step_definition 
      SET name = 'Header statements' 
      WHERE name = 'Headers' 
        AND type = 'VIDEO'  
        AND course_definition_id = '${pipDefinitionId}';`);

    await queryRunner.query(`
      UPDATE course_step_definition 
      SET name = 'Optional Content' 
      WHERE name = 'Omitted Sections' 
        AND type = 'VIDEO'  
        AND course_definition_id = '${pipDefinitionId}';`);

    await queryRunner.query(`
      UPDATE course_step_definition 
      SET name = 'Market size calculator' 
      WHERE name = 'Market Size' 
        AND type = 'DOWNLOAD'
        AND course_definition_id = '${pipDefinitionId}';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
