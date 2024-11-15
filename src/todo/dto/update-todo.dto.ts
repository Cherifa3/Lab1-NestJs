import { IsOptional, IsString, MinLength, MaxLength, IsIn } from 'class-validator';
import { StatusEnum } from '../entities/status.enum';
import { ERROR_MESSAGES } from '../../constants/error-messages'; // Import the ERROR_MESSAGES constants

export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.NAME_REQUIRED }) // Use the error message from ERROR_MESSAGES
  @MinLength(3, { message: ERROR_MESSAGES.NAME_MIN_LENGTH }) // Use the error message from ERROR_MESSAGES
  @MaxLength(10, { message: ERROR_MESSAGES.NAME_MAX_LENGTH }) // Use the error message from ERROR_MESSAGES
  name?: string;

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED }) // Use the error message from ERROR_MESSAGES
  @MinLength(10, { message: ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH }) // Use the error message from ERROR_MESSAGES
  description?: string;

  @IsOptional()
  @IsIn([StatusEnum.PENDING, StatusEnum.IN_PROGRESS, StatusEnum.COMPLETED], {
    message: `Status must be one of: ${StatusEnum.PENDING}, ${StatusEnum.IN_PROGRESS}, ${StatusEnum.COMPLETED}`,
  }) // Correctly wrap the message in a template literal
  status?: StatusEnum;
}
