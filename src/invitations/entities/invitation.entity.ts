import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_invitations')
export class ProjectInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.invitations, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.invitationsReceived, { nullable: false })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @ManyToOne(() => User, (user) => user.sentInvitations, { nullable: true })
  @JoinColumn({ name: 'invited_by_id' }) 
  invited_by: User;

  @Column({ default: 'pending' })
  status: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invited_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  accepted_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  declined_at: Date;
}
