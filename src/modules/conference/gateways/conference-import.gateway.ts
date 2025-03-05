import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConferenceImportDTO } from '../models/conference/conference-import.dto';
import { ConferenceImportQueueService } from '../services/conference-import-queue.service';
import { randomUUID } from 'crypto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ConferenceImportGateway {
    @WebSocketServer()
    server: Server;

    constructor(private conferenceImportQueueService : ConferenceImportQueueService) {}

    // First channel for conference import status
    @SubscribeMessage('conference-import')
    handleImportStatus(@MessageBody() data: ConferenceImportDTO): void {
        const id = randomUUID();
        data.id = id;
        this.conferenceImportQueueService.addConferenceToImportQueue(data);
        this.server.emit('conference-import', { status: 'PENDING', message: 'Conference import job has been added to the queue',  id });
    }

    @SubscribeMessage('conference-import-notify')
    handleImportNotify(@MessageBody() data: any): void {
        this.server.emit('conference-import-notify', data);
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