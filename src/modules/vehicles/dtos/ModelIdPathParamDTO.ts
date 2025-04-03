import { Transform } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class ModelIdPathParamDTO {
  @IsString()
  @IsUUID()
  modelId: string;
}
