import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LocalAuthGuard } from "../guards/local.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('/auth') 
export class AuthController {
    constructor(
        private readonly authService : AuthService
    ){}

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req) {
        const user = req.user;
        return await this.authService.login(user);
    }

    @Post('/logout')
    async logout() {
        return {
            message : "Logout successful"
        }
    }
}