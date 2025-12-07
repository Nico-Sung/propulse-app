import { Message as PrismaMessage } from '@prisma/client';
import { Message } from '../../../core/entities/message.entity';

export class MessageMapper {
  static toDomain(raw: PrismaMessage): Message {
    return new Message(
      raw.id,
      raw.content,
      raw.senderId,
      raw.conversationId,
      raw.createdAt,
    );
  }
}
