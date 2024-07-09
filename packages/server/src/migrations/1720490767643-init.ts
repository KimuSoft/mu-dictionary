import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1720490767643 implements MigrationInterface {
    name = 'Init1720490767643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "word" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "word" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "word" DROP COLUMN "metadata"`);
    }

}
