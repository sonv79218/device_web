import { Query } from '@nestjs/common';
import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer'; // 🔥 Cần import cái này
// DTO cho query filter
export class FilterProductDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['available', 'assigned', 'maintenance'])
  status?: string;

  @IsOptional()
@Type(() => Number) // ✅ Bắt buộc có
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
    @Type(() => Number) // ✅ Bắt buộc có
  @IsInt()
  @Min(1)
  limit?: number;
}
