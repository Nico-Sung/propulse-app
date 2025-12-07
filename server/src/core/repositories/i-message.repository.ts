import { Message } from '../entities/message.entity';

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  findByConversationId(conversationId: string): Promise<Message[]>;
}
