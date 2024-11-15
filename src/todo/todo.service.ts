import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { StatusEnum } from './entities/status.enum';
import { Brackets } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) 
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  //Version 1 creating a Todo : Approche basique avec validation simple
  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(createTodoDto); // Create a new Todo
    return this.todoRepository.save(todo); // Save it to the DB
  }

  //Version 2 creating a Todo slide 8 : Approche avancée avec gestion d'erreurs et validations supplémentaires
  async addTodo(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    try {
      // Vérifier si un todo avec le même nom existe déjà
      const existingTodo = await this.todoRepository.findOne({
        where: { name: createTodoDto.name }
      });

      if (existingTodo) {
        throw new BadRequestException(`Todo with name "${createTodoDto.name}" already exists`);
      }

      // Créer une nouvelle instance de TodoEntity
      const newTodo = this.todoRepository.create({
        ...createTodoDto,
        status: StatusEnum.PENDING,
      });

      // Sauvegarder dans la base de données
      const savedTodo = await this.todoRepository.save(newTodo);

      // Vérifier que la sauvegarde a bien fonctionné
      if (!savedTodo) {
        throw new InternalServerErrorException('Failed to create todo');
      }

      return savedTodo;
    } catch (error) {
      // Si l'erreur est déjà une exception NestJS, la relancer
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }

      // Sinon, logger l'erreur et renvoyer une erreur générique
      console.error('Error while creating todo:', error);
      throw new InternalServerErrorException('An error occurred while creating the todo');
    }
  }

  // Méthode pour mettre à jour un Todo
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } }); // Find the Todo by id
    if (!todo) {
      throw new BadRequestException('Todo non trouvé');
    }

    // Mettre à jour l'objet Todo avec les valeurs de l'UpdateTodoDto
    Object.assign(todo, updateTodoDto);

    // Sauvegarder l'entité mise à jour
    return await this.todoRepository.save(todo);
  }

  // Méthode pour supprimer un Todo de façon définitive
  async deleteTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id } }); // Trouver le Todo par ID

    if (!todo) {
      throw new BadRequestException('Todo non trouvé'); // Lancer une exception si le Todo n'existe pas
    }

    try {
      await this.todoRepository.delete(id); // Supprimer définitivement le Todo
    } catch (error) {
      // Gérer les erreurs en cas de problème lors de la suppression
      console.error('Erreur lors de la suppression du Todo:', error);
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du Todo');
    }
  }

  // Méthode pour effectuer un soft delete
  async softDelete(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id } }); // Find the Todo by id
    if (!todo) {
      throw new BadRequestException('Todo non trouvé');
    }
  
    await this.todoRepository.softDelete(id); // This sets the `deletedAt` field without removing the record.
  }
  
  async restoreTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted records
    });
  
    if (!todo) {
      throw new BadRequestException('Todo non trouvé');
    }
  
    if (!todo.deletedAt) {
      throw new BadRequestException('Ce Todo n\'a pas été supprimé');
    }
  
    todo.deletedAt = null; // Reset the `deletedAt` field
    await this.todoRepository.save(todo);
  }
  

  //slide 13 Get all Todos
  findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  //slide 14
  async findOneById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    
    if (!todo) {
      console.log(`Todo avec l'ID ${id} non trouvé`); // Ajoutez un log pour vérifier
      throw new BadRequestException(`Todo avec l'ID ${id} non trouvé`); // Gérer le cas où le Todo n'existe pas
    }

    return todo; // Retourner le Todo si trouvé
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.updateTodo(id, updateTodoDto); 
  }

  // slide 12 : Méthode pour compter les todos par statut
  async countTodosByStatus(): Promise<{ [key in StatusEnum]: number }> {
    const result = await this.todoRepository
      .createQueryBuilder('todo')
      .select('todo.status')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.status')
      .getRawMany();
  
    // Organize the results into a dictionary with status as the key
    const statusCount: { [key in StatusEnum]: number } = {
      [StatusEnum.PENDING]: 0,
      [StatusEnum.IN_PROGRESS]: 0,
      [StatusEnum.COMPLETED]: 0,
    };
  
    result.forEach(item => {
      statusCount[item.status as StatusEnum] = parseInt(item.count, 10);
    });
  
    return statusCount;
  }

  
async findAll_NDS(
  name?: string,
  description?: string,
  status?: StatusEnum,
  page: number = 1,
  limit: number = 10,
): Promise<{ data: TodoEntity[]; total: number; page: number; limit: number }> {
  const queryBuilder = this.todoRepository.createQueryBuilder('todo');

  // Ajouter des conditions dynamiques avec Brackets
  queryBuilder.where(
    new Brackets(qb => {
      if (name) {
        qb.where('todo.name LIKE :name', { name: `%${name}%` });
      }
      if (description) {
        qb.orWhere('todo.description LIKE :description', { description: `%${description}%` }); //orWhere car name 'ou' description
      }
    }),
  );

  // Ajouter une condition pour le statut, si fourni
  if (status) {
    queryBuilder.andWhere('todo.status = :status', { status }); //andWhere car il a dit 'et' status
  }
  
  // Pagination
  const total = await queryBuilder.getCount(); // Nombre total de résultats
  const data = await queryBuilder
    .skip((page - 1) * limit) // Décalage pour la pagination
    .take(limit)             // Limiter les résultats retournés
    .getMany();

  return { data, total, page, limit };


}
}