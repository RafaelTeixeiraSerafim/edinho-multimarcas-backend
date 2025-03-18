import { IsString, IsUUID } from "class-validator";

export class IdPathParamDTO {
  @IsString()
  @IsUUID()
  id: string;
}