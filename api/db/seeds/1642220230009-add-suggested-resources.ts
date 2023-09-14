import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';
import { createPermission, createRolePermission } from '../helpers/permissions';

const listName = 'suggested_resource_category';
const listItems = [
  { id: 'SLIDE', description: 'Slides' },
  { id: 'ICON', description: 'Icons' },
  { id: 'GRAPHIC', description: 'Graphics' },
  { id: 'INFOGRAPH', description: 'Infographics' },
  { id: 'MOCK', description: 'Mockups' },
  { id: 'FUNDRAISE', description: 'Fundraising' },
  { id: 'MISC', description: 'Miscellaneous' },
];

export class addSuggestedResources1642220230009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('suggested_resource:list', 'List suggested resources');
    await createPermission('suggested_resource:create', 'Create a suggested resource');
    await createPermission('suggested_resource:update', 'Update a suggested resource');

    await createRolePermission('admin', 'suggested_resource:list');
    await createRolePermission('founder', 'suggested_resource:list');

    await createRolePermission('admin', 'suggested_resource:create');
    await createRolePermission('admin', 'suggested_resource:update');

    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
