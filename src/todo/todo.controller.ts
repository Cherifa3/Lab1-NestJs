import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './entities/status.enum';
import { Query } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodo(createTodoDto);
  }

  @Get(':id') // Paramètre :id dans l'URL
  async getTodoById(@Param('id') id: number) {
    try {
      return await this.todoService.findOneById(id); // Appeler la méthode du service
    } catch (error) {
      throw error; // Si une erreur se produit, elle est automatiquement gérée par NestJS
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  /* endpoint delete de facon definitive
  @Delete(':id')
  async deleteTodo(@Param('id') id: number): Promise<void> {
    await this.todoService.deleteTodo(id);
  }
  */

  // endpoint softDelete
  @Delete(':id')
  async deleteTodo(@Param('id') id: number): Promise<void> {
    await this.todoService.softDelete(id);
  }
  
  // endpoint to restore
  @Patch(':id/restore')
  async restoreTodo(@Param('id') id: number): Promise<void> {
    await this.todoService.restoreTodo(id);
  }
  
  // Endpoint pour obtenir le nombre de todos par statut
  @Get('status/count')
  async getTodosCountByStatus() {
    const statusCount = await this.todoService.countTodosByStatus();
    return statusCount;
  }

  // Endpoint pour récupérer tous les todos slide 13
  @Get()
  async getAllTodos() {
    return this.todoService.findAll(); // Appeler la méthode du service
  }

  // slide 15+16 Endpoint pour récupérer tous les todos selon name, description, status avec pagination
  @Get('NDS')
async getTodos(
  @Query('name') name?: string,
  @Query('description') description?: string,
  @Query('status') status?: StatusEnum,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
): Promise<{ data: TodoEntity[]; total: number; page: number; limit: number }> {
  return this.todoService.findAll_NDS(name, description, status, page, limit); 
}


}
