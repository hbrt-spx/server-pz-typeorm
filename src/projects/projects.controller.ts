import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Request } from '@nestjs/common';
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

@Get('my-projects/:userId')
async getRelatedProjects(@Param('userId') userId: string) {
  return this.projectsService.getAllRelatedProjects(userId);
}
 
  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
  //   return this.projectsService.update(id, updateProjectDto);
  // }

  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
