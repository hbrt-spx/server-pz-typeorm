import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_invitations')
export class ProjectInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com o Projeto
  @ManyToOne(() => Project, (project) => project.invitations, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // Relacionamento com o Usuário que recebeu o convite
  @ManyToOne(() => User, (user) => user.invitationsReceived, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // Corrigido para 'user_id'
  user: User;

  // Relacionamento com o Usuário que enviou o convite
  @ManyToOne(() => User, (user) => user.sentInvitations, { nullable: true }) // 'nullable: true' porque o convidado pode ser nulo inicialmente
  @JoinColumn({ name: 'invited_by_id' }) // Corrigido para 'invited_by_id'
  invited_by: User;

  // Status do convite
  @Column({ default: 'pending' })
  status: string; // 'pending', 'accepted', 'declined'

  // Data de envio do convite
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invited_at: Date;

  // Data de aceitação do convite
  @Column({ type: 'timestamp', nullable: true })
  accepted_at: Date;

  // Data de recusa do convite
  @Column({ type: 'timestamp', nullable: true })
  declined_at: Date;
}
