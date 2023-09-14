import { MigrationInterface, QueryRunner } from 'typeorm';
import { createFounder } from '../../seed/helpers';
import { isProduction } from '../helpers/environment';

export class addFounderUsers1647781184740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isProduction()) {
      try {
        await createFounder({
          email: 'founder-lite@scroobious.com',
          firstName: 'Founder',
          lastName: 'Lite',
          founderType: 'FOUNDER_LITE',
          stopBefore: 'pip',
        });
      } catch (error) {}

      try {
        await createFounder({
          email: 'founder-medium@scroobious.com',
          firstName: 'Founder',
          lastName: 'Medium',
          founderType: 'FOUNDER_MEDIUM',
          stopBefore: 'pip',
        });
      } catch (error) {}

      try {
        await createFounder({
          email: 'founder-full@scroobious.com',
          firstName: 'Founder',
          lastName: 'Full',
          founderType: 'FOUNDER_FULL',
          stopBefore: 'pip',
        });
      } catch (error) {}
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
