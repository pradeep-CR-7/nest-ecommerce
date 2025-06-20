import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    
    @IsNotEmpty({message: 'productId is required'})
    @IsNumber({}, {message: 'productId must be a number'})
    productId: number;

    @IsNotEmpty({message: 'ratings is required'})
    @IsNumber()
    rating: number;

    @IsNotEmpty({message: 'comment is required'})
    @IsString()
    comment: string;
}
