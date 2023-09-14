import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { CourseStepDefinitionService } from '../../src/modules/courses/course-step-definition/course-step-definition.service';

export class updatePipCompleteStep1649652925839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const courseStepDefinitionService = getContainer(CourseStepDefinitionService);

    const stepDefinition = await courseStepDefinitionService.findOne({
      section: 'Complete and List!',
      name: 'Congratulations',
    });

    await courseStepDefinitionService.update(
      {
        description: `Congratulations on finishing your pitch material! We are excited for you to confidently send and present your pitch to potential investors. [Here is a cold email template](https://docs.google.com/document/d/1VgEj7Ti0Ox4U-Guw-PKFw_PkOhn0NPYMgkqiOt2oORM/edit?usp=sharing) to help get you started.

We are currently testing an investor discovery platform to help get your pitch in front of relevant investors. These are mainly angel investors and VCs who actually write pre-seed and seed stage checks. If an investor wants to learn more after seeing your pitch, they can message you or they can send you pitch feedback.

Should you like your pitch material to be included for investor discovery, please do the following:

1. Upload your final pitch under Submit Pitch Deck in the Pitch Deck Creation module.
2. Upload your final pitch video under Upload Your Video in the Film Video module (optional but strongly recommended).
3. Click Complete below.

We will notify you if your pitch material is listed for investor discovery. Investors remain anonymous unless they send you a message or pitch feedback. On the Pitches screen, you will be able to enter updates that are visible to investors as well as modify details about you or your company. You can request we take your pitch material down at any time by emailing [help@scroobious.com](mailto:help@scroobious.com).`,
      },
      { id: stepDefinition.id },
      '1'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
