import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Project])
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
