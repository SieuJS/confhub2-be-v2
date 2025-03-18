import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports : [UserModule, PassportModule] ,
    providers : [AuthService, LocalStrategy]
})
export class AuthModule {}
