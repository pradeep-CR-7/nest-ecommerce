import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrdersProductEntity } from "src/orders/entities/orders-product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({name: 'products'})
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: 'decimal', precision: 10, scale: 2,default: 0})
    price: number;

    @Column()
    stock: number;

    @Column('simple-array')
    image: string[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    @ManyToOne(() => CategoryEntity, (cat) => cat.products)
    category: CategoryEntity;

    @OneToMany(() => ReviewEntity, (rev) => rev.product)
    reviews: ReviewEntity[];

    @OneToMany(() => OrdersProductEntity, (op) => op.product)
    orderProducts: OrdersProductEntity[];
}
