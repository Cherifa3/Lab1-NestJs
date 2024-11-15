import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './entities/status.enum';
export declare class TodoService {
    private readonly todoRepository;
    constructor(todoRepository: Repository<TodoEntity>);
    create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    addTodo(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    deleteTodo(id: number): Promise<void>;
    softDelete(id: number): Promise<void>;
    restoreTodo(id: number): Promise<void>;
    findAll(): Promise<TodoEntity[]>;
    findOneById(id: number): Promise<TodoEntity>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    remove(id: number): Promise<void>;
    countTodosByStatus(): Promise<{
        [key in StatusEnum]: number;
    }>;
    findAll_NDS(name?: string, description?: string, status?: StatusEnum, page?: number, limit?: number): Promise<{
        data: TodoEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
}
