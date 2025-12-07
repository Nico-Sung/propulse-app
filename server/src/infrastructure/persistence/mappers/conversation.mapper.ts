import {
  Participant,
  Conversation as PrismaConversation,
} from '@prisma/client';
import { Conversation } from '../../../core/entities/conversation.entity';

type PrismaConversationWithParticipants = PrismaConversation & {
  participants: Participant[];
};

export class ConversationMapper {
  static toDomain(raw: PrismaConversationWithParticipants): Conversation {
    const participantIds = raw.participants.map((p) => p.userId);

    return new Conversation(
      raw.id,
      participantIds,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
