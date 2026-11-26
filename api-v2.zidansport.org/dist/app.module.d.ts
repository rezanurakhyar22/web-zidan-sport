import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
export declare class AppModule implements NestModule {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    configure(consumer: MiddlewareConsumer): void;
}
