import { Conversation } from '../entities/conversation.entity';

export interface IConversationRepository {
  /**
   * sauvegarde ou met à jour une conversation
   */
  save(conversation: Conversation): Promise<void>;

  /**
   * trouve une conversation par son ID
   */
  findById(id: string): Promise<Conversation | null>;

  /**
   * trouve toutes les conversations d'un utilisateur
   */
  findByUserId(userId: string): Promise<Conversation[]>;
}
