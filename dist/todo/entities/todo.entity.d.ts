import { StatusEnum } from './status.enum';
export declare class TodoEntity {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    status: StatusEnum;
    updatedAt: Date;
    deletedAt?: Date;
}
