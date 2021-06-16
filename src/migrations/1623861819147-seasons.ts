import {MigrationInterface, QueryRunner} from "typeorm";

export class seasons1623861819147 implements MigrationInterface {
    name = 'seasons1623861819147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "season" TO "seasonId"`);
        await queryRunner.query(`CREATE TABLE "season" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "seasonId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "seasonId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_809bcfef6f93b1dd288b1808bba" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_809bcfef6f93b1dd288b1808bba"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "seasonId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "seasonId" character varying`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "seasonId" TO "season"`);
    }

}
