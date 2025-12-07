// server/src/core/use-cases/conversation/create-conversation.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateConversationDto } from '../../dtos/create-conversation.dto';
import { Conversation } from '../../entities/conversation.entity';
import type { IConversationRepository } from '../../repositories/i-conversation.repository';

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async execute(dto: CreateConversationDto): Promise<Conversation> {
    if (dto.participantIds.length < 2) {
      throw new Error('Une conversation nécessite au moins 2 participants.');
    }

    const newConversation = new Conversation(
      uuidv4(),
      dto.participantIds,
      new Date(),
      new Date(),
    );

    await this.conversationRepository.save(newConversation);

    return newConversation;
  }
}
