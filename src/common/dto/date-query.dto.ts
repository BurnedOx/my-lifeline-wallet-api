import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class DateQueryDTO {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  to: Date;
}
