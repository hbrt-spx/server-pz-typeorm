import { ProjectInvitation } from 'src/invitations/entities/invitation.entity'; // Importando convite
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

  // Relação com os projetos que o usuário criou
  @OneToMany(() => Project, project => project.user)
  projects: Project[];

  @ManyToMany(() => Project, project => project.members)
  projectsParticipating: Project[];

  // Relação com as tarefas que o usuário é responsável
  @OneToMany(() => Task, task => task.responsible)
  tasks: Task[];

  // Relação com os convites recebidos para os projetos
  @OneToMany(() => ProjectInvitation, invitation => invitation.user)
  invitationsReceived: ProjectInvitation[];

  // Relação com os convites enviados
  @OneToMany(() => ProjectInvitation, invitation => invitation.invited_by)
  sentInvitations: ProjectInvitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
