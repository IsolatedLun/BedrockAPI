// users/User.ts
import { Table, Column, Model, HasMany, Default } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Note } from '../notes/note';

interface UserAttrs { 
  id: number; 
  username: string;
  email: string;
  password: string;
  verified: boolean;
}

type UserCreation = Optional<UserAttrs, 'id'>;

@Table
export class User extends Model<UserAttrs, UserCreation> implements UserAttrs {
  public id!: number;

  @Column username!: string;
  @Column email!: string;
  @Column password!: string;
  
  @Default(false)
  @Column verified!: boolean;
  
  @HasMany(() => Note) notes!: Note[];
}
