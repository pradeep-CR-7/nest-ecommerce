import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductEntity } from './entities/orders-product.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductEntity) private readonly opRepository: Repository<OrdersProductEntity>,
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(()=>ProductsService)) private readonly productService: ProductsService
  ) {}
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity | null> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const order = await this.orderRepository.save(orderEntity);

    const opEntities: OrdersProductEntity[] = [];

    for(let i=0; i<createOrderDto.orderedProducts.length; i++){
      // const orderId=order.id;
      const productId=createOrderDto.orderedProducts[i].id
      const product_quantity=createOrderDto.orderedProducts[i].product_quantity
      const product_unit_price=createOrderDto.orderedProducts[i].product_unit_price
    
            // Find the actual product entity
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) {
        throw new Error(`Product with id ${productId} not found`);
      }

      // Create the OrdersProductEntity with proper relationships
      const opEntity = new OrdersProductEntity();
      opEntity.order = order;
      opEntity.product = product;
      opEntity.product_quantity = product_quantity;
      opEntity.product_unit_price = product_unit_price;

      opEntities.push(opEntity);
    }

      // Save all OrdersProductEntity instances
    await this.opRepository.save(opEntities);

    return await this.findOne(order.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations:{
        shippingAddress: true,
        user: true,
        products: {product: true},
      }
    });
  }

  async findOne(id: number): Promise<OrderEntity | null> {
    return await this.orderRepository.findOne({
      where:{id},
      relations:{
        shippingAddress: true,
        user: true,
        products: {product: true},
      }
    });
  }

  async findOneByProductId(id:number){
    return await this.opRepository.findOne({
      relations:{product:true},
      where:{product:{id:id}}
    })
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser:UserEntity) {
    let order = await this.findOne(id)
    if(!order) throw new NotFoundException('Order Not Found')
    if((order.status === OrderStatus.DELIVERED) || (order.status === OrderStatus.CANCELLED)){
      throw new BadRequestException(`Order already ${order.status}`)
    }
    if((order.status === OrderStatus.PROCESSING)&&(updateOrderStatusDto.status != OrderStatus.SHIPPED)){
      throw new BadRequestException(`Delivery before shipped !!!`)
    }
    if((order.status === OrderStatus.SHIPPED)&&(updateOrderStatusDto.status === OrderStatus.SHIPPED)){
      return order
    }
    if(updateOrderStatusDto.status === OrderStatus.SHIPPED){
      order.shippedAt=new Date()
    }
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED){
      order.deliveredAt= new Date()
    }
    order.status = updateOrderStatusDto.status
    order.updatedBy=currentUser;
    order = await this.orderRepository.save(order)
    if(updateOrderStatusDto.status===OrderStatus.DELIVERED){
      await this.stockUpdate(order, OrderStatus.DELIVERED)
    }
    return order;
  }

  async cancelled(id:number, currentUser:UserEntity){
    let order = await this.findOne(id);
    if(!order) throw new NotFoundException('Order Not Found');
    if(order.status===OrderStatus.CANCELLED) return order

    order.status=OrderStatus.CANCELLED;
    order.updatedBy=currentUser;
    order=await this.orderRepository.save(order)

    await this.stockUpdate(order, OrderStatus.CANCELLED)
    return order
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order:OrderEntity, status:string){
    for(const op of order.products){
      await this.productService.updateStock(op.product.id, op.product_quantity, status)
    }
  }
}
