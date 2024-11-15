import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './entities/status.enum';
import { TodoEntity } from './entities/todo.entity';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    getTodoById(id: number): Promise<TodoEntity>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    deleteTodo(id: number): Promise<void>;
    restoreTodo(id: number): Promise<void>;
    getTodosCountByStatus(): Promise<{
        PENDING: number;
        IN_PROGRESS: number;
        COMPLETED: number;
    }>;
    getAllTodos(): Promise<TodoEntity[]>;
    getTodos(name?: string, description?: string, status?: StatusEnum, page?: number, limit?: number): Promise<{
        data: TodoEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
}
