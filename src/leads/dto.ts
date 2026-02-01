import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class LeadsQueryDto {
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: "PENDING" | "JOINED" | "QUALIFIED";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
