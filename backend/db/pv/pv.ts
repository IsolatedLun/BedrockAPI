// users/User.ts
import { Table, Column, Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface PvAttrs { 
  id: number; 
  username: string;
  attempts: number;
  token: string;
  otp: number;
}

type PvCreation = Optional<PvAttrs, 'id'>;

@Table
export class PV extends Model<PvAttrs, PvCreation> implements PvAttrs {
  public id!: number;

  @Column username!: string;
  @Column otp!: number;
  @Column attempts!: number;
  @Column token!: string;
}
