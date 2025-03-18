import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity'; 
import { Task } from '../../tasks/entities/task.entity'; 

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
}
