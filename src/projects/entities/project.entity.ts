import { Task } from "src/tasks/entities/task.entity";
import { ProjectInvitation } from "src/invitations/entities/invitation.entity"; 
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  // Relação com o usuário que criou o projeto (gerente/admin)
  @ManyToOne(() => User, user => user.projects, { nullable: false })
  user: User;

  // Relação com as tarefas dentro do projeto
  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  // Relação com os convites para o projeto
  @OneToMany(() => ProjectInvitation, invitation => invitation.project)
  invitations: ProjectInvitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
