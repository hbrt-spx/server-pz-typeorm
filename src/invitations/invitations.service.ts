import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectInvitation } from 'src/invitations/entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Status } from 'src/utils/invitation.status';
import { InvitationGateway } from './invitations.geteway';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class ProjectInvitationService {
  constructor(
    @InjectRepository(ProjectInvitation)
    private readonly invitationRepository: Repository<ProjectInvitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private readonly invitationGateway: InvitationGateway,
  ) {}

  async inviteUserToProject(projectId: string, userEmail: string, invitedById: string): Promise<ProjectInvitation> {

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingInvitation = await this.invitationRepository.findOne({
      where: { project: project, user: user, status: Status.PENDING },
    });

    if (existingInvitation) {
      throw new ForbiddenException('User already invited to this project');
    }

 
    const invitation = this.invitationRepository.create({
      project: project,
      user: user,
      invited_by: { id: invitedById },
      status: Status.PENDING, 
    });
    const savedInvitation = await this.invitationRepository.save(invitation);

const fullInvitation = await this.invitationRepository.findOne({
  where: { id: savedInvitation.id },
  relations: ['project', 'user'],
});


if (fullInvitation) {
  this.invitationGateway.sendInvitation(user.id, fullInvitation);
} else {
  console.warn(`⚠️ Convite não encontrado após salvar. ID: ${savedInvitation.id}`);
}


return savedInvitation;
  }

  async acceptInvitation(invitationId: string): Promise<ProjectInvitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['project', 'user'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== Status.ACCEPTED) {
  invitation.status = Status.ACCEPTED;
  invitation.accepted_at = new Date();

  
  invitation.project.members = [...(invitation.project.members || []), invitation.user];
  await this.projectRepository.save(invitation.project);
  await this.projectRepository.save(invitation)
}
this.invitationGateway.server.emit('invitationAccepted', invitation.id);
return invitation
  }

  async declineInvitation(invitationId: string): Promise<ProjectInvitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['project', 'user'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    invitation.status = Status.DECLINED;
    invitation.declined_at = new Date();

    return this.invitationRepository.save(invitation);
  }

  async getPendingInvitations(token: string): Promise<ProjectInvitation[]> {
const jwtService = new JwtService();

  try {
    const decoded = jwtService.decode(token) as { sub: string };
    const userId = decoded?.sub;

    if (!userId) {
      throw new Error('Usuário não autenticado ou token inválido');
    }

    await this.userRepository.findOne({
      where: { id: userId },
    });

    const invitations = await this.invitationRepository
    .createQueryBuilder('invitation')
    .innerJoinAndSelect('invitation.project', 'project')
    .where('invitation.user = :userId', { userId })
    .andWhere('invitation.status = :status', { status: Status.PENDING })
    .getMany();
  return invitations;

  } catch (error) {
    throw new Error(`Erro ao processar token JWT: ${error.message}`);
  }
}
}
