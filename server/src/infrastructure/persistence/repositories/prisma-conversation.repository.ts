import { Injectable } from '@nestjs/common';
import { Conversation } from '../../../core/entities/conversation.entity';
import { IConversationRepository } from '../../../core/repositories/i-conversation.repository';
import { ConversationMapper } from '../mappers/conversation.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaConversationRepository implements IConversationRepository {
  constructor(private prisma: PrismaService) {}

  async save(conversation: Conversation): Promise<void> {
    await this.prisma.conversation.upsert({
      where: { id: conversation.id },
      update: {
        updatedAt: conversation.lastMessageAt,
      },
      create: {
        id: conversation.id,
        createdAt: conversation.createdAt,
        updatedAt: conversation.lastMessageAt,
        participants: {
          create: conversation.participantIds.map((userId) => ({
            userId,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Conversation | null> {
    const raw = await this.prisma.conversation.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!raw) return null;

    return ConversationMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const rawConversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: { participants: true },
      orderBy: { updatedAt: 'desc' },
    });

    return rawConversations.map(ConversationMapper.toDomain);
  }
}
