import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaConversationRepository } from './repositories/prisma-conversation.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'IConversationRepository',
      useClass: PrismaConversationRepository,
    },
  ],
  exports: [PrismaService, 'IConversationRepository'],
})
export class PersistenceModule {}
