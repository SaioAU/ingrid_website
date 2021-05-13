import {MigrationInterface, QueryRunner} from "typeorm";

export class productTable1620897284470 implements MigrationInterface {
    name = 'productTable1620897284470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "description" character varying NOT NULL, "name" character varying NOT NULL, "colour" character varying NOT NULL, "price" integer NOT NULL, "material" character varying NOT NULL, "care" character varying NOT NULL, "size" integer, "season" character varying, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
