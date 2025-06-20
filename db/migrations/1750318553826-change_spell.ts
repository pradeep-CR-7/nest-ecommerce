import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSpell1750318553826 implements MigrationInterface {
    name = 'ChangeSpell1750318553826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" RENAME COLUMN "producr_unit_price" TO "product_unit_price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" RENAME COLUMN "product_unit_price" TO "producr_unit_price"`);
    }

}
