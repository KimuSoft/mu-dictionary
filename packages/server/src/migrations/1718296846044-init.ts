import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718296846044 implements MigrationInterface {
  name = 'Init1718296846044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "word" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "simplifiedName" character varying NOT NULL, "origin" character varying NOT NULL, "pronunciation" character varying, "definition" character varying NOT NULL, "pos" integer NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "thumbnail" character varying, "url" character varying, "referenceId" character varying NOT NULL, CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "word"`);
  }
}
