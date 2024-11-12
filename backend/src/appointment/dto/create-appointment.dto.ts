import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class CreateAppointmentDto {

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsDateString()
    startTime : string;

    @IsNotEmpty()
    @IsString()
    doctor: string;

    @IsString()
    @IsOptional()
    reason?: string;

    @IsNotEmpty()
    patientId: number;
}
