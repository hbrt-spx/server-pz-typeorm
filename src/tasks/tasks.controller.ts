import { Controller, Post, Body, Param, ParseUUIDPipe, Get } from '@nestjs/common';
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

  // Criar uma nova tarefa
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, userId, projectId);
  }

  // Outros endpoints para listar, atualizar ou excluir tarefas podem ser adicionados aqui.
}
