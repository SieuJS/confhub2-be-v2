import { SocketGateway } from "../gateways/socket.gateway";

export class MessageService {
    constructor(
        private readonly socketGateway : SocketGateway
    ) { }

    async sendMessage(channel : string, message : any) {
        this.socketGateway.server.emit(channel, message);
    }
}