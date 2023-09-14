import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageAnonymously1690196699426 implements MigrationInterface {
  name = 'MessageAnonymously1690196699426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversation_participant" ADD COLUMN "message_anonymously" BOOLEAN NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversation_participant" DROP COLUMN "message_anonymously"`);
  }
}
