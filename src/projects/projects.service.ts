import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/users/entities/user.entity'; 

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, description, userId } = createProjectDto;

    const user = await this.userRepository.findOne({
      where: {id: userId}
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = this.projectRepository.create({
      name,
      description,
      user,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['user', 'tasks'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user', 'tasks'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async getAllRelatedProjects(userId: string): Promise<Project[]> {
  return this.projectRepository
    .createQueryBuilder('project')
    .leftJoin('project.members', 'member')
    .leftJoinAndSelect('project.user', 'owner') 
    .leftJoinAndSelect('project.tasks', 'tasks') 
    .where('project.user.id = :userId', { userId }) 
    .orWhere('member.id = :userId', { userId })
    .getMany();
}




  // async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
  //   const project = await this.projectRepository.findOne({ where: { id } });
  //   if (!project) {
  //     throw new NotFoundException(`Project with ID ${id} not found`);
  //   }


  //   const updatedProject = Object.assign(project, updateProjectDto);
  //   return this.projectRepository.save(updatedProject);
  // }

  async remove(id: string): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.remove(project);
  }
}
