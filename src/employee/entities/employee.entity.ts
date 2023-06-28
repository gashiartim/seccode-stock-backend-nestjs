import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeProduct } from './employee-products';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  name: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  city: string;

  @Column({
    nullable: true,
    type: 'bool',
    default: true,
  })
  active: boolean;

  @Column({
    nullable: true,
    type: 'bool',
    default: false,
  })
  licensed: boolean;

  @Column({
    nullable: true,
    type: 'text',
  })
  parentName: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  phone_number: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  securing_city: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  securing_point: string;

  @Column({
    nullable: true,
    type: 'bigint',
  })
  license_expiration: number;

  // @ManyToMany(() => Product, (product) => product.employees, {
  //   onDelete: 'NO ACTION',
  // })
  // @JoinTable()
  // products: Product[];

  @OneToMany(
    () => EmployeeProduct,
    (employeeProduct) => employeeProduct.employee,
  )
  gears: EmployeeProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
