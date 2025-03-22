import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class UserPublicDTO  extends PickType(UserDTO , [
    'id' ,
    'firstName' ,
    'lastName',
    'email',
    'createdAt',
    'updatedAt'
]){
    
}