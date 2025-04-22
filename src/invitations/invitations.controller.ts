import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectInvitationService } from './invitations.service';
import { ProjectInvitation } from 'src/invitations/entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as jwt from 'jsonwebtoken';

@Controller('project-invitations')
export class ProjectInvitationController {
  constructor(private readonly invitationService: ProjectInvitationService) {}

  private decodeToken(token: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não definido');
    }

    try {
      const decoded: any = jwt.verify(token, secret);
      return decoded.sub;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  @Post(':projectId/invite')
  async inviteUserToProject(
    @Param('projectId') projectId: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<ProjectInvitation> {
    return this.invitationService.inviteUserToProject(
      projectId,
      createInvitationDto.userEmail,
      createInvitationDto.invitedById,
    );
  }

  @Put(':invitationId/accept')
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
  ): Promise<ProjectInvitation> {
    return this.invitationService.acceptInvitation(invitationId);
  }

  @Put(':invitationId/decline')
  async declineInvitation(
    @Param('invitationId') invitationId: string,
  ): Promise<ProjectInvitation> {
    return this.invitationService.declineInvitation(invitationId);
  }

  @Get(':userId/pending')
  async getPendingInvitations(
    @Param('userId') userId: string,
  ): Promise<ProjectInvitation[]> {
    return this.invitationService.getPendingInvitations(userId);
  }
}
