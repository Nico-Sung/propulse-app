import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaConversationRepository } from './repositories/prisma-conversation.repository';
import { PrismaMessageRepository } from './repositories/prisma-message.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'IConversationRepository',
      useClass: PrismaConversationRepository,
    },
    {
      provide: 'IMessageRepository', // 👈 Ajout du provider
      useClass: PrismaMessageRepository,
    },
  ],
  exports: [PrismaService, 'IConversationRepository', 'IMessageRepository'],
})
export class PersistenceModule {}
