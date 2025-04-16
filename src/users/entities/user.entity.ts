import { ProjectInvitation } from 'src/invitations/entities/invitation.entity'; 
import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Project, project => project.user)
  projects: Project[];

  @ManyToMany(() => Project, project => project.members)
  projectsParticipating: Project[];

  @OneToMany(() => Task, task => task.responsible)
  tasks: Task[];

  @OneToMany(() => ProjectInvitation, invitation => invitation.user)
  invitationsReceived: ProjectInvitation[];

  @OneToMany(() => ProjectInvitation, invitation => invitation.invited_by)
  sentInvitations: ProjectInvitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
