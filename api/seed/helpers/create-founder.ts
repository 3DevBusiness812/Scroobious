import { faker } from '@faker-js/faker';
import {
  createPitchDeckFile,
  createVideoForPitch,
  getRandomCompanyStage,
  getRandomCorporateStructure,
  getRandomFundingStatus,
  getRandomIndustries,
  getRandomState,
} from '.';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { FileService } from '../../src/modules/core/file/file.service';
import { CourseDefinitionService } from '../../src/modules/courses/course-definition/course-definition.service';
import { CourseProductService } from '../../src/modules/courses/course-product/course-product.service';
import { CourseService } from '../../src/modules/courses/course/course.service';
import { FounderProfileService } from '../../src/modules/founder/founder-profile/founder-profile.service';
import { StartupService } from '../../src/modules/founder/startup/startup.service';
import { OrganizationService } from '../../src/modules/identity/organization/organization.service';
import { UserService } from '../../src/modules/identity/user/user.service';
import { PitchMeetingFeedbackService } from '../../src/modules/pitches/pitch-meeting-feedback/pitch-meeting-feedback.service';
import { PitchVideoService } from '../../src/modules/pitches/pitch-video/pitch-video.service';
import { PitchWrittenFeedbackService } from '../../src/modules/pitches/pitch-written-feedback/pitch-written-feedback.service';
import { PitchService } from '../../src/modules/pitches/pitch/pitch.service';
import { ProductService } from '../../src/modules/products/product/product.service';

interface UserOrgInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  founderType: 'FOUNDER_LITE' | 'FOUNDER_MEDIUM' | 'FOUNDER_FULL';
  stopBefore?: 'feedback' | 'pip';
}

