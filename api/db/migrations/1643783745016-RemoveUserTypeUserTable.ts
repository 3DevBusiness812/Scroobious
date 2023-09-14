import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserTypeUserTable1643783745016 implements MigrationInterface {
  name = 'RemoveUserTypeUserTable1643783745016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_type_user`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
