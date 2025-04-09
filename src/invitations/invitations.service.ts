import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectInvitation } from 'src/invitations/entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Status } from 'src/utils/invitation.status';


@Injectable()
export class ProjectInvitationService {
  constructor(
    @InjectRepository(ProjectInvitation)
    private readonly invitationRepository: Repository<ProjectInvitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // Enviar convite para um usuário
  async inviteUserToProject(projectId: string, userEmail: string, invitedById: string): Promise<ProjectInvitation> {
    // Verificando se o projeto existe
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verificando se o usuário existe
    const user = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificando se o usuário já foi convidado para o projeto
    const existingInvitation = await this.invitationRepository.findOne({
      where: { project: project, user: user, status: Status.PENDING },
    });

    if (existingInvitation) {
      throw new ForbiddenException('User already invited to this project');
    }

    // Criando o convite
    const invitation = this.invitationRepository.create({
      project: project,
      user: user,
      invited_by: { id: invitedById },
      status: Status.PENDING, // Convite enviado, aguardando aceitação
    });

    return this.invitationRepository.save(invitation);
  }

  // Aceitar um convite
  async acceptInvitation(invitationId: string): Promise<ProjectInvitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['project', 'user'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Atualizando o status para aceito
    invitation.status = Status.ACCEPTED;
    invitation.accepted_at = new Date();

    // Salvar a atualização
    return this.invitationRepository.save(invitation);
  }

  // Recusar um convite
  async declineInvitation(invitationId: string): Promise<ProjectInvitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['project', 'user'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Atualizando o status para recusado
    invitation.status = Status.DECLINED;
    invitation.declined_at = new Date();

    // Salvar a atualização
    return this.invitationRepository.save(invitation);
  }

  // Listar convites pendentes de um usuário
  async getPendingInvitations(userId: string): Promise<ProjectInvitation[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Buscar convites pendentes para o usuário
    return this.invitationRepository.find({
      where: { user: user, status: Status.PENDING },
      relations: ['project'],
    });
  }
}