export const createFounder = async function createFounder(
  options: UserOrgInput = { founderType: 'FOUNDER_FULL' }
) {
  await getDBConnection();

  const userService = getContainer(UserService);
  const organizationService = getContainer(OrganizationService);
  const founderProfileService = getContainer(FounderProfileService);
  const startupService = getContainer(StartupService);
  const courseService = getContainer(CourseService);
  const courseDefinitionService = getContainer(CourseDefinitionService);
  // const courseProductService = getContainer(CourseProductService);
  const productService = getContainer(ProductService);
  const courseProductService = getContainer(CourseProductService);
  const pitchService = getContainer(PitchService);
  const pitchWrittenFeedbackService = getContainer(PitchWrittenFeedbackService);
  const pitchMeetingFeedbackService = getContainer(PitchMeetingFeedbackService);
  const fileService = getContainer(FileService);
  // const pitchDeckService = getContainer(PitchDeckService);
  const pitchVideoService = getContainer(PitchVideoService);

  const firstName = options.firstName ?? faker.name.firstName();
  const lastName = options.lastName ?? faker.name.lastName();
  const email = options.email ?? `fake-${faker.internet.email(firstName, lastName)}`;

  let user;
  // try {
  user = await userService.register({
    name: `${firstName} ${lastName}`,
    profilePictureFileId: faker.image.avatar(),
    email,
    password: 'asdfasdf',
    confirmPassword: 'asdfasdf',
    type: options.founderType,
  });
  // } catch (error) {
  //   console.error(error);
  //   // console.log(`User ${email} already exists`);
  //   return;
  // }

  const companyName = faker.company.companyName();
  const organization = await organizationService.create(
    {
      userId: user.id,
      name: faker.company.companyName(),
      website: `https://${companyName
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9]/gi, '')}.com/`,
    },
    user.id
  );
  const stateProvince = getRandomState();
  const founderProfile = await founderProfileService.create(
    {
      userId: user.id,
      stateProvince: stateProvince,
      twitterUrl: `https://www.twitter.com/${faker.internet.userName(firstName, lastName)}`,
      linkedinUrl: `https://www.linkedin.com/in/${faker.internet.userName(firstName, lastName)}`,
      ethnicities: [],
      gender: faker.random.arrayElement(['MAN', 'WOMAN', 'NON_B', 'NOC', 'OTHER']),
      sexualOrientation: faker.random.arrayElement(['BI', 'GAY', 'HETERO', 'NOC', 'OTHER']),
      transgender: faker.random.arrayElement(['NO', 'YES', 'NOC']),
      disability: faker.random.arrayElement(['VISIBLE', 'INVISIBLE', 'BOTH', 'NONE', 'NOC']),
      companyRoles: faker.random.arrayElements(
        ['SOLO', 'COF', 'CEO', 'OTHER'],
        Math.ceil(Math.random() * 2)
      ),
      workingStatus: faker.random.arrayElement(['FT', 'PT', 'ELSE', 'COMP', 'OTHER']),
      source: 'Learned about you on Google',
    },
    user.id
  );

  const startup = await startupService.create(
    {
      userId: user.id,
      organizationId: organization.id,
      name: companyName,
      website: 'https://www.scroobious.com/',
      corporateStructure: getRandomCorporateStructure(),
      additionalTeamMembers: false,
      businessChallenge: 'Looking for a solid developer #1',
      desiredSupport: "I'd like help fundraising",
      anythingElse: 'Nope, nothing else',
      originStory: "It's actually pretty funny...",
      deckComfortLevel: 6,
      presentationComfortLevel: 5,
      presentationStatus: 'YR',
      stateProvince,
      shortDescription: faker.lorem.sentence(),
      fundraiseStatus: getRandomFundingStatus(),
      companyStage: getRandomCompanyStage(),
      revenue: faker.random.arrayElement(['PRE', 'POST']),
      industries: getRandomIndustries(),
    },
    user.id
  );

  if (options.stopBefore === 'pip') {
    return { user, organization, founderProfile, startup };
  }

  // Create PiP
  const courseDefinitions = await courseDefinitionService.find({ name: 'Pitch it Plan' });
  // console.log('courseDefinitions :>> ', courseDefinitions);
  const courseDefinition = courseDefinitions[0];

  const course = await courseService.create({ courseDefinitionId: courseDefinition.id }, user.id);
  // console.log('course :>> ', course);
  const pitchId = course.pitchId;
  // console.log('pitchId :>> ', pitchId);

  if (options.stopBefore === 'feedback') {
    return { user, organization, founderProfile, startup };
  }

  // Get the courseProducts for this course
  const products = await productService.find();
  const writtenReviewProduct = products.find((p) => {
    return p.name === 'Written Pitch Feedback';
  });
  if (!writtenReviewProduct) {
    throw new Error('Unable to find written pitch feedback product');
  }
  const writtenReviewCourseProducts = await courseProductService.find({
    productId_eq: writtenReviewProduct.id,
    courseId_eq: course.id,
  });

  const writtenCourseProduct1 = writtenReviewCourseProducts[0];
  const writtenCourseProduct2 = writtenReviewCourseProducts[1];

  if (Math.random() > 0.5) {
    await pitchService.publish({ id: pitchId }, user.id);
  }

  const examplePitchDeckFile = await createPitchDeckFile();

  // Founder requests feedback
  const writtenFeedback = await pitchWrittenFeedbackService.request(
    {
      pitchId: pitchId,
      courseProductId: writtenCourseProduct1.id,
      pitchDeck: {
        pitchId: pitchId,
        file: {
          url: examplePitchDeckFile.url,
        },
      },
    },
    user.id
  );
  // console.log('writtenFeedback :>> ', writtenFeedback);

  // Some small number of pitches should stop with this amount of feedback
  if (Math.random() < 0.1) {
    return { user, organization, founderProfile, startup };
  }

  // reviewer completes feedback
  const writtenFeedbackCompleted = await pitchWrittenFeedbackService.complete(
    {
      pitchDeck: {
        pitchId: pitchId,
        file: {
          url: examplePitchDeckFile.url,
        },
      },
      reviewerNotes: 'All set, here are some notes on your pitch.',
    },
    { id: writtenFeedback.id },
    user.id
  );
  // console.log('writtenFeedbackCompleted :>> ', writtenFeedbackCompleted);

  // Some pitches should have a 2nd round of feedback
  if (Math.random() > 0.5) {
    // Founder requests feedback again
    const writtenFeedback2 = await pitchWrittenFeedbackService.request(
      {
        pitchId: pitchId,
        courseProductId: writtenCourseProduct2.id,
        pitchDeck: {
          pitchId: pitchId,
          file: {
            url: examplePitchDeckFile.url,
          },
        },
      },
      user.id
    );
    // console.log('writtenFeedback2 :>> ', writtenFeedback2);

    // A subset of the 2nd feedback should be completed
    if (Math.random() > 0.5) {
      // reviewer completes feedback
      const writtenFeedbackCompleted2 = await pitchWrittenFeedbackService.complete(
        {
          pitchDeck: {
            pitchId: pitchId,
            file: {
              url: examplePitchDeckFile.url,
            },
          },
          reviewerNotes: 'All set, here are some notes on your 2nd submission.',
        },
        { id: writtenFeedback2.id },
        user.id
      );
      // console.log('writtenFeedbackCompleted2 :>> ', writtenFeedbackCompleted2);
    }
  }

  // Founder requests meeting (zoom) feedback
  const meetingReviewProduct = products.find((p) => {
    return p.name === '1:1 Pitch Review';
  });
  if (!meetingReviewProduct) {
    throw new Error('Unable to find meeting pitch feedback product');
  }

  const meetingReviewCourseProducts = await courseProductService.find({
    productId_eq: meetingReviewProduct.id,
    courseId_eq: course.id,
  });

  const meetingCourseProduct1 = meetingReviewCourseProducts[0];

  const meetingFeedback = await pitchMeetingFeedbackService.request(
    {
      pitchId: pitchId,
      courseProductId: meetingCourseProduct1.id,
      ownerId: meetingCourseProduct1.ownerId,
    },
    user.id
  );

  // console.log('meetingFeedback :>> ', meetingFeedback);

  const exampleVideo = await createVideoForPitch();
  const exampleVideoFile = await fileService.findOne({ id: exampleVideo.fileId });

  // Reviewer completes meeting feedback
  const meetingFeedbackComplete = await pitchMeetingFeedbackService.complete(
    {
      file: {
        url: exampleVideoFile.url,
      },
      reviewerNotes: 'All set, here are some notes on your pitch.',
    },
    { id: meetingFeedback.id },
    user.id
  );
  // console.log('meetingFeedbackComplete :>> ', meetingFeedbackComplete);

  // User-uploaded pitch video
  const pitchVideo = await pitchVideoService.createExtended(
    {
      pitchId,
      video: {
        fileId: exampleVideoFile.id,
      },
    },
    user.id
  );
  // console.log('pitchVideo :>> ', pitchVideo);
  

  return { user, organization, founderProfile, startup };
};
