import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local.guard';

@Module({
    imports : [UserModule, PassportModule] ,
    providers : [AuthService, LocalStrategy, LocalAuthGuard]
})
export class AuthModule {}
