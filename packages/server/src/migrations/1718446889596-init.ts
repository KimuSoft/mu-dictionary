import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1718446889596 implements MigrationInterface {
    name = 'Init1718446889596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" ALTER COLUMN "sourceId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" ALTER COLUMN "sourceId" DROP NOT NULL`);
    }

}
