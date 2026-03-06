import { Module } from '@nestjs/common';
import { MongoRepositoryService } from '../repository/MongoRepository/mongorepository.service';
import { FILM_REPOSITORY_SERVICE } from '../repository/repository.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { configProvider } from '../app.config.provider';
import { filmSchema, Film } from '../films/schemas/films.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostrgreSqlRepositoryService } from 'src/repository/PostrgreSQLRepository/postrgre-sqlrepository.service';
import { Schedule } from 'src/films/entitys/schedule.entity';
import { FilmEntity } from 'src/films/entitys/film.entity';

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

    switch (dbms) {
      case DBMS.PostgreSQL:
        providers.push({
          provide: FILM_REPOSITORY_SERVICE,
          useClass: PostrgreSqlRepositoryService,
        });
        imports.push(
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: configProvider.useValue.database.url,
            port: configProvider.useValue.database.sqldatabase.port,
            username: configProvider.useValue.database.sqldatabase.username,
            password: configProvider.useValue.database.sqldatabase.password,
            database: 'film-react-nest',
            entities: [FilmEntity, Schedule],
            synchronize: false,
          }),
          TypeOrmModule.forFeature([FilmEntity, Schedule]),
        );
        break;
      case DBMS.MongoDB:
      default:
        providers.push({
          provide: FILM_REPOSITORY_SERVICE,
          useClass: MongoRepositoryService,
        });
        imports.push(
          MongooseModule.forRoot(configProvider.useValue.database.url),
          MongooseModule.forFeature([{ name: Film.name, schema: filmSchema }]),
        );
        break;
    }
    exports.push(FILM_REPOSITORY_SERVICE);
    return {
      module: DatabaseModule,
      imports,
      providers,
      exports,
    };
  }
}
