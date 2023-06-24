import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Employee } from './employee/entities/employee.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'me',
      password: 'password',
      database: 'seccode_stock_database',
      entities: [User, Employee, Product],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    EmployeeModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
