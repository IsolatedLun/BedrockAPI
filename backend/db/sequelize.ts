import {Sequelize} from 'sequelize-typescript';
import { User } from './users/user';
import { Note } from './notes/note';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSW || "postgres",
  database: process.env.DB_NAME || "BedrockDB",
  port: parseInt(process.env.PORT) || 5432,
  models: [User, Note],
});