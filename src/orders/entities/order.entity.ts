import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductEntity } from "./orders-product.entity";

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    orderAt: Timestamp;

    @Column({type:"enum", enum: OrderStatus, default: OrderStatus.PROCESSING})
    status: string;

    @Column({nullable: true})
    shippedAt: Date;

    @Column({nullable: true})
    deliveredAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.ordersUpdateBy)
    updatedBy: UserEntity;

    @OneToOne(() => ShippingEntity, (ship)=> ship.order, { cascade: true })
    @JoinColumn()
    shippingAddress: ShippingEntity;

    @OneToMany(() => OrdersProductEntity, (op) => op.order,{cascade:true} )
    products: OrdersProductEntity[];

    @ManyToOne(() => UserEntity, (user) => user.orders)
    user: UserEntity;
}
