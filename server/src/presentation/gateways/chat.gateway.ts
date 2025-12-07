// server/src/presentation/gateways/chat.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '../../core/use-cases/message/send-message.use-case';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    console.log(
      `Client ${client.id} a rejoint la conversation ${data.conversationId}`,
    );
    return {
      event: 'joined',
      message: `Vous avez rejoint la salle ${data.conversationId}`,
    };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { conversationId: string; content: string; senderId: string },
  ) {
    try {
      console.log(
        `📩 Reçu message de ${payload.senderId} pour ${payload.conversationId}`,
      );

      const message = await this.sendMessageUseCase.execute({
        conversationId: payload.conversationId,
        content: payload.content,
        senderId: payload.senderId,
      });

      this.server
        .to(payload.conversationId)
        .emit('newMessage', message.toJSON());

      console.log(`✅ Message envoyé et diffusé ! ID: ${message.id}`);

      return { status: 'ok', messageId: message.id };
    } catch (error) {
      console.error(`❌ Erreur envoi message : ${error.message}`); 
      return { status: 'error', error: error.message }; 
    }
  }
}
