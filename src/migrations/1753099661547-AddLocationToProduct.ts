import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationToProduct1753099661547 implements MigrationInterface {
    name = 'AddLocationToProduct1753099661547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "test" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "test"`);
    }

}
