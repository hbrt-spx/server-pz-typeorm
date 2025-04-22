import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProjectInvitation } from './entities/invitation.entity';
import * as jwt from 'jsonwebtoken'

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class InvitationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
  const token = client.handshake.auth?.token as string;

  if (!token) {
    console.warn(`⚠️ Conexão sem token! Socket: ${client.id}`);
    return;
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.sub;

    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`🟢 ${userId} conectado - SocketID: ${client.id}`);
    } else {
      console.warn(`⚠️ Token não contém sub (userId). Socket: ${client.id}`);
    }
  } catch (err) {
    console.warn(`❌ Erro ao decodificar token JWT: ${err.message}`);
  }
}

  handleDisconnect(client: Socket) {
    const userId = [...this.userSockets.entries()]
      .find(([, socketId]) => socketId === client.id)?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      console.log(`🔴 ${userId} desconectado`);
    }
  }

 sendInvitation(userId: string, invitation: ProjectInvitation) {
  const socketId = this.userSockets.get(userId);
  if (socketId) {
    console.log(`Enviando convite para o socketId ${socketId}`);
    this.server.to(socketId).emit('newInvitation', invitation);
    console.log(`📨 Enviado convite para ${userId}`);
  } else {
    console.warn(`❌ Usuário ${userId} não está conectado via socket`);
  }
}

  @SubscribeMessage('sendInvitation')
  handleSendInvitation(@MessageBody() data: { userId: string; invitation: any }) {
    const socketId = this.userSockets.get(data.userId);

    if (socketId) {
      this.server.to(socketId).emit('newInvitation', data.invitation);
      console.log(`📨 Convite enviado para ${data.userId}`);
    } else {
      console.warn(`❌ Usuário ${data.userId} não está conectado`);
    }
  }

  @SubscribeMessage('acceptInvitation')
  handleAcceptInvitation(@MessageBody() data: { invitationId: string }) {
    this.server.emit('invitationAccepted', data.invitationId);
    console.log(`✅ Convite aceito: ${data.invitationId}`);
  }
}
