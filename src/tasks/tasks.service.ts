import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskStatus } from 'src/utils/task.status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findTasksByProjectId(projectId: string): Promise<Task[]> {
    const project = await this.projectRepository.findOne({
      where: {id: projectId}
    });
    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // Buscar as tarefas associadas ao projeto
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'responsible'], // Carregar as entidades associadas
    });
  }

  async create(createTaskDto: CreateTaskDto, userId: string, projectId: string): Promise<Task> {
    const { title, description, status = TaskStatus.PENDING } = createTaskDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const task = this.taskRepository.create({
      title,
      description,
      status,
      responsible: user,
      project,
    });
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    await this.taskRepository.delete(taskId);
  }
}
