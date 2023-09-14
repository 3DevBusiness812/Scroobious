// https://github.com/thoughtbot/fishery
import { Factory } from 'fishery';
import { StartupCreateInput } from '../../../../generated';
// TODO: The source of truth for these lists needs to be the API

export const StartupFactory = Factory.define<StartupCreateInput>(({}): StartupCreateInput => {
  // const key = new Date().getTime();

  return {
    name: 'Fake name',
    industries: ['SOFTWARE'],
    stateProvince: 'MA',
    fundraiseStatus: 'LT_250K',
    companyStage: 'PRE-SEED',
    revenue: 'PRE',
    shortDescription:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
  };
});
