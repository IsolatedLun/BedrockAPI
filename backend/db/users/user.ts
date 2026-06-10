// users/User.ts
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Note } from '../notes/note';

interface UserAttrs { 
  id: number; 
  name: string; 
  password: string;
}

type UserCreation = Optional<UserAttrs, 'id'>;

@Table
export class User extends Model<UserAttrs, UserCreation> implements UserAttrs {
  public id!: number;

  @Column name!: string;
  @Column password!: string;
  @HasMany(() => Note) notes!: Note[];
}
