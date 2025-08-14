import {
  Inject,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Token không hợp lệ');

    // ✅ Kiểm tra token blacklist
    const isBlacklisted = await this.cacheManager.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new ForbiddenException('Token đã bị vô hiệu hóa');
    }

    // ✅ Verify JWT và gán payload vào request.user
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // ✅ Lấy thông tin user từ DB và kiểm tra active
    // const userId = payload.id;
    // Lấy thông tin user từ payload JWT
const userId = payload.sub; // thay vì payload.id
    let dbUser;
    try {
      dbUser = await this.userService.findOnebyId(userId);
    } catch {
      throw new NotFoundException('User không tồn tại');
    }

    if (!dbUser.active) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }
    // ✅ Kiểm tra role trong token so với DB 
if (payload.role !== dbUser.role) {
  throw new ForbiddenException('Token hết hiệu lực do thay đổi quyền');
}

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
