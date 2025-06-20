import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Not, Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private readonly reviewRepository:Repository<ReviewEntity>,
  private readonly productsService: ProductsService
) {}
  async create(createReviewDto: CreateReviewDto, currentUser:UserEntity):Promise<ReviewEntity> {
    const product = await this.productsService.findOne(createReviewDto.productId);
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }
    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return this.reviewRepository.find()
  }

  async findAllByProduct(productId: number): Promise<ReviewEntity[]> {
    const product = await this.productsService.findOne(productId);
    return await this.reviewRepository.find({
      where: { product: { id: product.id }},
      relations: {
        user: true,
        product: {
          category: true,
        },
      }, 
    })
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    })
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return this.reviewRepository.remove(review);
  }

  async findOneByUserAndProduct(userId: number, productId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }
}
