import { Exclude } from 'class-transformer';
import { HashService } from 'src/services/hash/HashService';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password)
      this.password = await new HashService().make(this.password);
  }

  @Column('text', { select: false })
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
