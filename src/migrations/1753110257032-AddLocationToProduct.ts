import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationToProduct1753110257032 implements MigrationInterface {
    name = 'AddLocationToProduct1753110257032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "location"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "location" character varying`);
    }

}
