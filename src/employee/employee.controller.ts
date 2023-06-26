import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.employeeService.remove(id);

    if (result.success) {
      return {
        message: 'Employee deleted successfully!',
      };
    }
  }

  @Post(':id/products/:productId')
  async addProductToEmployee(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.employeeService.addProductToEmployee(id, productId);
  }

  @Delete(':id/products/:productId')
  async removeProductFromEmployee(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.employeeService.removeProductFromEmployee(id, productId);
  }

  @Get(':id/products')
  async getProductsByEmployee(@Param('id') id: string) {
    return this.employeeService.getProductsByEmployee(id);
  }
}
