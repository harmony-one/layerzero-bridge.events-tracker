import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transfers {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  value: string;

  @Column({ unique: true })
  hash: string;

  @Column()
  blockNumber: number;
}
