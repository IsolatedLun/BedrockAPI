import {Sequelize} from 'sequelize-typescript';
import { User } from './users/user';
import { Note } from './notes/note';
import dotenv from "dotenv";
import { PV } from './pv/pv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSW || "postgres",
  database: process.env.DB_NAME || "BedrockDB",
  port: parseInt(process.env.DB_PORT) || 5432,
  models: [User, PV, Note],
});