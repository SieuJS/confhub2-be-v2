import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ConferenceImportGateway {
    @WebSocketServer()
    server: Server;

    // First channel for conference import status
    @SubscribeMessage('conference-import-status')
    handleImportStatus(@MessageBody() data: any): void {
        this.server.emit('conference-import-status', data);
    }

    // Second channel for conference import progress
    @SubscribeMessage('conference-import-progress')
    handleImportProgress(@MessageBody() data: any): void {
        this.server.emit('conference-import-progress', data);
    }

    // Handle client connection
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    // Handle client disconnection
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
}