import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { IsArray } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly productService: ProductService,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);

    return this.employeeRepository.save(newEmployee);
  }

  findAll() {
    return this.employeeRepository.find();
  }

  findOne(id: string) {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.checkIfEmployeeExists(id);

    return this.employeeRepository.save({
      ...employee,
      ...updateEmployeeDto,
    });
  }

  async remove(id: string) {
    const employee = await this.checkIfEmployeeExists(id);

    await this.employeeRepository.remove(employee);

    return {
      success: true,
    };
  }

  async findEmployeeByIdOrFail(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { products: true },
    });

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async checkIfEmployeeExists(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async addProductToEmployee(employeeId: string, productId: string) {
    const employee = await this.findEmployeeByIdOrFail(employeeId);
    const product = await this.productService.findProductByIdOrFail(productId);

    if (product.quantity <= 0) {
      throw new HttpException(
        'No more products in stock',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Array.isArray(employee.products)) {
      employee.products = [product];
    } else {
      employee.products.push(product);
    }

    await this.productService.update(product.id, {
      description: product.description,
      name: product.name,
      quantity: product.quantity - 1,
      size: product.size,
    });
    await this.employeeRepository.save(employee);

    return this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.products', 'product')
      .getOne();
  }
}
