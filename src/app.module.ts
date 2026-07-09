import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ResourceModule } from './resource/resource.module';
import { RoleModule } from './role/role.module';
import { ScopeModule } from './scope/scope.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({ secret: process.env.JWT_SECRET }),
    }),
    PrismaModule,
    ScopeModule,
    ResourceModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtGuard, RolesGuard],
})
export class AppModule {}
