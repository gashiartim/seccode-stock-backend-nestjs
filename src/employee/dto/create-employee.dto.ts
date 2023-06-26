import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  licensed: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  parentName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  securing_city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  securing_point: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  license_expiration: number;
}
