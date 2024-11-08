export declare class AppService {
    private readonly uuidGenerator;
    constructor(uuidGenerator: () => string);
    getHello(): string;
    generateNewUuid(): string;
}
