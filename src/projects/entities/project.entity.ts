import { Task } from "src/tasks/entities/task.entity";
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

  @ManyToOne(() => User, user => user.projects, { nullable: false })
  user: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @CreateDateColumn()
    createdAt: Date;
  
  @UpdateDateColumn()
    updatedAt: Date;
}
