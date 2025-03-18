import { Injectable } from "@nestjs/common";
import { UserInput } from "../models/user.input";
import { PrismaService } from "../../common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(
        private prismaService : PrismaService
    ) {}

    async getAllUsers () {
        return await this.prismaService.users.findMany();
    }

    async getUserByEmail(email : string) {
        return await this.prismaService.users.findFirst({
            where : {
                email 
            }
        });
    }

    async createUser(input : UserInput) {
        return await this.prismaService.users.create({
            data : {
                email : input.email,
                firstName : input.firstname,
                lastName : input.lastname,
                password : input.password,
                role : "user",
                dob : new Date()
            }
        })
    }

    

    async generateToken(userId : string) {
        const env = process.env ; 
        const token = jwt.sign({
            userId,
            role : "user"
        }, env.JWT_SECRET, {
            expiresIn : '1h',
            issuer : env.JWT_ISSUER
        });
        return token;
    }

    
}