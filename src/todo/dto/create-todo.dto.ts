import { IsNotEmpty, IsString, Length, MinLength, MaxLength } from 'class-validator';
import { ERROR_MESSAGES } from '../../constants/error-messages';

export class CreateTodoDto {
  
  @IsNotEmpty({ message: ERROR_MESSAGES.NAME_REQUIRED })
  @IsString({ message: ERROR_MESSAGES.NAME_REQUIRED })
  @MinLength(3, { message: ERROR_MESSAGES.NAME_MIN_LENGTH })
  @MaxLength(10, { message: ERROR_MESSAGES.NAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  @MinLength(10, { message: ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH })
  description: string;
}
