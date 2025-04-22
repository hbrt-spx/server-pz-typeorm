import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectInvitationService } from './invitations.service';
import { ProjectInvitation } from './entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectInvitationController } from './invitations.controller';
import { InvitationGateway } from './invitations.geteway';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectInvitation, User, Project])],
  providers: [ProjectInvitationService, InvitationGateway],
  exports: [ProjectInvitationService],
  controllers: [ProjectInvitationController]
})
export class InvitationsModule {}
