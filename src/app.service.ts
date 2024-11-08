import { Injectable , Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('UUID') private readonly uuidGenerator: () =>string) {}

  getHello(): string {
    return 'Hello World!';
  }
  generateNewUuid(): string {
    return this.uuidGenerator();
  }
}
