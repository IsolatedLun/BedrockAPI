// notes/Note.ts
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../users/user';

interface NoteAttrs { 
    id: number; 
    text: string; 
    userId: number, 
    createdAt: Date, 
    editedAt: Date 
};

type NoteCreation = Optional<NoteAttrs, 'id' | "createdAt" | "editedAt">;

@Table
export class Note extends Model<NoteAttrs, NoteCreation> implements NoteAttrs {
  public id!: number;

  @Column text!: string;
  @Column createdAt!: Date;
  @Column editedAt!: Date;
  @ForeignKey(() => User) @Column userId!: number;
  @BelongsTo(() => User) user!: User;
}
