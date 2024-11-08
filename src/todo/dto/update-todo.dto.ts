import { IsOptional, IsString, Length, MinLength, MaxLength, IsIn } from 'class-validator';
import { StatusEnum } from '../entities/status.enum'; 

export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(10, { message: 'Name must not exceed 10 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description?: string;

  @IsOptional()
  @IsIn([StatusEnum.PENDING, StatusEnum.IN_PROGRESS, StatusEnum.COMPLETED], {
    message: `Status must be one of: ${StatusEnum.PENDING}, ${StatusEnum.IN_PROGRESS}, ${StatusEnum.COMPLETED}`,
  })
  status?: StatusEnum;
}
