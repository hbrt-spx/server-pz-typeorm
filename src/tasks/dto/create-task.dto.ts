import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from 'src/utils/task.status';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
