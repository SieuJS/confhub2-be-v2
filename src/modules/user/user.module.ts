import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { CommonModule } from '../common';
import { AdminController } from './controllers/admin.controller';

@Module({
    imports: [CommonModule],
    controllers : [AdminController],
    providers: [AdminService]
})
export class UserModule {}
