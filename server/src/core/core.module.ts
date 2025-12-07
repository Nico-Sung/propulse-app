import { Module } from '@nestjs/common';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import { CreateConversationUseCase } from './use-cases/conversation/create-conversation.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateConversationUseCase],
  exports: [CreateConversationUseCase],
})
export class CoreModule {}
