import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Product])],
  controllers: [EmployeeController],
  providers: [EmployeeService, ProductService],
})
export class EmployeeModule {}
