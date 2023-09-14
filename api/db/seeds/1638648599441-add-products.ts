import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { CourseDefinitionProductService } from '../../src/modules/courses/course-definition-product/course-definition-product.service';
import { CourseDefinitionService } from '../../src/modules/courses/course-definition/course-definition.service';
import { ProductService } from '../../src/modules/products/product/product.service';

export class addProducts1638648599441 implements MigrationInterface {
  name = 'addProducts1638648599441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const productService = getContainer(ProductService);
    const courseDefinitionService = getContainer(CourseDefinitionService);
    const courseDefProductService = getContainer(CourseDefinitionProductService);

    const writtenFeedbackProduct = await productService.create(
      {
        name: 'Written Pitch Feedback',
        description: 'Written Pitch Feedback',
      },
      '1',
      { manager: queryRunner.manager }
    );

    const oneOnOneFeedbackProduct = await productService.create(
      {
        name: '1:1 Pitch Review',
        description: '1:1 Pitch Review - 45 minute web conference',
      },
      '1',
      { manager: queryRunner.manager }
    );

    const pipDefinition = await courseDefinitionService.findSingle({ name: 'Pitch it Plan' });
    if (!pipDefinition) {
      throw "Couldn't find PiP";
    }

    await courseDefProductService.create(
      {
        name: '1:1 Pitch Review',
        description: '1:1 Pitch Review - 45 minute web conference',
        courseDefinitionId: pipDefinition.id,
        productId: oneOnOneFeedbackProduct.id,
      },
      '1',
      { manager: queryRunner.manager }
    );

    await courseDefProductService.create(
      {
        name: 'Written Feedback 1',
        description: 'Written feedback #1',
        courseDefinitionId: pipDefinition.id,
        productId: writtenFeedbackProduct.id,
      },
      '1',
      { manager: queryRunner.manager }
    );

    await courseDefProductService.create(
      {
        name: 'Written Feedback 2',
        description: 'Written feedback #2',
        courseDefinitionId: pipDefinition.id,
        productId: writtenFeedbackProduct.id,
      },
      '1',
      { manager: queryRunner.manager }
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
