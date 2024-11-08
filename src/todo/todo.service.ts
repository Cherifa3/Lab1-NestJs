import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) 
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  // Méthode pour mettre à jour un Todo
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } }); // Find the Todo by id
    if (!todo) {
      throw new Error('Todo non trouvé');
    }

    // Mettre à jour l'objet Todo avec les valeurs de l'UpdateTodoDto
    Object.assign(todo, updateTodoDto);

    // Sauvegarder l'entité mise à jour
    return await this.todoRepository.save(todo);
  }

  // Méthode pour effectuer un soft delete
  async softDelete(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id } }); // Find the Todo by id
    if (!todo) {
      throw new Error('Todo non trouvé');
    }

    // Mettre à jour le champ deletedAt pour effectuer un soft delete
    todo.deletedAt = new Date();
    await this.todoRepository.save(todo);
  }
  
  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(createTodoDto); // Create a new Todo
    return this.todoRepository.save(todo); // Save it to the DB
  }

  findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find(); // Get all Todos
  }

  findOne(id: number): Promise<TodoEntity | undefined> {
    return this.todoRepository.findOne({ where: { id } }); 
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.updateTodo(id, updateTodoDto); 
  }

  remove(id: number): Promise<void> {
    return this.softDelete(id); 
  }
}
