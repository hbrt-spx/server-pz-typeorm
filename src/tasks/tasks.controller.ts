import { Controller, Post, Body, Param, ParseUUIDPipe, Get, Delete, NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

   @Get('project-tasks/:projectId')
  async getTasksByProjectId(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.tasksService.findTasksByProjectId(projectId);
  }

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Body('userId') userId: string,
    @Body('projectId') projectId: string,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, userId, projectId);
  }

   @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    try {
      await this.tasksService.deleteTask(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Tarefa com o ID ${id} não encontrada.`);
      }
      throw error;
    }
  }
}
