import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv';
config()
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions)
dataSource.initialize();
export default dataSource;