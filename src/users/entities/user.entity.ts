import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @OneToMany(() => Task, task => task.responsible)
  tasks: Task[];

  @CreateDateColumn()
    createdAt: Date;
  
  @UpdateDateColumn()
    updatedAt: Date;
}
