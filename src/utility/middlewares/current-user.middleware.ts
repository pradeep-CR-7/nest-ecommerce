
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity; 
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {} // Inject any service if needed
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        req.currentUser = undefined;
        next()
        return;
    }else{
      try {
        const token = authHeader.split(' ')[1];
        const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
        if (!secret) {
            throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined in environment variables');
        }
        const { id } = <JwtPayload><unknown>verify(token, secret);
        const currentUser = await this.usersService.findOne(+id);
        req.currentUser = currentUser;
        next();
      } catch (error) {
        req.currentUser = undefined; 
        next();
      }
    }
  }
}

interface JwtPayload {
  id: string;
}