import { faker } from '@faker-js/faker';
import { getRandomImage } from '.';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { UserService } from '../../src/modules/identity/user/user.service';
import { SuggestedResourceCategoryService } from '../../src/modules/suggested-resources/suggested-resource-category/suggested-resource-category.service';
import { SuggestedResourceService } from '../../src/modules/suggested-resources/suggested-resource/suggested-resource.service';

export const createResources = async function createResources() {
  await getDBConnection();

  const userService = getContainer(UserService);
  const suggestedResourceService = getContainer(SuggestedResourceService);
  const suggestedResourceCategoryService = getContainer(SuggestedResourceCategoryService);

  const categories = await suggestedResourceCategoryService.find();
  const categoryIds = categories.map((category) => category.id);

  for (let index = 0; index < 40; index++) {
    await suggestedResourceService.create(
      {
        companyName: faker.company.companyName(),
        suggestedResourceCategoryId: faker.random.arrayElement(categoryIds),
        url: faker.internet.url(),
        logoFileId: getRandomImage(),
      },
      userService.SYSTEM_USER_ID
    );
  }
};
