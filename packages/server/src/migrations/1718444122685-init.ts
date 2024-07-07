import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718444122685 implements MigrationInterface {
  name = 'Init1718444122685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "word" ADD "sourceId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "word" ADD CONSTRAINT "UQ_0be286decdd726ad5f5c033886b" UNIQUE ("sourceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "word" DROP CONSTRAINT "PK_ad026d65e30f80b7056ca31f666"`,
    );
    await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "word" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "word" ADD CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "word" DROP CONSTRAINT "PK_ad026d65e30f80b7056ca31f666"`,
    );
    await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "word" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "word" ADD CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "word" DROP CONSTRAINT "UQ_0be286decdd726ad5f5c033886b"`,
    );
    await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "sourceId"`);
  }
}
