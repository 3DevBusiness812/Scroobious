import { faker } from '@faker-js/faker';

export function getRandomInvestorTypes() {
  return faker.random.arrayElements(
    [
      'ANGEL',
      'FAMILY',
      'CORP_VC',
      'VC',
      'PE',
      'ACC',
      'NONPROF',
      'HEDGE',
      'START_PGM',
      'UNI_PGM',
      'OTHER',
    ],
    Math.ceil(Math.random() * 2)
  );
}

export function getRandomImage() {
  return faker.random.arrayElement([
    'https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg', // Google
    'https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/dam/jcr:8a794ead-879b-460e-b6be-1189ee66ab66/atlassian_logo-1200x630.png', // Atlassian
    'https://mms.businesswire.com/media/20190321005447/en/711811/23/LogRocket_logo.jpg', // LogRocket
    'https://i.pcmag.com/imagery/reviews/07hoY8gVV4CSs91GktF17rP-14..v1593545931.png', // Datadog
    'https://mms.businesswire.com/media/20211207005395/en/933629/23/Heap_RGB_Logo_Horizontal_Lockup_Color_%283%29.jpg', // Heap
    'https://webapp.io/blog/content/images/2019/11/postgres.png', // Postgres
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png', // AWS
    'https://www.bloorresearch.com/wp-content/uploads/2013/03/MONGO-DB-logo-300x470--x.png', // MongoDB
    'https://pngimage.net/wp-content/uploads/2018/06/google-docs-logo-png-7.png', // Google Docs
  ]);
}

export function getRandomState() {
  return faker.random.arrayElement([
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'OTHER',
  ]);
}

export function getRandomIndustries() {
  return faker.random.arrayElements(
    [
      'AI',
      'BIOTECH',
      'BUS_SERVE',
      'COMMUNITY',
      'CONSUMER',
      'DATA',
      'ECOMM',
      'EDU',
      'FIN_SERVE',
      'FIN_TECH',
      'FOOD',
      'GAMES',
      'HARD',
      'HEALTH',
      'IT',
      'INT_SERVE',
      'ML',
      'MANUFAC',
      'MED_DEV',
      'MOBILE',
      'PETS',
      'SECURITY',
      'PROF_SERVE',
      'REAL_ESTATE',
      'RETAIL',
      'SAAS',
      'SALES',
      'SCIENCE',
      'SOCIAL',
      'SOFTWARE',
      'SPORTS',
      'SUSTAIN',
      'TECH',
      'TRANSPORT',
      'TRAVEL',
      'WELLNESS',
      'OTHER',
    ],
    Math.ceil(Math.random() * 2)
  );
}

const companyStages = ['IDEA', 'PRE-SE', 'SEED', 'EARLY', 'GROWTH', 'OTHER'];

export function getRandomCompanyStages() {
  return faker.random.arrayElements(companyStages, Math.ceil(Math.random() * 2));
}

export function getRandomCompanyStage() {
  return faker.random.arrayElement(companyStages);
}

const fundingStatuses = [
  'NOT_READY',
  'NEARLY_READY',
  'LT_250K',
  '250K_499K',
  '500K_999K',
  '1M_3M',
  'GT_3M',
  'OTHER',
];

export function getRandomFundingStatus() {
  return faker.random.arrayElement(fundingStatuses);
}

export function getRandomFundingStatuses() {
  return faker.random.arrayElements(fundingStatuses, Math.ceil(Math.random() * 2));
}

export function getRandomRevenues() {
  return faker.random.arrayElements(['PRE', 'POST'], Math.ceil(Math.random() * 2));
}

export function getRandomCorporateStructure() {
  return faker.random.arrayElement(['CC', 'LLC', 'BC', 'SC', 'NONE', 'OTHER']);
}
