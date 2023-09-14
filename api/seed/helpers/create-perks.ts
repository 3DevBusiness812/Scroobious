import { faker } from '@faker-js/faker';
import { getRandomImage } from '.';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { UserService } from '../../src/modules/identity/user/user.service';
import { PerkCategoryService } from '../../src/modules/perks/perk-category/perk-category.service';
import { PerkService } from '../../src/modules/perks/perk/perk.service';

export const createPerks = async function createPerks() {
  await getDBConnection();

  const userService = getContainer(UserService);
  const perkService = getContainer(PerkService);
  const perkCategoryService = getContainer(PerkCategoryService);

  const categories = await perkCategoryService.find();
  const categoryIds = categories.map((category) => category.id);

  for (let index = 0; index < 40; index++) {
    await perkService.create(
      {
        companyName: faker.company.companyName(),
        companyBio: faker.lorem.paragraph(),
        description: faker.company.catchPhrase(),
        perkCategoryId: faker.random.arrayElement(categoryIds),
        url: faker.internet.url(),
        logoFileId: getRandomImage(),
      },
      userService.SYSTEM_USER_ID
    );
  }
};
