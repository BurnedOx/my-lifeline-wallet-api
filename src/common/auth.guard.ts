import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) {
            return false;
        }

        await this.validateToken(request.headers.authorization);

        return true;
    }

    async validateToken(auth: string) {
        const [bearer, token] = auth.split(' ');
        if (bearer !== 'Bearer') {
            throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
        }
        try {
            const decode = await jwt.verify(token, process.env.SECRET);
            return decode;
        } catch (err) {
            throw new HttpException(`Token Error: ${err.message ?? err.name}`, HttpStatus.FORBIDDEN);
        }
    }
}