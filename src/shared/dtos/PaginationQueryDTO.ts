import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationQueryDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? 1 : parsedValue;
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
}
