import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718442819833 implements MigrationInterface {
  name = 'Init1718442819833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "word" DROP CONSTRAINT "PK_ad026d65e30f80b7056ca31f666"`,
    );
    await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "word" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "word" ADD CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
