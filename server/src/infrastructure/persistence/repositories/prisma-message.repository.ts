import { Injectable } from '@nestjs/common';
import { Message } from '../../../core/entities/message.entity';
import { IMessageRepository } from '../../../core/repositories/i-message.repository';
import { MessageMapper } from '../mappers/message.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaMessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaService) {}

  async save(message: Message): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
      },
    });
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const rawMessages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
    return rawMessages.map(MessageMapper.toDomain);
  }
}
