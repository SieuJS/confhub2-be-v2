import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { UserInput, UserSigninInput } from "../models/user.input";
import * as crypto from 'crypto';

@ApiTags('user')
@Controller('/user')
export class UserController {
    constructor(
        private userService : UserService
    ) {
        
    }

    @Post('/signin') 
    @ApiBody({
        type : UserSigninInput
    })
    async signin(@Body() input : UserSigninInput) {
        const user =  await this.userService.getUserByEmail(input.email);
        if(!user) {
            return {
                message : "User not found"
            }
        }
        // Compare the hashed password with the input password
        const hashedInputPassword = crypto.createHash('sha256').update(input.password).digest('hex');
        const isPasswordValid = hashedInputPassword === user.password;
        if (!isPasswordValid) {
            return {
                message: "Invalid credentils"
            };
        }

        // If password is valid, return user or token
        return {
            message: "Login successful",
            user
        };
    }

    @Post('/signup')
    @ApiBody({
        type : UserInput
    })
    async signup(@Body() input : UserInput) {
        const user =  await this.userService.getUserByEmail(input.email);
        if(user) {
            return {
                message : "User already exists"
            }
        }
        const hashedPassword = crypto.createHash('sha256').update(input.password).digest('hex');
        await this.userService.createUser({
            email : input.email,
            name : input.email,
            password : hashedPassword
        });
        return {
            message : "User created"
        }
    }
}