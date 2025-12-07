import { Module } from '@nestjs/common';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import { CreateConversationUseCase } from './use-cases/conversation/create-conversation.use-case';
import { SendMessageUseCase } from './use-cases/message/send-message.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateConversationUseCase, SendMessageUseCase],
  exports: [CreateConversationUseCase, SendMessageUseCase],
})
export class CoreModule {}
