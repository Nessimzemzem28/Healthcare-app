import { IsDate, IsOptional, IsString } from "@nestjs/class-validator";

export class UpdatePatientDto {

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsDate()
    birthDate?: Date;

    @IsOptional()
    @IsString()
    address?: string;

}
