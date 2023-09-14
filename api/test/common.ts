import { faker } from '@faker-js/faker';
import { Binding } from '../generated/binding';
import { callAPISuccess } from '../src/core';
import { FounderProfile } from '../src/modules/founder/founder-profile/founder-profile.model';
import { InvestorProfile } from '../src/modules/investor/investor-profile/investor-profile.model';
import { TestServerService } from './server';

export async function createFounderSetup(testServer: TestServerService) {
  const noAuthBinding = await testServer.getNoAuthBinding();

  // Create User
  const founderResult = await createUser(noAuthBinding, 'FOUNDER_FULL');
  const founderUser = founderResult.user;
  // console.log(`founder`, founder);

  // Create FounderProfile
  const founderBinding = await testServer.getBinding(founderResult.token);
  const founderProfile = await createFounderProfile(founderBinding);
  // console.log(`founderProfile`, founderProfile);

  // Create Startup
  const startup = await createStartup(founderBinding);
  // console.log(`startup`, startup);

  return {
    founderUser,
    founderProfile,
    startup,
    founderBinding,
  };
}

export async function createInvestorSetup(testServer: TestServerService) {
  const noAuthBinding = await testServer.getNoAuthBinding();

  const investorResult = await createUser(noAuthBinding, 'FOUNDER_FULL');
  const investor = investorResult.user as any;

  const investorBinding = await testServer.getBinding(investorResult.token);
  const investorProfile = await createInvestorProfile(investorBinding);
  // console.log(`investorProfile`, investorProfile);

  return {
    investor,
    investorProfile,
    investorBinding,
  };
}

export function getRandomEmail(firstName?: string, lastName?: string) {
  firstName = firstName ?? faker.name.firstName();
  lastName = lastName ?? faker.name.lastName();
  return faker.internet.email(firstName, lastName, `fake${new Date().getTime()}.com`);
}

export async function createUser(
  noAuthBinding: Binding,
  userType: string,
  password = 'fakepassword'
) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = getRandomEmail(firstName, lastName).toLowerCase();

  const regResult = await callAPISuccess(
    noAuthBinding.mutation.register(
      {
        data: {
          name: `${firstName} ${lastName}`,
          profilePictureFileId: faker.image.avatar(),
          email,
          password,
          confirmPassword: password,
          type: userType,
        },
      },
      '{ id email status capabilities stripeUserId }'
    )
  );
  // console.log('result', regResult);

  const loginResult = await noAuthBinding.mutation.login({
    data: {
      email,
      password,
    },
  });
  // console.log('loginResult :>> ', loginResult);

  return { token: loginResult.token, user: regResult };
}

export async function createFounderProfile(binding: Binding): Promise<FounderProfile> {
  return binding.mutation.createFounderProfile(
    {
      data: {
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
    },
    '{ id, userId, ownerId }'
  );
}

export async function createStartup(binding: Binding) {
  const companyName = faker.company.companyName();

  return binding.mutation.createStartup({
    data: {
      name: companyName,
      website: 'https://www.scroobious.com/',
      desiredSupport: "I'd like help fundraising",
      anythingElse: 'Nope, nothing else',
      corporateStructure: 'LLC',
      country: 'USA',
      stateProvince: 'MA',
      fundraiseStatus: 'LT_250K',
      companyStage: 'SEED',
      businessChallenge: 'Looking for a solid developer #1',
      revenue: 'POST',
      industries: ['SOCIAL'],
      additionalTeamMembers: false,
      originStory: "It's actually pretty funny...",
      shortDescription:
        'A virtual platform and community to quickly and meaningfully connect underrepresented founders, investors, and partners.',
    },
  });
}

export async function createInvestorProfile(binding: Binding): Promise<InvestorProfile> {
  return binding.mutation.createInvestorProfile(
    {
      data: {
        accreditationStatuses: ['NET_ASSETS'],
        investorTypes: ['CORP_VC'],
        linkedinUrl: 'https://www.linkedin.com/in/investor',
      },
    },
    '{ id, userId, ownerId }'
  );
}
