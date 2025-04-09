import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/entities/task.entity';
import { Project } from './projects/entities/project.entity';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ProjectInvitation } from './invitations/entities/invitation.entity';


@Module({
  imports: [UsersModule, ProjectsModule, TasksModule, InvitationsModule, TypeOrmModule.forRoot({
      type: 'postgres', 
      url: process.env.DATABASE_URL,
      entities: [User, Task, Project, ProjectInvitation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Task, Project, ProjectInvitation]),
    AuthModule,
    InvitationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
