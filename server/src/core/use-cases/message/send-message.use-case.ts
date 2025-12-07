import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageDto } from '../../dtos/create-message.dto';
import { Message } from '../../entities/message.entity';
import type { IConversationRepository } from '../../repositories/i-conversation.repository';
import type { IMessageRepository } from '../../repositories/i-message.repository';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async execute(dto: CreateMessageDto): Promise<Message> {
    const conversation = await this.conversationRepository.findById(
      dto.conversationId,
    );
    if (!conversation) {
      throw new NotFoundException('Conversation introuvable.');
    }

    if (!conversation.hasParticipant(dto.senderId)) {
      throw new ForbiddenException(
        'Vous ne faites pas partie de cette conversation.',
      );
    }

    const newMessage = new Message(
      uuidv4(),
      dto.content,
      dto.senderId,
      dto.conversationId,
      new Date(),
    );

    await this.messageRepository.save(newMessage);

    conversation.updateLastActivity();
    await this.conversationRepository.save(conversation);

    return newMessage;
  }
}
