import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsEnum(['available', 'assigned', 'maintenance'])
  @IsOptional()
  status?: DeviceStatus;

  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsOptional()
  note?: string;
}
