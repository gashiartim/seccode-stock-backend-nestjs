import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (product) => product.id)
  product: Product;

  @VirtualColumn({
    query: (alias) =>
      `SELECT SUM * FROM ${alias} JOIN employees ON ${alias}.id IN employee.gears`,
  })
  @Column({ type: 'bigint', nullable: false, default: 0 })
  quantity: number;
}
