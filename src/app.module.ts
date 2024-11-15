import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModuleModule } from './common-module/common-module.module';
import { TodoModule } from './todo/todo.module'; // Import TodoModule (which already contains TodoController and TodoService)
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'todos',
      entities: [TodoEntity],
      synchronize: true,
      logging: true,
    }),
    CommonModuleModule,
    TodoModule, // TodoModule is responsible for handling todos, it includes TodoController and TodoService
  ],
  controllers: [AppController], // AppController handles the root route or other non-todo routes
  providers: [AppService], // AppService provides the app-wide services
})
export class AppModule {}
