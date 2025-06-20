import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if(userExists) throw new BadRequestException("User with this email already exists")
    userSignUpDto.password = await hash(userSignUpDto.password,10);
    let user = this.usersRepository.create(userSignUpDto);
    user =  await this.usersRepository.save(user);
    delete (user as any).password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto):Promise<UserEntity>{
    const userExists = await this.usersRepository.createQueryBuilder('user').addSelect('user.password')
    .where('user.email = :email', { email: userSignInDto.email }).getOne();
    if(!userExists) throw new BadRequestException("User with this email does not exist");
    const matchPassword = await compare(userSignInDto.password, userExists.password);
    if(!matchPassword) throw new BadRequestException("Invalid password");
    delete (userExists as any).password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity):Promise<string> {
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE_TIME || '1h'; // Default to 1 hour if not set
    if (!secretKey) {
      throw new Error('ACCESS_TOKEN_SECRET_KEY environment variable is not set');
    }
    
    return sign({id:user.id, email:user.email},secretKey,{expiresIn} as any); ;
  }
}
