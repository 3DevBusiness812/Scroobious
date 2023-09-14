import { faker } from '@faker-js/faker';
import {
  getRandomCompanyStages,
  getRandomFundingStatuses,
  getRandomIndustries,
  getRandomInvestorTypes,
  getRandomRevenues,
  getRandomState,
} from '.';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { OrganizationService } from '../../src/modules/identity/organization/organization.service';
import { UserService } from '../../src/modules/identity/user/user.service';
import { InvestorProfileService } from '../../src/modules/investor/investor-profile/investor-profile.service';
import { PitchCommentVisibility } from '../../src/modules/pitches/pitch-comment/pitch-comment.model';
import { PitchCommentService } from '../../src/modules/pitches/pitch-comment/pitch-comment.service';

interface createInvestorInput {
  pitchId?: string;
}

export const createInvestor = async function createInvestor({ pitchId }: createInvestorInput) {
  await getDBConnection();

  const userService = getContainer(UserService);
  const pitchCommentService = getContainer(PitchCommentService);
  const organizationService = getContainer(OrganizationService);
  const investorProfileService = getContainer(InvestorProfileService);

  const user = await userService.register({
    name: 'Investor User',
    profilePictureFileId:
      'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144',
    email: 'investor@scroobious.com',
    password: 'asdfasdf',
    confirmPassword: 'asdfasdf',
    type: 'INVESTOR',
  });

  const stateProvince = getRandomState();
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

  // TODO are we missing "criteria"?
  // TODO are we missing "thesis"?
  // TODO are we missing "demographics"?

  const investorProfile = await investorProfileService.create(
    {
      linkedinUrl: `https://www.linkedin.com/in/${faker.internet.userName()}`,
      stateProvince,
      accreditationStatuses: faker.random.arrayElements(
        ['INCOME', 'NET_ASSETS', 'LICENSED', 'FUND_EMP', 'SPOUSE', 'ADVISOR'],
        Math.ceil(Math.random() * 2)
      ),
      investorTypes: getRandomInvestorTypes(),
      industries: getRandomIndustries(),
      companyStages: getRandomCompanyStages(),
      fundingStatuses: getRandomFundingStatuses(),
      revenues: getRandomRevenues(),
    },
    user.id
  );

  if (pitchId) {
    await pitchCommentService.create(
      {
        body: 'You had a really strong end to your presentation.  What an exclamation point!',
        pitchId: pitchId,
        visibility: PitchCommentVisibility.VISIBLE,
      },
      user.id
    );
  }

  return user;
};
