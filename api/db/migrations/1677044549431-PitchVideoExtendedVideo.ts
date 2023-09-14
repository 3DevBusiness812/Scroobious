import { MigrationInterface, QueryRunner } from 'typeorm';
import {CreateCities1669135161766} from './1669135161766-CreateCities'

export class PitchVideoExtendedVideo1677044549431 implements MigrationInterface {
  name = 'PitchVideoExtendedVideo1677044549431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_video" ADD "extended_video" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_video" DROP COLUMN "extended_video"`);
  }
}
