import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Employee } from './employee/entities/employee.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import { EmployeeProduct } from './employee/entities/employee-products';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'me',
        password: 'password',
        database: 'seccode_stock_database',
        autoLoadEntities: true,
        synchronize: true,
        entities: [Employee, User, Product, EmployeeProduct],
      }),
      dataSourceFactory: async (options) => {
        try {
          return await new DataSource(options).initialize();
        } catch (err) {
          console.log(err);
        }
      },
    }),
    AuthModule,
    EmployeeModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
