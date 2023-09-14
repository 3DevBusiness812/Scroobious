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
  // Overview
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Hi from Allison',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/0nm779bye4',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Why you need a pitch deck',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/ngg81wojk1',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Why you need a pitch video',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/iy5x3dlo93',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'How to make your pitch',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/cou2etk0pe',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'What you get at the end',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/s1dl3ify3o',
    },
  },
  {
    section: 'Overview',
    type: CourseStepDefinitionType.VIDEO,
    name: 'How to handle feedback',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/8kssubfy1v',
    },
  },
  // Basics
  {
    section: 'Basics',
    type: CourseStepDefinitionType.DOWNLOAD,
    name: 'Download pitch deck template',
    description: '',
    config: {
      title: 'Download Pitch Deck Template',
      description:
        "This is a simple PowerPoint template with a slide master ready for you to make your own. If you have already been working on a pitch deck, that's great, and you probably don't need this. If you don't want to worry about learning how to format in PowerPoint, we recommend using software like Canva.com, Beautiful.ai, or Pitch.com so you can enter your content into their flexible pre-designed slides.",
      url: 'https://s3.amazonaws.com/appforest_uf/f1610742937333x361460803271971260/200804-plp-pitch-deck-template_cfdcd70f-1258-4e9e-a43c-41d4422a0d60.pptx',
      buttonText: 'Download Template',
    },
  },
  {
    section: 'Basics',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Slide master',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/60etp37t74',
    },
  },
  {
    section: 'Basics',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Slide design',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/ynzz8hwjw2',
    },
  },
  {
    section: 'Basics',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Headers',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/x4yidg1fr3',
    },
  },
  {
    section: 'Basics',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Sections & Citations',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/3w2v4aucuj',
    },
  },
  // Pitch Deck Creation
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Pitch deck summary',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/1m8i4oyzzr',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Mission',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/211qxsvg5u',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Problem',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/6hf6ea73s4',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Solution',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/er3nt5d6xl',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Business Model',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/om2ydawxb9',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Market Size',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/skq7xunscs',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.DOWNLOAD,
    name: 'Market Size',
    description:
      'Before you watch the following videos in this section, please download the market size calculator. Calculating a bottom-up market size is a daunting and challenging part of the pitch deck for founders. It is probably simpler than you think! This calculator explains market sizing in simple terms and gives you an easy process to follow to calculate your numbers. You will work in this calculator for the market size section of your pitch deck.',
    config: {
      buttonEventType: 'pip-download-market-size',
      url: 'https://s3.amazonaws.com/appforest_uf/f1610670436509x663571885080354400/201023%20Bottom%20Up%20Market%20Size%20Calculator.xlsx',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Competition',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/9dxyth6d2t',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Why Now?',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/sy3tz4ims4',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Go To Market',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/kcr2a39oum',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Team',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/2xlugw2u2x',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Thank You',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/wiyqi3f739',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Omitted Sections',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/bpftgxs3f0',
    },
  },
  {
    section: 'Pitch Deck Creation',
    type: CourseStepDefinitionType.UPLOAD_PITCH_DECK,
    name: 'Submit Pitch Deck', // currently: https://forms.gle/X4mjSd6PAtGq4BwS8
    description: '',
    config: {},
  },
  // Pitch Presentation
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Language',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/4tpfrpz1l8',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.FORM,
    name: 'Language',
    description: '',
    config: {
      title: 'Checklist: Language',
      description: 'Please make sure to check the following before moving on.',
      formFields: [
        {
          id: 'speakerNotesSoWhat',
          type: 'checkbox',
          title:
            'I have written my speaking notes so there is one “so what” point per slide that mirrors my header statement and that I describe using plain, natural language.',
        },
        {
          id: 'speakerNotesPracticed',
          type: 'checkbox',
          title:
            'I have practiced saying my speaking notes OUT LOUD to make sure I am comfortable saying what I wrote and that it takes 5 minutes or less.',
        },
      ],
      buttonText: 'Next Step',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Presence',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/kwouemnwx4',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Background',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/c7e70nf65a',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'What to Wear',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/ilhk2ckzn6',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Where to sit',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/lu5fokhjxc',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Lighting',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/ar46jp8r0o',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Sound',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/7sa5iald4z',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.VIDEO,
    name: 'Tech stuff',
    description: '',
    config: {
      url: 'https://scroobious.wistia.com/medias/5ijfeeo2ro',
    },
  },
  {
    section: 'Pitch Presentation',
    type: CourseStepDefinitionType.FORM,
    name: 'Final filming check',
    eventType: 'pip-final-filming-check',
    description: '',
    config: {
      title: 'Checklist: Final filming check',
      description: 'Please make sure to check the following before moving on.',
      formFields: [
        {
          id: 'filmingAreaCheck',
          type: 'checkbox',
          title:
            'I have a designated filming area with a plain or blurred background, good lighting, and a microphone that will capture clear sound.',
        },
      ],
      buttonText: 'Next Step',
    },
  },
  // Film Video
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Create free Soapbox account',
    description:
      'Click the button below to create a free Soapbox account and install the Chrome extension.',
    config: {
      buttonText: 'Create Account',
      buttonUrl: 'https://auth.wistia.com/registration/new?app=soapbox',
      imageUrl: '/soapbox.png',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Launch Soapbox & select presentation window',
    description:
      "You'll be asked to share your entire screen for the screen capture. I recommend putting your deck in presentation mode and then going to Chrome to click the Soapbox icon. You can then click on the Slide Show application window to record only that application as shown in the screenshot below.",
    config: {
      buttonText: 'How to use Soapbox',
      buttonUrl: 'https://wistia.com/support/soapbox/recording-your-soapbox',
      imageUrl: '/sharescreen.png',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Record your pitch!',
    description:
      "A three-second countdown will begin. Tip - move the Soapbox menu bar out of the presentation window. When the countdown switches to a flashing red light, it's showtime! To end recording, hit Stop Sharing at the bottom of the screen, or click the flashing red light in your Chrome toolbar.",
    config: {
      imageUrl: '/stopsharing.png',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.FORM,
    name: 'Record your pitch!',
    description: 'Please make sure to check the following before moving on.',
    config: {
      title: 'Checklist: Record your pitch!',
      description: 'Please make sure to check the following before moving on.',
      formFields: [
        {
          id: 'filmingAreaCheck',
          type: 'checkbox',
          title:
            'I have a designated filming area with a plain or blurred background, good lighting, and a microphone that will capture clear sound.',
        },
        {
          id: 'speakerNotesSoWhat',
          type: 'checkbox',
          title:
            'I have written my speaking notes so there is one “so what” point per slide that mirrors my header statement and that I describe using plain, natural language.',
        },
        {
          id: 'speakerNotesPracticed',
          type: 'checkbox',
          title:
            'I have practiced saying my speaking notes OUT LOUD to make sure I am comfortable saying what I wrote and that it takes 5 minutes or less.',
        },
      ],
      buttonText: 'Next Step',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Trim & split screen',
    description:
      "When you finish recording, you'll be brought to a Soapbox webpage to edit your video. Click in the bottom bar so that a gray box pops up. Next, select the 1st option of a person next to a rectangle and then click “Done”. Then, move the clippers to trim the start and finish appropriately.",
    config: {
      imageUrl: '/pitchdeck.png',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.FORM,
    name: 'Trim & split screen',
    description: '',
    config: {
      description: 'Please make sure to check the following before moving on.',
      formFields: [
        {
          id: 'trimmed',
          type: 'checkbox',
          title: 'I have trimmed the start and finish in Wistia Soapbox.',
        },
        {
          id: 'myselfAndSlides',
          type: 'checkbox',
          title:
            'I have set it to show myself and my slides for the whole video in Wistia Soapbox.',
        },
        {
          id: 'videoLengthCorrect',
          type: 'checkbox',
          title: 'My video is 5 minutes or less.',
        },
      ],
      buttonText: 'Next Step',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: "Tell us you're all done!",
    description: 'Click the button below so we can invite you to our Soapbox account.',
    config: {
      buttonEventType: 'pip-ready-to-submit',
      buttonText: "I'm ready to submit!",
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Accept Soapbox invite',
    description:
      'Check for an email from Soapbox with the subject "Allison has invited you to join their Soapbox team." Click the link and then "Accept Invite" on the landing page.',
    config: {
      buttonEventType: 'pip-didnt-receive-email',
      buttonText: "I didn't get an email",
      imageUrl:
        'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1612398943063x688039392075119400%2Fsoapbox%2520email2.jpg?w=256&h=282&auto=compress&fit=crop&dpr=1',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Download your video',
    description:
      'Log in to Soapbox and click "Share" at the top. Click "Download" on the right-hand side of the screen.',
    config: {
      description: '',
      buttonText: '',
      buttonUrl: '',
      imageUrl: '/downloadvideo.png',
    },
  },
  {
    section: 'Film Video',
    type: CourseStepDefinitionType.UPLOAD_PITCH_VIDEO,
    name: 'Upload your video',
    eventType: 'pip-submit-final-video',
    description: 'Upload the video you just downloaded below',
    config: {},
  },
  {
    section: 'Complete and List!',
    type: CourseStepDefinitionType.INSTRUCTIONS,
    name: 'Congratulations',
    description:
      'Please click on the “Complete” button below to let our team know you are happy with your pitch deck and/or pitch video. Once you click the Complete button, you can visit the “Pitches” screen where you will be able to do the following:\n\n1. Copy the link to your pitch video (if you made one) to share for more effective fundraising.\n2. Request to have your pitch published to investors on our platform\n3. Enter updates to show investors on our platform (if your pitch is published)\n4. Enter or update details about you and your company.',
    config: {
      nextStepButtonText: 'Complete',
    },
  },
];

export class addPipCourseType1635651008534 implements MigrationInterface {
  name = 'addPipCourseType1635651008534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const courseDefinitionService = getContainer(CourseDefinitionService);
    const courseStepDefinitionService = getContainer(CourseStepDefinitionService);
    const userService = getContainer(UserService);

    const admin = await userService.findOne({ email: process.env.SCROOBIOUS_ADMIN_EMAIL });

    const courseDefinition = await courseDefinitionService.create(
      {
        name: 'Pitch it Plan',
        description: "Don't let your pitch deck prevent you from getting a meeting.",
      },
      admin.id
    );

    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      step.courseDefinitionId = courseDefinition.id;
      step.sequenceNum = i * 10;

      await courseStepDefinitionService.create(step, admin.id);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
