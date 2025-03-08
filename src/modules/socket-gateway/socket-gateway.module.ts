import { Module } from '@nestjs/common';
import { SocketGateway } from './gateways/socket.gateway';
import { BullModule } from '@nestjs/bullmq';
import { CONFERENCE_QUEUE_NAME } from '../../constants/queue-name';

@Module({
    imports : [
        BullModule.registerQueue({
            name : CONFERENCE_QUEUE_NAME.NOTIFY
        }),
    ],
    providers: [SocketGateway],
})
export class SocketGatewayModule {}
