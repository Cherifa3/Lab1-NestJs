import { Global, Module } from '@nestjs/common';
import { uuid } from 'uuidv4';


//Ce module va être souvent utilisé pensez à ca en le créant
@Global()
@Module({
providers: [
    {
        provide: 'UUID',
        useValue: uuid,
    },
],
exports: ['UUID'],
})
export class CommonModuleModule {}
