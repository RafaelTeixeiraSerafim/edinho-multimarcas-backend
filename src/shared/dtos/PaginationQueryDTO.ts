import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min, IsString, IsIn } from "class-validator";

export class PaginationQueryDTO {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? 10 : parsedValue;
  })
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc", ""])
  @Transform(({ value }) => {
    return value || "asc";
  })
  orderBy?: "asc" | "desc";

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value || "createdAt";
  }) 
  orderByField?: string;
}
