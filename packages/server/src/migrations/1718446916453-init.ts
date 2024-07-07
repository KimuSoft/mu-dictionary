import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718446916453 implements MigrationInterface {
  name = 'Init1718446916453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "word" ALTER COLUMN "sourceId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "word" ALTER COLUMN "sourceId" DROP NOT NULL`,
    );
  }
}
