import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ConversationController } from './controllers/conversation.controller';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [CoreModule],
  controllers: [ConversationController],
  providers: [ChatGateway],
})
export class PresentationModule {}
