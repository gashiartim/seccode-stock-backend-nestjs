import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { EmployeeProduct } from './entities/employee-products';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeProduct)
    private employeeProductRepository: Repository<EmployeeProduct>,
    private readonly productService: ProductService,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);

    return this.employeeRepository.save(newEmployee);
  }

  findAll() {
    return this.employeeRepository.find();
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['gears'],
    });

    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return employee;
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
    const employee = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.gears', 'employeeGear')
      .leftJoin('employeeGear.product', 'product')
      .addSelect([
        'product.id',
        'product.name',
        'product.size',
        'product.label',
      ])
      .where('employee.id = :id', { id })
      .getOne();

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

    const employeeProduct = new EmployeeProduct();
    employeeProduct.product = product;
    employeeProduct.employee = employee;

    await this.employeeProductRepository.save(employeeProduct);

    if (!Array.isArray(employee.gears)) {
      employee.gears = [employeeProduct];
    } else {
      employee.gears.push(employeeProduct);
    }

    await this.productService.update(product.id, {
      description: product.description,
      name: product.name,
      quantity: product.quantity - 1,
      size: product.size,
      label: product.label,
    });

    await this.employeeRepository.save(employee);

    return this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.gears', 'employeeGear')
      .leftJoin('employeeGear.product', 'product')
      .addSelect(['product.name', 'product.id', 'product.quantity'])
      .getOne();
  }

  async removeProductFromEmployee(employeeId: string, employeeGearId: string) {
    const employee = await this.findEmployeeByIdOrFail(employeeId);

    if (!Array.isArray(employee.gears)) {
      throw new HttpException(
        'This employee does not have any products',
        HttpStatus.BAD_REQUEST,
      );
    }

    const employeeGearIndex = employee.gears.findIndex((employeeGear) => {
      return employeeGear.id === employeeGearId;
    });

    if (employeeGearIndex < 0) {
      throw new HttpException(
        'This employee does not have this product',
        HttpStatus.BAD_REQUEST,
      );
    }

    const employeeGear = employee.gears[employeeGearIndex];

    const product = await this.productService.findProductByIdOrFail(
      employeeGear.product.id,
    );

    employee.gears = employee.gears.filter(
      (employeeGear) => employeeGear.id !== employeeGearId,
    );

    await this.productService.update(product.id, {
      description: product.description,
      name: product.name,
      quantity: product.quantity + 1,
      size: product.size,
      label: product.label,
    });
    await this.employeeRepository.save(employee);

    return this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.gears', 'emplyeeGear')
      .leftJoin('emplyeeGear.product', 'product')
      .addSelect(['product.name', 'product.id', 'product.quantity'])
      .getOne();
  }

  async getProductsByEmployee(employeeId: string) {
    const employee = await this.findEmployeeByIdOrFail(employeeId);

    return employee.gears;
  }
}
