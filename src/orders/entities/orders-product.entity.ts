import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity({ name: 'orders_products' })
export class OrdersProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    product_unit_price: number;

    @Column()
    product_quantity: number;

    @ManyToOne(() => OrderEntity,(order) => order.products)
    @JoinColumn({ name: 'orderid' })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (prod) => prod.orderProducts,{cascade: true})
    @JoinColumn({ name: 'productId' })
    product: ProductEntity;
}