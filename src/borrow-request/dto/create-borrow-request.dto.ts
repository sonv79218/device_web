import { IsUUID, IsString, IsDateString } from 'class-validator';

export class CreateBorrowRequestDto {
//   @IsUUID()
//   product_id: string;

  @IsString()
  note: string;

  @IsDateString()
  expected_return_date: string; // ISO 8601 string, ex: "2025-07-31"
}
