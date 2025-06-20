import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto {
    
    @IsNotEmpty({message: 'Phone number is required'})
    @IsString({message: 'Phone number must be a string'})
    phone: string;

    @IsOptional()
    @IsString({message: 'Name must be a string'})
    name: string;

    @IsNotEmpty({message: 'Address number is required'})
    @IsString({message: 'Address number must be a string'})
    address: string;

    @IsNotEmpty({message: 'City number is required'})
    @IsString({message: 'City number must be a string'})
    city: string;

    @IsNotEmpty({message: 'Postal Code number is required'})
    @IsString({message: 'Postal Code number must be a string'})
    postCode: string;

    @IsNotEmpty({message: 'State number is required'})
    @IsString({message: 'State number must be a string'})
    state: string;

    @IsNotEmpty({message: 'Country number is required'})
    @IsString({message: 'Country number must be a string'})
    country: string;
}