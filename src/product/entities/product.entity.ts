import { Employee } from 'src/employee/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'text', default: '' })
  size: string;

  @Column({ nullable: false, type: 'int', default: 0 })
  quantity: number;

  @ManyToMany(() => Employee, (employee) => employee.products, {})
  employees?: Employee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
