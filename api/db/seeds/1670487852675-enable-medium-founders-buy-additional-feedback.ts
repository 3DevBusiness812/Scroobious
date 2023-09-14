import { MigrationInterface, QueryRunner } from "typeorm";
import { createRolePermission } from '../helpers/permissions';

export class enableMediumFoundersBuyAdditionalFeedback1670487852675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await createRolePermission('founder-medium', 'pitch_written_feedback:request');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
