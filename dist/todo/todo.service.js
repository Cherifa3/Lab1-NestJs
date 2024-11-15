"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const common_2 = require("@nestjs/common");
const status_enum_1 = require("./entities/status.enum");
const typeorm_3 = require("typeorm");
let TodoService = class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    create(createTodoDto) {
        const todo = this.todoRepository.create(createTodoDto);
        return this.todoRepository.save(todo);
    }
    async addTodo(createTodoDto) {
        try {
            const existingTodo = await this.todoRepository.findOne({
                where: { name: createTodoDto.name }
            });
            if (existingTodo) {
                throw new common_2.BadRequestException(`Todo with name "${createTodoDto.name}" already exists`);
            }
            const newTodo = this.todoRepository.create({
                ...createTodoDto,
                status: status_enum_1.StatusEnum.PENDING,
            });
            const savedTodo = await this.todoRepository.save(newTodo);
            if (!savedTodo) {
                throw new common_2.InternalServerErrorException('Failed to create todo');
            }
            return savedTodo;
        }
        catch (error) {
            if (error instanceof common_2.BadRequestException || error instanceof common_2.InternalServerErrorException) {
                throw error;
            }
            console.error('Error while creating todo:', error);
            throw new common_2.InternalServerErrorException('An error occurred while creating the todo');
        }
    }
    async updateTodo(id, updateTodoDto) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_2.BadRequestException('Todo non trouvé');
        }
        Object.assign(todo, updateTodoDto);
        return await this.todoRepository.save(todo);
    }
    async deleteTodo(id) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_2.BadRequestException('Todo non trouvé');
        }
        try {
            await this.todoRepository.delete(id);
        }
        catch (error) {
            console.error('Erreur lors de la suppression du Todo:', error);
            throw new common_2.InternalServerErrorException('Une erreur est survenue lors de la suppression du Todo');
        }
    }
    async softDelete(id) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_2.BadRequestException('Todo non trouvé');
        }
        todo.deletedAt = new Date();
        await this.todoRepository.save(todo);
    }
    async restoreTodo(id) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_2.BadRequestException('Todo non trouvé');
        }
        if (!todo.deletedAt) {
            throw new common_2.BadRequestException('Ce Todo n\'a pas été supprimé');
        }
        todo.deletedAt = null;
        await this.todoRepository.save(todo);
    }
    findAll() {
        return this.todoRepository.find();
    }
    async findOneById(id) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            console.log(`Todo avec l'ID ${id} non trouvé`);
            throw new common_2.BadRequestException(`Todo avec l'ID ${id} non trouvé`);
        }
        return todo;
    }
    update(id, updateTodoDto) {
        return this.updateTodo(id, updateTodoDto);
    }
    remove(id) {
        return this.softDelete(id);
    }
    async countTodosByStatus() {
        const result = await this.todoRepository
            .createQueryBuilder('todo')
            .select('todo.status')
            .addSelect('COUNT(todo.id)', 'count')
            .groupBy('todo.status')
            .getRawMany();
        const statusCount = {
            [status_enum_1.StatusEnum.PENDING]: 0,
            [status_enum_1.StatusEnum.IN_PROGRESS]: 0,
            [status_enum_1.StatusEnum.COMPLETED]: 0,
        };
        result.forEach(item => {
            statusCount[item.status] = parseInt(item.count, 10);
        });
        return statusCount;
    }
    async findAll_NDS(name, description, status, page = 1, limit = 10) {
        const queryBuilder = this.todoRepository.createQueryBuilder('todo');
        queryBuilder.where(new typeorm_3.Brackets(qb => {
            if (name) {
                qb.where('todo.name LIKE :name', { name: `%${name}%` });
            }
            if (description) {
                qb.orWhere('todo.description LIKE :description', { description: `%${description}%` });
            }
        }));
        if (status) {
            queryBuilder.andWhere('todo.status = :status', { status });
        }
        const total = await queryBuilder.getCount();
        const data = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { data, total, page, limit };
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.TodoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodoService);
//# sourceMappingURL=todo.service.js.map