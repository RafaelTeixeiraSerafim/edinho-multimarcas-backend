import { Transform } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class BrandIdPathParamDTO {
  @IsString()
  @IsUUID()
  brandId: string;
}
