import { ApiProperty } from "@nestjs/swagger";

export class UserInput {
    @ApiProperty({
        description : "The user's name",
        required : true
    })
    name : string; 

    @ApiProperty({
        description : "The user's email",
        required : true
    })
    email : string;

    @ApiProperty({
        description : "The user's password",
        required : true
    })
    password : string;
}

export class UserSigninInput {
    @ApiProperty({
        description : "The user's email",
        required : true
    })
    email : string;

    @ApiProperty({
        description : "The user's password",
        required : true
    })
    password : string;
}