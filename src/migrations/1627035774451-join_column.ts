import {MigrationInterface, QueryRunner} from "typeorm";

export class joinColumn1627035774451 implements MigrationInterface {
    name = 'joinColumn1627035774451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "size" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "size" integer`);
    }

}
