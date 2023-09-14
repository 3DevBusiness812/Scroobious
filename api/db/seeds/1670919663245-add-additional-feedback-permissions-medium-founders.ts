import { MigrationInterface, QueryRunner } from "typeorm";
import { createRolePermission } from '../helpers/permissions';

export class addAdditionalFeedbackPermissionsMediumFounders1670919663245 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await createRolePermission('founder-medium', 'pitch_meeting_feedback:request');
        await createRolePermission('founder-medium', 'pitch_written_feedback:list');
        await createRolePermission('founder-medium', 'pitch_meeting_feedback:list');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
