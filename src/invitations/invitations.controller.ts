import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { ProjectInvitationService } from './invitations.service';
import { ProjectInvitation } from 'src/invitations/entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('project-invitations')
export class ProjectInvitationController {
  constructor(private readonly invitationService: ProjectInvitationService) {}

  @Post(':projectId/invite')
  async inviteUserToProject(
    @Param('projectId') projectId: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<ProjectInvitation> {
    return this.invitationService.inviteUserToProject(projectId, createInvitationDto.userEmail, createInvitationDto.invitedById);
  }


  @Put(':invitationId/accept')
  async acceptInvitation(@Param('invitationId') invitationId: string): Promise<ProjectInvitation> {
    return this.invitationService.acceptInvitation(invitationId);
  }

  @Put(':invitationId/decline')
  async declineInvitation(@Param('invitationId') invitationId: string): Promise<ProjectInvitation> {
    return this.invitationService.declineInvitation(invitationId);
  }

  @Get(':userId/pending')
  async getPendingInvitations(@Param('userId') userId: string): Promise<ProjectInvitation[]> {
    return this.invitationService.getPendingInvitations(userId);
  }
}
