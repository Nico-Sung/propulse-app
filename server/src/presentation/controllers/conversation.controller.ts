import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateConversationUseCase } from '../../core/use-cases/conversation/create-conversation.use-case';
// TODO: Remplacer par le vrai AuthGuard plus tard
import type { CreateConversationDto } from 'src/core/dtos/create-conversation.dto';
import { MockAuthGuard } from '../../infrastructure/auth/guards/mock-auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
  ) {}

  @Post()
  @UseGuards(MockAuthGuard)
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req,
  ) {
    const participants = [...createConversationDto.participantIds];
    const currentUserId = req.user.id;

    if (!participants.includes(currentUserId)) {
      participants.push(currentUserId);
    }

    return this.createConversationUseCase.execute({
      participantIds: participants,
    });
  }
}
