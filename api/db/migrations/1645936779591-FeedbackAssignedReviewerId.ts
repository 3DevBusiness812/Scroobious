import {MigrationInterface, QueryRunner} from "typeorm";

export class FeedbackAssignedReviewerId1645936779591 implements MigrationInterface {
    name = 'FeedbackAssignedReviewerId1645936779591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" ADD "assigned_reviewer_id" character varying`);
        await queryRunner.query(`ALTER TABLE "pitch_written_feedback" ADD "assigned_reviewer_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "assigned_reviewer_id"`);
        await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "assigned_reviewer_id"`);
    }

}
