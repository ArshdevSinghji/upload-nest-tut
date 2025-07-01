import { configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Image } from './entity/image.entity';

configDotenv();

export const dataSourceOptions = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Image],
  synchronize: true,
  logging: false,
} as DataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
