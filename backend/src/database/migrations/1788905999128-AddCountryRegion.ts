import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryRegion1788905999128 implements MigrationInterface {
    name = 'AddCountryRegion1788905999128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer_country" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer_region" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_region"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_country"`);
    }

}
