import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY_SERVICE } from '../repository/repository.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { configProvider } from '../app.config.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostrgreSqlRepositoryService } from 'src/repository/PostrgreSQLRepository/postrgre-sqlrepository.service';
import { OrderEntity } from 'src/order/entitys/order.entity';

export enum DBMS {
  MongoDB = 'mongodb',
  PostgreSQL = 'postgres',
}

@Module({})
export class DatabaseModule {
  static register(dbms: string) {
    const providers = [];
    const imports = [];
    const exports = [];

    providers.push(configProvider);
    console.log(configProvider.useValue.database);

    switch (dbms) {
      default:
      case DBMS.PostgreSQL:
        providers.push({
          provide: ORDER_REPOSITORY_SERVICE,
          useClass: PostrgreSqlRepositoryService,
        });
        imports.push(
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: configProvider.useValue.database.url,
            port: configProvider.useValue.database.sqldatabase.port,
            username: configProvider.useValue.database.sqldatabase.username,
            password: configProvider.useValue.database.sqldatabase.password,
            database: 'quickpay-db',
            entities: [OrderEntity],
            synchronize: true,
          }),
          TypeOrmModule.forFeature([OrderEntity]),
        );
        break;
    }
    exports.push(ORDER_REPOSITORY_SERVICE);
    return {
      module: DatabaseModule,
      imports,
      providers,
      exports,
    };
  }
}
