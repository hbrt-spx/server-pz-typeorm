import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  @Get('user-projects/:userId')
  async findProjectsByUserId(@Param('userId') userId: string): Promise<Project[]> {
    const projects = await this.projectsService.findProjectsByUserId(userId);
    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for user with ID ${userId}`);
    }
    return projects;
  }

  // Rota para atualizar um projeto pelo ID
  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
  //   return this.projectsService.update(id, updateProjectDto);
  // }

  // Rota para remover um projeto pelo ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
