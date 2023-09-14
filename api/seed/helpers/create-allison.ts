import { faker } from '@faker-js/faker';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { FounderProfileService } from '../../src/modules/founder/founder-profile/founder-profile.service';
import { StartupService } from '../../src/modules/founder/startup/startup.service';
import { OrganizationService } from '../../src/modules/identity/organization/organization.service';
import { UserService } from '../../src/modules/identity/user/user.service';
import { PitchUpdateService } from '../../src/modules/pitches/pitch-update/pitch-update.service';
import { PitchService } from '../../src/modules/pitches/pitch/pitch.service';

export const createAllison = async function createAllison() {
  await getDBConnection();

  const userService = getContainer(UserService);
  const founderProfileService = getContainer(FounderProfileService);
  const organizationService = getContainer(OrganizationService);
  const pitchService = getContainer(PitchService);
  const pitchUpdateService = getContainer(PitchUpdateService);
  const startupService = getContainer(StartupService);

  let user;
  try {
    user = await userService.register({
      name: 'Allison Byers',
      profilePictureFileId:
        'https://pbs.twimg.com/profile_images/1421124036055244802/58IiFrIQ_400x400.jpg',
      email: 'allison@scroobious.com',
      password: 'asdfasdf',
      confirmPassword: 'asdfasdf',
      type: 'FOUNDER_FULL',
    });
  } catch (error) {
    // console.log(`User allison@scroobious.com already exists`);
    return;
  }

  const founderProfile = await founderProfileService.create(
    {
      userId: user.id,
      stateProvince: 'MA',
      twitterUrl: 'https://www.twitter.com/apbyers',
      linkedinUrl: 'https://www.linkedin.com/in/allison-byers',
      ethnicities: [],
      gender: 'WOMAN',
      sexualOrientation: 'HETERO',
      transgender: 'NO',
      disability: 'NONE',
      companyRoles: ['SOLO', 'CEO'],
      workingStatus: 'FT',
      source: 'Learned about you on Google',
    },
    user.id
  );
  // console.log('founderProfile :>> ', founderProfile);

  const founderOrganization = await organizationService.create(
    {
      userId: user.id,
      name: 'Scroobious',
      website: 'https://scroobious.com/',
    },
    user.id
  );

  const startup = await startupService.create(
    {
      userId: user.id,
      organizationId: founderOrganization.id,
      name: 'Scroobious',
      website: 'https://www.scroobious.com/',
      corporateStructure: 'LLC',
      desiredSupport: "I'd like help fundraising",
      stateProvince: 'MA',
      fundraiseStatus: 'LT_250K',
      companyStage: 'SEED',
      deckComfortLevel: 8,
      presentationComfortLevel: 9,
      businessChallenge: 'Looking for a solid developer #1',
      revenue: 'POST',
      presentationStatus: 'YP',
      anythingElse: 'Nope, nothing else',
      additionalTeamMembers: false,
      originStory: "It's actually pretty funny...",
      industries: ['SOCIAL'],
      shortDescription:
        'A virtual platform and community to quickly and meaningfully connect underrepresented founders, investors, and partners.',
    },
    user.id
  );

  // console.log('startup :>> ', startup);

  const pitch = await pitchService.create(
    {
      // organizationId: founderOrganization.id,
      presentationStatus: 'YP',
      deckComfortLevel: 10,
      presentationComfortLevel: 10,
      challenges: faker.lorem.sentence(),
    },
    user.id
  );

  // TODO: Add pitch video
  // TODO: Add pitch deck

  await pitchUpdateService.create(
    {
      body: 'Sent our Scroobious August update to ~800 newsletter subscribers!',
      pitchId: pitch.id,
    },
    user.id
  );

  return {
    pitch,
    user,
  };
};
