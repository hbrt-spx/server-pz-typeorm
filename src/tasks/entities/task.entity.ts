import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { TaskStatus } from "src/utils/task.status";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, user => user.tasks)
  responsible: User;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
