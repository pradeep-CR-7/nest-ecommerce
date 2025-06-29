import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    
    @IsNotEmpty({message: 'Title is required' })
    @IsString()
    title: string;

    @IsNotEmpty({message: 'Description is required' })
    @IsString()
    description: string;

    @IsNotEmpty({message: 'Price is required' })
    @IsNumber({maxDecimalPlaces:2}, {message: 'Price must be a number & upto 2 decimel places'})
    @IsPositive({message: 'Price must be a positive number'})
    price: number;

    @IsNotEmpty({message: 'Stock is required' })
    @IsNumber({}, {message: 'Stock must be a number'})
    @Min(0, {message: 'Stock must be a positive number'})
    stock: number;

    @IsNotEmpty({message: 'Image is required' })
    @IsArray({message: 'Image must be an array'})
    image: string[];

    @IsNotEmpty({message: 'Category is required' })
    @IsNumber({}, {message: 'Category ID must be a number'})
    categoryId: number;
}
