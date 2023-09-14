import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import {
    CourseStepDefinition,
    CourseStepDefinitionType
} from '../../src/modules/courses/course-step-definition/course-step-definition.model'
import { CourseDefinitionService } from '../../src/modules/courses/course-definition/course-definition.service';
import {
    CourseStepDefinitionService
} from '../../src/modules/courses/course-step-definition/course-step-definition.service'
import {UserService} from '../../src/modules/identity/user/user.service'

const steps: Array<Partial<CourseStepDefinition>> = [
    // Film 1 Minute Video
    {
        section: 'Film 1 Minute Video',
        type: CourseStepDefinitionType.VIDEO,
        name: 'Filming Your 1 Minute Pitch',
        sequenceNum: 343,
        description: '',
        config: {
            url: 'https://scroobious.wistia.com/medias/1rpp1xzq6g',
        },
    },
];

export class removeUploadsPiPCourse1677641563274 implements MigrationInterface {
  name = 'removeUploadsPiPCourse1677641563274';

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

    // Delete Pitch and Film Video upload sections
    await queryRunner.query(`
      UPDATE course_step_definition
      SET deleted_at = NOW(),
          deleted_by_id = '${admin.id}',
          updated_at = NOW(),
          updated_by_id = '${admin.id}'
      WHERE type = ANY ('{${
        [
          CourseStepDefinitionType.UPLOAD_PITCH_DECK, 
          CourseStepDefinitionType.UPLOAD_SHORT_PITCH_VIDEO, 
          CourseStepDefinitionType.UPLOAD_EXTENDED_PITCH_VIDEO
        ]
      }}') 
        AND course_definition_id = '${pipDefinitionId}';`);

    // Change sequence number for How to Film 1 Minute Video
    await queryRunner.query(`
      UPDATE course_step_definition 
      SET sequence_num = 346,
          name = 'Technical Tips',
          version = 2,
          updated_at = NOW(),
          updated_by_id = '${admin.id}',
          description = 'Please record and save your video in MP4 format. If you have a preferred recording or editing tool, please feel free to use it and save or export the file as an MP4. Otherwise, you can use one of the following options:

**Using a Mac?**  
You can record your video using **QuickTime**, import it into **iMovie** and export as MP4

**Using Windows?**  
Simply open the **Camera** app, record your video and save as MP4

**Online Video Editing Options:**  
**Canva:** [https://www.canva.com/features/online-video-recorder/](https://www.canva.com/features/online-video-recorder/)  
**ClipChamp:** [https://clipchamp.com/en/](https://clipchamp.com/en/)  
**SoapBox:** [https://wistia.com/soapbox](https://wistia.com/soapbox)',
        config = '${JSON.stringify({title: "Technical Tips for Recording your 1 Minute Video"})}'
      WHERE section = 'Film 1 Minute Video'
        AND name = 'How to Film 1 Minute Video'
        AND course_definition_id = '${pipDefinitionId}';`);

    // Change sequence number for How to Film 1 Minute Video
    await queryRunner.query(`
      UPDATE course_step_definition 
      SET version = 3,
          updated_at = NOW(),
          updated_by_id = '${admin.id}',
          description = '**Next Steps**  
You are now ready to upload your pitch deck and video(s). To do so, simply follow the **Craft Pitch** link to:    
    1.  Upload your final pitch deck   
    2.  Upload your 1 minute video   
    3.  Upload your 5 minute video (optional)   

**Need feedback?**  
Once you have uploaded your deck under **Craft Pitch**, you will be presented with the option to request feedback on your draft. If you select this, after you receive the feedback and make any changes you like, you can upload a new version of your deck.

**Coming Soon!**  
We are currently testing an investor discovery platform to help get your pitch in front of relevant investors. These are mainly angel investors and VCs who actually write pre-seed and seed stage checks. If an investor wants to learn more after seeing your pitch, they can message you or they can send you pitch feedback. Should you like your pitch material to be included for investor discovery, you can publish your pitch once you feel ready to do so.',
        config = '${JSON.stringify({title: "Congratulations on completing PiP!"})}'
      WHERE section = 'Complete and List!'
        AND name = 'Congratulations'
        AND course_definition_id = '${pipDefinitionId}';`);

    // Create new steps
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      step.courseDefinitionId = pipDefinitionId;

      await courseStepDefinitionService.create(step, admin.id);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
