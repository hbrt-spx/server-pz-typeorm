import { Task } from "src/tasks/entities/task.entity";
import { ProjectInvitation } from "src/invitations/entities/invitation.entity"; 
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => User, user => user.projects, { nullable: false })
  user: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectInvitation, invitation => invitation.project)
  invitations: ProjectInvitation[];

  @ManyToMany(() => User)
  @JoinTable({
  name: 'project_members',
  joinColumn: { name: 'project_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
