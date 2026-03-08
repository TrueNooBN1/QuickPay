import { ConfigType, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dbConfig = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_URL || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'quickpay-db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  }),
);

export type IDbConfig = ConfigType<typeof dbConfig>;

export const AppDataSource = new DataSource(dbConfig());
