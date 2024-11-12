import { IsDate, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class CreatePatientDto {

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDate()
    birthDate: Date;

    @IsOptional()
    @IsString()
    address?: string;
}
